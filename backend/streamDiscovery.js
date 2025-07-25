const axios = require('axios');
const pool = require('./config/db');
require('dotenv').config();

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function getRequestDigest() {
    try {
        const response = await axios.post('https://immi.homeaffairs.gov.au/_layouts/15/authenticate.aspx?Source=%2F', {}, {
            headers: {
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        return response.headers['x-requestdigest'] || response.data.FormDigestValue;
    } catch (error) {
        console.error('Error getting request digest:', error.message);
        throw error;
    }
}

async function testStream(visaSubclassCode, streamCode, requestDigest) {
    try {
        const requestData = {
            VisaSubclassCode: visaSubclassCode,
            StreamCode: streamCode.toString()
        };

        const response = await axios.post(
            'https://immi.homeaffairs.gov.au/_api/web/lists/getByTitle(\'Processing%20Times\')/items',
            requestData,
            {
                headers: {
                    'Accept': 'application/json;odata=verbose',
                    'Content-Type': 'application/json;odata=verbose',
                    'X-RequestDigest': requestDigest,
                    'X-Requested-With': 'XMLHttpRequest',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            }
        );

        if (response.data && response.data.d && response.data.d.results && response.data.d.results.length > 0) {
            const streamData = response.data.d.results[0];
            return {
                streamCode: streamCode,
                streamText: streamData.StreamText,
                visaUrl: streamData.VisaUrl
            };
        }
        return null;
    } catch (error) {
        // Expected for invalid stream codes
        return null;
    }
}

async function discoverStreamsForVisa(visaSubclassCode, requestDigest) {
    console.log(`Discovering streams for visa ${visaSubclassCode}...`);
    const discoveredStreams = [];
    
    for (let streamCode = 1; streamCode <= 100; streamCode++) {
        try {
            const stream = await testStream(visaSubclassCode, streamCode, requestDigest);
            if (stream) {
                discoveredStreams.push(stream);
                console.log(`Found stream ${streamCode}: ${stream.streamText}`);
            }
            
            // Rate limiting - wait 100ms between requests
            await delay(100);
        } catch (error) {
            console.error(`Error testing stream ${streamCode} for visa ${visaSubclassCode}:`, error.message);
        }
    }
    
    return discoveredStreams;
}

async function saveStreamsToDatabase(visaSubclassCode, streams) {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        // Get visa_type_id
        const visaTypeResult = await client.query(
            'SELECT id FROM visa_types WHERE visa_code = $1',
            [visaSubclassCode]
        );
        
        if (visaTypeResult.rows.length === 0) {
            console.log(`Visa type ${visaSubclassCode} not found in database`);
            return;
        }
        
        const visaTypeId = visaTypeResult.rows[0].id;
        
        for (const stream of streams) {
            // Check if stream already exists
            const existingStream = await client.query(
                'SELECT id FROM visa_streams WHERE visa_type_id = $1 AND stream_code = $2',
                [visaTypeId, stream.streamCode]
            );
            
            if (existingStream.rows.length === 0) {
                // Insert new stream
                await client.query(
                    'INSERT INTO visa_streams (visa_type_id, stream_name, stream_code, visa_url) VALUES ($1, $2, $3, $4)',
                    [visaTypeId, stream.streamText, stream.streamCode, stream.visaUrl]
                );
                console.log(`Added stream: ${stream.streamText} (${stream.streamCode})`);
            } else {
                // Update existing stream
                await client.query(
                    'UPDATE visa_streams SET stream_name = $1, visa_url = $2 WHERE visa_type_id = $3 AND stream_code = $4',
                    [stream.streamText, stream.visaUrl, visaTypeId, stream.streamCode]
                );
                console.log(`Updated stream: ${stream.streamText} (${stream.streamCode})`);
            }
        }
        
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error saving streams to database:', error);
        throw error;
    } finally {
        client.release();
    }
}

async function discoverAllStreams() {
    try {
        console.log('Starting stream discovery...');
        
        // Get request digest
        const requestDigest = await getRequestDigest();
        console.log('Got request digest');
        
        // Get all visa types from database
        const visaTypesResult = await pool.query('SELECT visa_code FROM visa_types ORDER BY visa_code');
        const visaCodes = visaTypesResult.rows.map(row => row.visa_code);
        
        console.log(`Found ${visaCodes.length} visa types to process:`, visaCodes);
        
        let totalStreamsFound = 0;
        
        for (const visaCode of visaCodes) {
            try {
                const streams = await discoverStreamsForVisa(visaCode, requestDigest);
                if (streams.length > 0) {
                    await saveStreamsToDatabase(visaCode, streams);
                    totalStreamsFound += streams.length;
                    console.log(`Visa ${visaCode}: Found ${streams.length} streams`);
                } else {
                    console.log(`Visa ${visaCode}: No streams found`);
                }
                
                // Longer delay between visa types to be respectful to the API
                await delay(500);
            } catch (error) {
                console.error(`Error processing visa ${visaCode}:`, error.message);
            }
        }
        
        console.log(`\nStream discovery completed!`);
        console.log(`Total streams found: ${totalStreamsFound}`);
        
    } catch (error) {
        console.error('Stream discovery failed:', error);
    } finally {
        await pool.end();
    }
}

if (require.main === module) {
    discoverAllStreams();
}

module.exports = { discoverAllStreams }; 