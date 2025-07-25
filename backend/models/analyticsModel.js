const pool = require('../config/db');

const analyticsModel = {
    // Get KPIs with current vs previous period comparison
    getKPIs: async () => {
        try {
            // Define current and previous periods (last 30 days vs previous 30 days)
            const kpiQuery = `
                WITH date_ranges AS (
                    SELECT 
                        CURRENT_DATE - INTERVAL '30 days' as current_start,
                        CURRENT_DATE as current_end,
                        CURRENT_DATE - INTERVAL '60 days' as previous_start,
                        CURRENT_DATE - INTERVAL '30 days' as previous_end
                ),
                current_period AS (
                    SELECT 
                        AVG((pt.percent_50 + pt.percent_90) / 2.0) as avg_processing_time,
                        COUNT(DISTINCT vt.id) as total_visa_types
                    FROM processing_times pt
                    JOIN visa_types vt ON pt.visa_type_id = vt.id
                    CROSS JOIN date_ranges dr
                    WHERE pt.collected_at::date >= dr.current_start 
                    AND pt.collected_at::date < dr.current_end
                ),
                previous_period AS (
                    SELECT 
                        AVG((pt.percent_50 + pt.percent_90) / 2.0) as avg_processing_time,
                        COUNT(DISTINCT vt.id) as total_visa_types
                    FROM processing_times pt
                    JOIN visa_types vt ON pt.visa_type_id = vt.id
                    CROSS JOIN date_ranges dr
                    WHERE pt.collected_at::date >= dr.previous_start 
                    AND pt.collected_at::date < dr.previous_end
                ),
                current_category_stats AS (
                    SELECT 
                        vc.name,
                        AVG((pt.percent_50 + pt.percent_90) / 2.0) as avg_time
                    FROM processing_times pt
                    JOIN visa_types vt ON pt.visa_type_id = vt.id
                    JOIN visa_categories vc ON vt.category_id = vc.id
                    CROSS JOIN date_ranges dr
                    WHERE pt.collected_at::date >= dr.current_start 
                    AND pt.collected_at::date < dr.current_end
                    GROUP BY vc.id, vc.name
                    HAVING COUNT(*) > 0
                ),
                previous_category_stats AS (
                    SELECT 
                        vc.name,
                        AVG((pt.percent_50 + pt.percent_90) / 2.0) as avg_time
                    FROM processing_times pt
                    JOIN visa_types vt ON pt.visa_type_id = vt.id
                    JOIN visa_categories vc ON vt.category_id = vc.id
                    CROSS JOIN date_ranges dr
                    WHERE pt.collected_at::date >= dr.previous_start 
                    AND pt.collected_at::date < dr.previous_end
                    GROUP BY vc.id, vc.name
                    HAVING COUNT(*) > 0
                )
                SELECT 
                    -- Average processing time
                    COALESCE(cp.avg_processing_time, 0) as current_avg,
                    COALESCE(pp.avg_processing_time, 0) as previous_avg,
                    CASE 
                        WHEN pp.avg_processing_time > 0 
                        THEN ROUND(((cp.avg_processing_time - pp.avg_processing_time) / pp.avg_processing_time * 100)::numeric, 1)
                        ELSE 0 
                    END as avg_change,
                    
                    -- Total visa types
                    COALESCE(cp.total_visa_types, 0) as current_types,
                    COALESCE(pp.total_visa_types, 0) as previous_types,
                    CASE 
                        WHEN pp.total_visa_types > 0 
                        THEN ROUND(((cp.total_visa_types - pp.total_visa_types)::numeric / pp.total_visa_types * 100), 1)
                        ELSE 0 
                    END as types_change,
                    
                    -- Fastest category (current)
                    (SELECT name FROM current_category_stats ORDER BY avg_time ASC LIMIT 1) as fastest_category,
                    (SELECT ROUND(avg_time) FROM current_category_stats ORDER BY avg_time ASC LIMIT 1) as fastest_time,
                    
                    -- Slowest category (current)
                    (SELECT name FROM current_category_stats ORDER BY avg_time DESC LIMIT 1) as slowest_category,
                    (SELECT ROUND(avg_time) FROM current_category_stats ORDER BY avg_time DESC LIMIT 1) as slowest_time
                    
                FROM current_period cp
                CROSS JOIN previous_period pp;
            `;

            const result = await pool.query(kpiQuery);
            const data = result.rows[0];

            // Calculate category changes
            const categoryChangeQuery = `
                WITH date_ranges AS (
                    SELECT 
                        CURRENT_DATE - INTERVAL '30 days' as current_start,
                        CURRENT_DATE as current_end,
                        CURRENT_DATE - INTERVAL '60 days' as previous_start,
                        CURRENT_DATE - INTERVAL '30 days' as previous_end
                ),
                current_fastest AS (
                    SELECT vc.name, AVG((pt.percent_50 + pt.percent_90) / 2.0) as avg_time
                    FROM processing_times pt
                    JOIN visa_types vt ON pt.visa_type_id = vt.id
                    JOIN visa_categories vc ON vt.category_id = vc.id
                    CROSS JOIN date_ranges dr
                    WHERE pt.collected_at::date >= dr.current_start 
                    AND pt.collected_at::date < dr.current_end
                    GROUP BY vc.id, vc.name
                    ORDER BY avg_time ASC LIMIT 1
                ),
                previous_fastest AS (
                    SELECT AVG((pt.percent_50 + pt.percent_90) / 2.0) as avg_time
                    FROM processing_times pt
                    JOIN visa_types vt ON pt.visa_type_id = vt.id
                    JOIN visa_categories vc ON vt.category_id = vc.id
                    CROSS JOIN date_ranges dr
                    CROSS JOIN current_fastest cf
                    WHERE pt.collected_at::date >= dr.previous_start 
                    AND pt.collected_at::date < dr.previous_end
                    AND vc.name = cf.name
                ),
                current_slowest AS (
                    SELECT vc.name, AVG((pt.percent_50 + pt.percent_90) / 2.0) as avg_time
                    FROM processing_times pt
                    JOIN visa_types vt ON pt.visa_type_id = vt.id
                    JOIN visa_categories vc ON vt.category_id = vc.id
                    CROSS JOIN date_ranges dr
                    WHERE pt.collected_at::date >= dr.current_start 
                    AND pt.collected_at::date < dr.current_end
                    GROUP BY vc.id, vc.name
                    ORDER BY avg_time DESC LIMIT 1
                ),
                previous_slowest AS (
                    SELECT AVG((pt.percent_50 + pt.percent_90) / 2.0) as avg_time
                    FROM processing_times pt
                    JOIN visa_types vt ON pt.visa_type_id = vt.id
                    JOIN visa_categories vc ON vt.category_id = vc.id
                    CROSS JOIN date_ranges dr
                    CROSS JOIN current_slowest cs
                    WHERE pt.collected_at::date >= dr.previous_start 
                    AND pt.collected_at::date < dr.previous_end
                    AND vc.name = cs.name
                )
                SELECT 
                    CASE 
                        WHEN pf.avg_time > 0 
                        THEN ROUND(((cf.avg_time - pf.avg_time) / pf.avg_time * 100)::numeric, 1)
                        ELSE 0 
                    END as fastest_change,
                    CASE 
                        WHEN ps.avg_time > 0 
                        THEN ROUND(((cs.avg_time - ps.avg_time) / ps.avg_time * 100)::numeric, 1)
                        ELSE 0 
                    END as slowest_change
                FROM current_fastest cf
                CROSS JOIN previous_fastest pf
                CROSS JOIN current_slowest cs
                CROSS JOIN previous_slowest ps;
            `;

            const changeResult = await pool.query(categoryChangeQuery);
            const changeData = changeResult.rows[0] || { fastest_change: 0, slowest_change: 0 };

            return {
                averageProcessingTime: {
                    current: Math.round(data.current_avg || 0),
                    previous: Math.round(data.previous_avg || 0),
                    change: parseFloat(data.avg_change || 0)
                },
                fastestCategory: {
                    name: data.fastest_category || "N/A",
                    time: parseInt(data.fastest_time || 0),
                    change: parseFloat(changeData.fastest_change || 0)
                },
                slowestCategory: {
                    name: data.slowest_category || "N/A",
                    time: parseInt(data.slowest_time || 0),
                    change: parseFloat(changeData.slowest_change || 0)
                },
                totalVisaTypes: {
                    current: parseInt(data.current_types || 0),
                    previous: parseInt(data.previous_types || 0),
                    change: parseFloat(data.types_change || 0)
                }
            };
        } catch (error) {
            console.error('Error in getKPIs:', error);
            throw error;
        }
    },

    // Get trends for available data points (not forcing daily series)
    getTrends: async () => {
        try {
            const trendsQuery = `
                WITH available_dates AS (
                    SELECT DISTINCT pt.collected_at::date as date
                    FROM processing_times pt
                    WHERE pt.collected_at >= CURRENT_DATE - INTERVAL '60 days'
                    ORDER BY date
                ),
                category_trends AS (
                    SELECT 
                        pt.collected_at::date as date,
                        vc.name as category,
                        ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY pt.percent_90)) as median_90
                    FROM processing_times pt
                    JOIN visa_types vt ON pt.visa_type_id = vt.id
                    JOIN visa_categories vc ON vt.category_id = vc.id
                    WHERE pt.collected_at >= CURRENT_DATE - INTERVAL '60 days'
                    GROUP BY pt.collected_at::date, vc.id, vc.name
                    HAVING COUNT(*) > 0
                )
                SELECT 
                    ad.date,
                    COALESCE(
                        json_object_agg(
                            ct.category, 
                            ct.median_90
                        ) FILTER (WHERE ct.category IS NOT NULL),
                        '{}'::json
                    ) as categories
                FROM available_dates ad
                LEFT JOIN category_trends ct ON ad.date = ct.date
                GROUP BY ad.date
                ORDER BY ad.date;
            `;

            const result = await pool.query(trendsQuery);
            
            // Filter out empty dates and return only dates with actual data
            return result.rows
                .filter(row => Object.keys(JSON.parse(JSON.stringify(row.categories))).length > 0)
                .map(row => ({
                    date: row.date.toISOString().split('T')[0],
                    ...JSON.parse(JSON.stringify(row.categories))
                }));
        } catch (error) {
            console.error('Error in getTrends:', error);
            throw error;
        }
    },

    // Get category comparison with change percentages
    getComparison: async () => {
        try {
            const comparisonQuery = `
                WITH date_ranges AS (
                    SELECT 
                        CURRENT_DATE - INTERVAL '30 days' as current_start,
                        CURRENT_DATE as current_end,
                        CURRENT_DATE - INTERVAL '60 days' as previous_start,
                        CURRENT_DATE - INTERVAL '30 days' as previous_end
                ),
                current_stats AS (
                    SELECT 
                        vc.name as category,
                        PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY pt.percent_90) as median_90,
                        PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY pt.percent_50) as median_50
                    FROM processing_times pt
                    JOIN visa_types vt ON pt.visa_type_id = vt.id
                    JOIN visa_categories vc ON vt.category_id = vc.id
                    CROSS JOIN date_ranges dr
                    WHERE pt.collected_at::date >= dr.current_start 
                    AND pt.collected_at::date < dr.current_end
                    GROUP BY vc.id, vc.name
                    HAVING COUNT(*) > 0
                ),
                previous_stats AS (
                    SELECT 
                        vc.name as category,
                        PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY pt.percent_90) as median_90
                    FROM processing_times pt
                    JOIN visa_types vt ON pt.visa_type_id = vt.id
                    JOIN visa_categories vc ON vt.category_id = vc.id
                    CROSS JOIN date_ranges dr
                    WHERE pt.collected_at::date >= dr.previous_start 
                    AND pt.collected_at::date < dr.previous_end
                    GROUP BY vc.id, vc.name
                    HAVING COUNT(*) > 0
                )
                SELECT 
                    cs.category,
                    ROUND(cs.median_90) as median_90,
                    ROUND(cs.median_50) as median_50,
                    CASE 
                        WHEN ps.median_90 > 0 
                        THEN ROUND(((cs.median_90 - ps.median_90) / ps.median_90 * 100)::numeric, 1)
                        ELSE 0 
                    END as change
                FROM current_stats cs
                LEFT JOIN previous_stats ps ON cs.category = ps.category
                ORDER BY cs.median_90 ASC;
            `;

            const result = await pool.query(comparisonQuery);
            
            return result.rows.map(row => ({
                category: row.category,
                median_90: parseInt(row.median_90 || 0),
                median_50: parseInt(row.median_50 || 0),
                change: parseFloat(row.change || 0)
            }));
        } catch (error) {
            console.error('Error in getComparison:', error);
            throw error;
        }
    },

    // Get current processing time distribution
    getDistribution: async () => {
        try {
            const distributionQuery = `
                WITH latest_data AS (
                    SELECT DISTINCT ON (vt.id)
                        vt.id,
                        pt.percent_90
                    FROM processing_times pt
                    JOIN visa_types vt ON pt.visa_type_id = vt.id
                    WHERE pt.collected_at >= CURRENT_DATE - INTERVAL '7 days'
                    ORDER BY vt.id, pt.collected_at DESC
                ),
                distribution_ranges AS (
                    SELECT 
                        CASE 
                            WHEN percent_90 BETWEEN 0 AND 30 THEN '0-30 days'
                            WHEN percent_90 BETWEEN 31 AND 60 THEN '31-60 days'
                            WHEN percent_90 BETWEEN 61 AND 90 THEN '61-90 days'
                            WHEN percent_90 BETWEEN 91 AND 120 THEN '91-120 days'
                            WHEN percent_90 BETWEEN 121 AND 180 THEN '121-180 days'
                            ELSE '180+ days'
                        END as range,
                        COUNT(*) as count
                    FROM latest_data
                    GROUP BY 
                        CASE 
                            WHEN percent_90 BETWEEN 0 AND 30 THEN '0-30 days'
                            WHEN percent_90 BETWEEN 31 AND 60 THEN '31-60 days'
                            WHEN percent_90 BETWEEN 61 AND 90 THEN '61-90 days'
                            WHEN percent_90 BETWEEN 91 AND 120 THEN '91-120 days'
                            WHEN percent_90 BETWEEN 121 AND 180 THEN '121-180 days'
                            ELSE '180+ days'
                        END
                ),
                total_count AS (
                    SELECT SUM(count) as total FROM distribution_ranges
                )
                SELECT 
                    dr.range,
                    dr.count,
                    ROUND((dr.count::numeric / tc.total * 100), 1) as percentage
                FROM distribution_ranges dr
                CROSS JOIN total_count tc
                ORDER BY 
                    CASE dr.range
                        WHEN '0-30 days' THEN 1
                        WHEN '31-60 days' THEN 2
                        WHEN '61-90 days' THEN 3
                        WHEN '91-120 days' THEN 4
                        WHEN '121-180 days' THEN 5
                        WHEN '180+ days' THEN 6
                    END;
            `;

            const result = await pool.query(distributionQuery);
            
            return result.rows.map(row => ({
                range: row.range,
                count: parseInt(row.count || 0),
                percentage: parseFloat(row.percentage || 0)
            }));
        } catch (error) {
            console.error('Error in getDistribution:', error);
            throw error;
        }
    }
};

module.exports = analyticsModel; 