const pool = require('../config/db');

const visaDetailsModel = {
  getVisaDetails: async (visaTypeId, streamId = null) => {
    let query;
    let params;

    if (streamId) {
        query = `
            SELECT 
                vt.*,
                vs.id as stream_id,
                vs.name as stream_name,
                pt.percent_50,
                pt.percent_90,
                pt.collected_at
            FROM visa_types vt
            LEFT JOIN visa_streams vs ON vt.id = vs.visa_type_id
            LEFT JOIN processing_times pt ON vt.id = pt.visa_type_id AND pt.visa_stream_id = vs.id
            WHERE vt.id = $1 AND vs.id = $2
            ORDER BY pt.collected_at DESC
            LIMIT 1`;
        params = [visaTypeId, streamId];
    } else {
        query = `
            SELECT 
                vt.*,
                vs.id as stream_id,
                vs.name as stream_name,
                pt.percent_50,
                pt.percent_90,
                pt.collected_at
            FROM visa_types vt
            LEFT JOIN visa_streams vs ON vt.id = vs.visa_type_id
            LEFT JOIN processing_times pt ON vt.id = pt.visa_type_id AND pt.visa_stream_id IS NULL
            WHERE vt.id = $1
            ORDER BY pt.collected_at DESC
            LIMIT 1`;
        params = [visaTypeId];
    }

    const result = await pool.query(query, params);
    return result.rows[0];
},

  getVisaHistory: async (visaTypeId, streamId = null) => {
      const query = `
          WITH history AS (
              SELECT 
                  pt.collected_at,
                  pt.percent_50,
                  pt.percent_90,
                  AVG(pt.percent_50) OVER (
                      ORDER BY pt.collected_at
                      ROWS BETWEEN 3 PRECEDING AND CURRENT ROW
                  ) as avg_50,
                  AVG(pt.percent_90) OVER (
                      ORDER BY pt.collected_at
                      ROWS BETWEEN 3 PRECEDING AND CURRENT ROW
                  ) as avg_90
              FROM processing_times pt
              WHERE pt.visa_type_id = $1
                  AND (pt.visa_stream_id = $2 OR ($2 IS NULL AND pt.visa_stream_id IS NULL))
              ORDER BY pt.collected_at DESC
              LIMIT 30
          )
          SELECT * FROM history
          ORDER BY collected_at ASC`;
      
      const result = await pool.query(query, [visaTypeId, streamId]);
      return result.rows;
  }
};

module.exports = visaDetailsModel;