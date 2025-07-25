const axios = require('axios');
const pool = require('./config/db');

const API_URL = 'https://immi.homeaffairs.gov.au/_layouts/15/api/GPT.aspx/GetProcessGuideInfo';
const REFERER_URL = 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times/global-visa-processing-times';

// Função para obter o request digest token
async function getRequestDigest() {
    try {
        const response = await axios.post('https://immi.homeaffairs.gov.au/_api/contextinfo', '', {
            headers: {
                'Accept': 'application/json;odata=verbose',
                'Content-Type': 'application/json;odata=verbose',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
                'Referer': REFERER_URL
            }
        });
        return response.data.d.GetContextWebInformation.FormDigestValue;
    } catch (error) {
        console.error('Error getting request digest:', error);
        // Fallback - tentar sem digest
        return null;
    }
}

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
        console.log(`Fetching request digest for visa ${visaCode}...`);
        const requestDigest = await getRequestDigest();
        
        const headers = {
            'Accept': 'application/json;odata=verbose',
            'Content-Type': 'application/json;odata=verbose',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
            'Referer': REFERER_URL,
            'Origin': 'https://immi.homeaffairs.gov.au',
            'X-Requested-With': 'XMLHttpRequest',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'sec-ch-ua': '"Not:A-Brand";v="24", "Chromium";v="134"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'Priority': 'u=1, i'
        };

        // Adicionar request digest se conseguimos obter
        if (requestDigest) {
            headers['X-RequestDigest'] = requestDigest;
        }

        const payload = {
            gptRequest: {
                VisaSubclassCode: visaCode
            }
        };

        console.log(`Making API request for visa ${visaCode}...`);
        const response = await axios.post(API_URL, payload, {
            headers: headers,
            timeout: 30000 // 30 segundos timeout
        });
        
        if (response.data && response.data.d && response.data.d.data) {
            return response.data.d.data;
        } else {
            console.warn(`Unexpected response structure for visa ${visaCode}:`, response.data);
            return null;
        }
    } catch (error) {
        if (error.response) {
            console.error(`API error for visa ${visaCode}:`, {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data
            });
        } else {
            console.error(`Network error for visa ${visaCode}:`, error.message);
        }
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