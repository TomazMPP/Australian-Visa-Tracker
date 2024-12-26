const pool = require('../config/db');

const visaTypeModel = {
    getAllVisas: async () => {
        const query = 'SELECT * FROM visa_types ORDER BY id';
        const result = await pool.query(query);
        return result.rows;
    },

    getSpecificVisa: async (id) => {
        const query = 'SELECT * FROM visa_types WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
};

module.exports = visaTypeModel;