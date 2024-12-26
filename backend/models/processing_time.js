const pool = require('../config/db');

const processingTime = {
    getAllTimes: async () => {
        const query = 'SELECT * FROM processing_times ORDER BY visa_type_id';
        const result = await pool.query(query);
        return result.rows;
    },

    getTimesByVisaType: async (visa_type_id) => {
        const query = 'SELECT * FROM processing_times WHERE visa_type_id = $1';
        const result = await pool.query(query, [visa_type_id]);
        return result.rows[0];
    },

    getHistoryByVisaType: async(visa_type_id) => {
      const query = 'SELECT * FROM processing_times WHERE visa_type_id = $1 ORDER BY collected_at';
      const result = await pool.query(query, [visa_type_id]);
      return result.rows;
    },

    postNewProcessingTime: async (visa_type_id, percent_50, percent_90) => {
      const query = 'INSERT INTO processing_times (visa_type_id, percent_50, percent_90, collected_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *';
      const result = await pool.query(query, [visa_type_id, percent_50, percent_90])
      return result.rows[0]
    }
};

module.exports = processingTime;