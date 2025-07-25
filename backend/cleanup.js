const pool = require('./config/db');
require('dotenv').config();

async function cleanupDatabase() {
    const client = await pool.connect();
    
    try {
        console.log('Starting database cleanup...');
        
        await client.query('BEGIN');
        
        // Remove visa 601 if it exists (Electronic Travel Authority - doesn't exist in API)
        const removeVisa601 = await client.query(
            'DELETE FROM visa_types WHERE visa_code = $1',
            ['601']
        );
        if (removeVisa601.rowCount > 0) {
            console.log('Removed visa 601 (Electronic Travel Authority)');
        }
        
        // Remove orphaned processing times (where visa_stream_id doesn't exist)
        const removeOrphanedTimes = await client.query(`
            DELETE FROM processing_times 
            WHERE visa_stream_id NOT IN (SELECT id FROM visa_streams)
        `);
        console.log(`Removed ${removeOrphanedTimes.rowCount} orphaned processing times`);
        
        // Remove streams that don't have any processing times
        const removeEmptyStreams = await client.query(`
            DELETE FROM visa_streams 
            WHERE id NOT IN (SELECT DISTINCT visa_stream_id FROM processing_times WHERE visa_stream_id IS NOT NULL)
        `);
        console.log(`Removed ${removeEmptyStreams.rowCount} empty streams`);
        
        // Remove visa types that don't have any streams
        const removeEmptyVisaTypes = await client.query(`
            DELETE FROM visa_types 
            WHERE id NOT IN (SELECT DISTINCT visa_type_id FROM visa_streams WHERE visa_type_id IS NOT NULL)
        `);
        console.log(`Removed ${removeEmptyVisaTypes.rowCount} visa types without streams`);
        
        await client.query('COMMIT');
        console.log('Database cleanup completed successfully!');
        
        // Show current counts
        const visaTypesCount = await client.query('SELECT COUNT(*) FROM visa_types');
        const streamsCount = await client.query('SELECT COUNT(*) FROM visa_streams');
        const timesCount = await client.query('SELECT COUNT(*) FROM processing_times');
        
        console.log('\nCurrent database state:');
        console.log(`- Visa types: ${visaTypesCount.rows[0].count}`);
        console.log(`- Visa streams: ${streamsCount.rows[0].count}`);
        console.log(`- Processing times: ${timesCount.rows[0].count}`);
        
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Cleanup failed:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

if (require.main === module) {
    cleanupDatabase();
}

module.exports = { cleanupDatabase }; 