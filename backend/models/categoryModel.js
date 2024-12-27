const pool = require('../config/db');

const categoryModel = {
    getAllCategories: async () => {
        const query = 'SELECT * FROM visa_categories ORDER BY id';
        const result = await pool.query(query);
        return result.rows;
    },

    getVisasByCategory : async (id) => {
        const query = 'SELECT * FROM visa_categories WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
};

module.exports = categoryModel;