const pool = require('../config/db');

const processingTime = {
    getAllTimes: async () => {
        const query = `
            SELECT pt.*, vt.name as visa_name, vs.name as stream_name 
            FROM processing_times pt
            JOIN visa_types vt ON pt.visa_type_id = vt.id
            LEFT JOIN visa_streams vs ON pt.visa_stream_id = vs.id
            ORDER BY pt.visa_type_id, pt.visa_stream_id`;
        const result = await pool.query(query);
        return result.rows;
    },

    getTimesByVisaType: async (visa_type_id, visa_stream_id = null) => {
        const query = `
            SELECT 
            pt.*,
            vt.name as visa_name,
            vt.code,
            vs.name as stream_name,
            c.name as category_name,
            c.id as category_id
        FROM processing_times pt
        JOIN visa_types vt ON pt.visa_type_id = vt.id
        JOIN visa_categories c ON vt.category_id = c.id
        LEFT JOIN visa_streams vs ON pt.visa_stream_id = vs.id
        WHERE pt.visa_type_id = $1 
        AND (pt.visa_stream_id = $2 OR ($2 IS NULL AND pt.visa_stream_id IS NULL))
        ORDER BY pt.collected_at DESC 
        LIMIT 1`;
        const result = await pool.query(query, [visa_type_id, visa_stream_id]);
        return result.rows[0];
    },

    getHistoryByVisaType: async (visa_type_id, visa_stream_id = null) => {
        const query = `
             SELECT * FROM processing_times 
        WHERE visa_type_id = $1
        AND (visa_stream_id = $2 OR $2 IS NULL)
        ORDER BY collected_at`;
        const result = await pool.query(query, [visa_type_id, visa_stream_id]);
        return result.rows;
    },

    getTimesByCategory: async (category_id) => {
        const query = `
          WITH latest_times AS (
            SELECT DISTINCT ON (vt.id, COALESCE(vs.id, 0))
                vt.id AS visa_type_id,
                vt.name AS visa_name,
                vt.code AS code,
                vs.id AS stream_id,
                vs.name AS stream_name,
                pt.percent_50,
                pt.percent_90,
                pt.collected_at
            FROM visa_types vt
            LEFT JOIN visa_streams vs ON vt.id = vs.visa_type_id
            LEFT JOIN processing_times pt ON vt.id = pt.visa_type_id
                AND (pt.visa_stream_id = vs.id OR (vs.id IS NULL AND pt.visa_stream_id IS NULL))
            WHERE vt.category_id = $1
            ORDER BY vt.id, COALESCE(vs.id, 0), pt.collected_at DESC
        )
        SELECT * FROM latest_times
        ORDER BY visa_name, stream_name NULLS FIRST`;
        const result = await pool.query(query, [category_id]);
        return result.rows;
    },

    postNewProcessingTime: async (visa_type_id, percent_50, percent_90, visa_stream_id = null) => {
        const query = `
            INSERT INTO processing_times 
            (visa_type_id, percent_50, percent_90, collected_at, visa_stream_id) 
            VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4) 
            RETURNING *`;
        const result = await pool.query(query, [visa_type_id, percent_50, percent_90, visa_stream_id]);
        return result.rows[0];
    }
};

module.exports = processingTime;