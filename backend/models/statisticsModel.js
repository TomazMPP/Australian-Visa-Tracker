const pool = require('../config/db');

const statisticsModel = {
    getStatisticsByCategory: async (categoryId) => {
        const query = `
            WITH stats AS (
                SELECT 
                    pt.percent_90,
                    pt.percent_50,
                    vt.name as visa_name,
                    vt.category_id
                FROM processing_times pt
                JOIN visa_types vt ON pt.visa_type_id = vt.id
                WHERE vt.category_id = $1
                AND pt.percent_90 IS NOT NULL 
                AND pt.percent_50 IS NOT NULL
            )
            SELECT 
                COALESCE(MIN(percent_90), 0) as fastest_90,
                COALESCE(MAX(percent_90), 0) as slowest_90,
                COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY percent_90), 0) as median_90,
                COALESCE(MIN(percent_50), 0) as fastest_50,
                COALESCE(MAX(percent_50), 0) as slowest_50,
                COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY percent_50), 0) as median_50,
                COUNT(*) as total_records
            FROM stats`;
            
        const result = await pool.query(query, [categoryId]);
        return result.rows[0];
    }
};

module.exports = statisticsModel;