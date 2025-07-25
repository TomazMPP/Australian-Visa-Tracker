# Analytics Dashboard - Real Data Integration Guide

## Overview
The Analytics Dashboard has been built to work with your existing PostgreSQL database structure. This guide explains how to integrate it with real data from your processing times scraper.

## Database Structure
Your current database has the following relevant tables:
- `processing_times` - Contains historical processing time data
- `visa_types` - Visa type definitions  
- `visa_categories` - Category groupings
- `visa_streams` - Sub-categories within visa types

## Required API Endpoints

### 1. Main Analytics Data Endpoint
**Endpoint:** `GET /analytics/processing-times`

**SQL Query:**
```sql
SELECT 
  pt.visa_type_id,
  pt.percent_50,
  pt.percent_90,
  pt.collected_at,
  vt.name as visa_name,
  vt.code as visa_code,
  vc.name as category_name,
  vc.id as category_id
FROM processing_times pt
JOIN visa_types vt ON pt.visa_type_id = vt.id
JOIN visa_categories vc ON vt.category_id = vc.id
WHERE pt.collected_at >= NOW() - INTERVAL '6 months'
ORDER BY pt.collected_at DESC;
```

**Expected Response Format:**
```json
[
  {
    "visa_type_id": 1,
    "percent_50": 14,
    "percent_90": 28,
    "collected_at": "2024-01-01T00:00:00Z",
    "visa_name": "Visitor visa (subclass 600)",
    "visa_code": "600",
    "category_name": "Visitor visas",
    "category_id": 1
  }
]
```

### 2. Trends Data (Optional - can be calculated from main endpoint)
**Endpoint:** `GET /analytics/category-trends?days=30`

### 3. Distribution Data (Optional - can be calculated from main endpoint)  
**Endpoint:** `GET /analytics/distribution?timeframe=week`

## Recommended: Analytics Snapshots Table

To improve performance and track historical changes, create a daily aggregation table:

```sql
CREATE TABLE analytics_snapshots (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES visa_categories(id),
  median_90 INTEGER,
  median_50 INTEGER,
  fastest_90 INTEGER,
  slowest_90 INTEGER,
  total_visa_types INTEGER,
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(category_id, snapshot_date)
);
```

### Daily Aggregation Script (run in your scraper)
```sql
INSERT INTO analytics_snapshots (category_id, median_90, median_50, fastest_90, slowest_90, total_visa_types, snapshot_date)
SELECT 
  vc.id as category_id,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY latest.percent_90) as median_90,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY latest.percent_50) as median_50,
  MIN(latest.percent_90) as fastest_90,
  MAX(latest.percent_90) as slowest_90,
  COUNT(DISTINCT latest.visa_type_id) as total_visa_types,
  CURRENT_DATE
FROM (
  SELECT DISTINCT ON (pt.visa_type_id) 
    pt.visa_type_id,
    pt.percent_90,
    pt.percent_50,
    vt.category_id
  FROM processing_times pt
  JOIN visa_types vt ON pt.visa_type_id = vt.id
  WHERE pt.collected_at::date = CURRENT_DATE
  ORDER BY pt.visa_type_id, pt.collected_at DESC
) latest
JOIN visa_categories vc ON latest.category_id = vc.id
GROUP BY vc.id
ON CONFLICT (category_id, snapshot_date) 
DO UPDATE SET
  median_90 = EXCLUDED.median_90,
  median_50 = EXCLUDED.median_50,
  fastest_90 = EXCLUDED.fastest_90,
  slowest_90 = EXCLUDED.slowest_90,
  total_visa_types = EXCLUDED.total_visa_types,
  created_at = NOW();
```

## Integration Steps

### Step 1: Backend API Implementation
1. Create the main analytics endpoint that returns data in the expected format
2. Optionally implement the aggregation table for better performance
3. Add the daily aggregation to your scraper process

### Step 2: Frontend Integration  
1. Replace the mock data in `src/pages/Analytics/index.jsx`:
```javascript
// Replace this line:
const rawProcessingData = generateMockData(90);

// With:
const response = await api.get('/analytics/processing-times');
const rawProcessingData = response.data;
```

2. Remove the mock data import and utilities when no longer needed

### Step 3: Testing
1. Verify the API returns data in the correct format
2. Test that charts render correctly with real data
3. Validate that trend calculations work with your data patterns

## Performance Considerations

1. **Data Volume:** With 6 months of data, the endpoint might return large datasets. Consider:
   - Pagination for very large datasets
   - Compression for API responses
   - Caching computed analytics

2. **Real-time Updates:** The dashboard currently loads data on page load. For real-time updates:
   - Add periodic refresh (every 5-10 minutes)
   - WebSocket connection for live updates
   - Background refresh with loading indicators

3. **Aggregation:** Use the analytics_snapshots table for:
   - Faster loading of historical trends
   - Reduced computation on the frontend
   - Better tracking of day-to-day changes

## Current Mock Data
The dashboard currently uses realistic mock data that simulates:
- 5 visa categories
- Multiple visa types per category 
- 90 days of historical data
- Realistic processing time variations

This allows you to see the full functionality while implementing the backend integration.

## Monitoring & Debugging

1. Check browser console for API errors
2. Verify data format matches expected structure
3. Monitor calculation performance with large datasets
4. Test edge cases (empty data, single data points, etc.) 