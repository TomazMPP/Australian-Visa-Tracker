const axios = require('axios');
const pool = require('./config/db');

const API_URL = 'https://immi.homeaffairs.gov.au/_layouts/15/api/GPT.aspx/GetProcessGuideInfo';

async function getVisaTypesWithStreams() {
    const query = `
        SELECT 
            vt.id as visa_type_id,
            vt.code,
            vs.id as stream_id,
            vs.name as stream_name
        FROM visa_types vt
        LEFT JOIN visa_streams vs ON vt.id = vs.visa_type_id`;
    const result = await pool.query(query);
    return result.rows;
}

async function fetchProcessingTimes(visaCode) {
    try {
        const response = await axios.post(API_URL, {
            gptRequest: {
                VisaSubclassCode: visaCode
            }
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data.d.data;
    } catch (error) {
        console.error(`Error fetching data for visa ${visaCode}:`, error);
        return null;
    }
}

async function getOrInsertVisaStream(visaTypeId, streamName) {
    const checkQuery = `
        SELECT id FROM visa_streams 
        WHERE visa_type_id = $1 AND name = $2`;
    const checkResult = await pool.query(checkQuery, [visaTypeId, streamName]);

    if (checkResult.rows.length > 0) {
        return checkResult.rows[0].id;
    } else {
        const insertQuery = `
            INSERT INTO visa_streams (visa_type_id, name)
            VALUES ($1, $2)
            RETURNING id`;
        const insertResult = await pool.query(insertQuery, [visaTypeId, streamName]);
        return insertResult.rows[0].id;
    }
}

async function saveProcessingTimes(visaTypeId, streamId, data) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const percent50 = parseInt(data.Percent50);
        const percent90 = parseInt(data.Percent90);

        if (isNaN(percent50) || isNaN(percent90)) {
            console.warn(`Ignoring stream ${streamId} for visa_type_id ${visaTypeId} due to missing processing times`);
            return; 
        }

        const insertQuery = `
            INSERT INTO processing_times 
            (visa_type_id, visa_stream_id, percent_50, percent_90, collected_at)
            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`;
        
        await client.query(insertQuery, [
            visaTypeId,
            streamId,
            percent50,
            percent90
        ]);

        await client.query('COMMIT');
        console.log(`Saved data for visa_type_id: ${visaTypeId}, stream_id: ${streamId || 'NULL'}`);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error saving data:', error);
        throw error;
    } finally {
        client.release();
    }
}

async function runScraper() {
    try {
        console.log('Starting scraper...');
        const visaTypes = await getVisaTypesWithStreams();
        
        const visasByCode = visaTypes.reduce((acc, visa) => {
            if (!acc[visa.code]) {
                acc[visa.code] = [];
            }
            acc[visa.code].push(visa);
            return acc;
        }, {});

        for (const [code, visas] of Object.entries(visasByCode)) {
            console.log(`Fetching data for visa code ${code}...`);
            const apiData = await fetchProcessingTimes(code);
            
            if (!apiData || !apiData.length) {
                console.warn(`No data returned for visa code ${code}`);
                continue;
            }

            if (apiData.length === 1 && !apiData[0].StreamText) {
                const visa = visas[0];
                await saveProcessingTimes(visa.visa_type_id, null, apiData[0]);
            } 
            else {
                for (const streamData of apiData) {
                    const streamName = streamData.StreamText;
                    const visa = visas[0]; 

                    const percent50 = parseInt(streamData.Percent50);
                    const percent90 = parseInt(streamData.Percent90);

                    if (isNaN(percent50) || isNaN(percent90)) {
                        console.warn(`Ignoring stream ${streamName} for visa ${code} due to missing processing times`);
                        continue; 
                    }

                    const streamId = await getOrInsertVisaStream(visa.visa_type_id, streamName);
                    console.log(`Stream processed: ${streamName} for visa ${code}`);

                    await saveProcessingTimes(visa.visa_type_id, streamId, streamData);
                }
            }

            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        console.log('Scraper finished successfully');
    } catch (error) {
        console.error('Error running scraper:', error);
        throw error;
    }
}

module.exports = { runScraper };