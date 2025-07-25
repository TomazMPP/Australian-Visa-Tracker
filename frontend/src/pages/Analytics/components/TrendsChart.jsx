import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent } from "@/components/ui/card";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded shadow-lg">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          {new Date(label).toLocaleDateString('en-AU', { 
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm">
            <span style={{ color: entry.color }} className="font-medium">
              {entry.name}: 
            </span>
            <span className="ml-1 text-gray-900 dark:text-gray-100">
              {entry.value} days
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const TrendsChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="dark:bg-[#0d1117] dark:border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-gray-500 dark:text-gray-400">No trend data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get all unique categories from the data dynamically
  const allCategories = new Set();
  data.forEach(item => {
    Object.keys(item).forEach(key => {
      if (key !== 'date') {
        allCategories.add(key);
      }
    });
  });

  // Convert to array and filter out empty categories
  const categories = Array.from(allCategories).filter(category => {
    return data.some(item => item[category] != null && item[category] > 0);
  });

  // Dynamic color palette
  const colorPalette = [
    '#3b82f6', // blue
    '#22c55e', // green  
    '#ef4444', // red
    '#f59e0b', // amber
    '#8b5cf6', // violet
    '#06b6d4', // cyan
    '#f97316', // orange
    '#84cc16', // lime
    '#ec4899', // pink
    '#6366f1'  // indigo
  ];

  // Assign colors to categories
  const categoryColors = {};
  categories.forEach((category, index) => {
    categoryColors[category] = colorPalette[index % colorPalette.length];
  });

  // Format data for the chart - keep original dates for better X-axis
  const formattedData = data.map(item => ({
    ...item,
    dateTimestamp: new Date(item.date).getTime(),
    displayDate: item.date // Keep original date string for better display
  })).sort((a, b) => a.dateTimestamp - b.dateTimestamp); // Sort by date

  // Calculate Y-axis domain for better scaling
  const allValues = formattedData.flatMap(item => 
    categories.map(cat => item[cat]).filter(val => val != null && val > 0)
  );
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const padding = (maxValue - minValue) * 0.1; // 10% padding
  const yAxisDomain = [
    Math.max(0, Math.floor(minValue - padding)),
    Math.ceil(maxValue + padding)
  ];

  // Calculate date range for better X-axis
  const dateRange = formattedData.length > 1 ? 
    formattedData[formattedData.length - 1].dateTimestamp - formattedData[0].dateTimestamp : 
    0;
  const daysBetween = dateRange / (1000 * 60 * 60 * 24);

  return (
    <Card className="dark:bg-[#0d1117] dark:border-gray-800">
      <CardContent className="p-6">
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={formattedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                className="dark:stroke-gray-800"
                vertical={false}
              />
              <XAxis
                dataKey="dateTimestamp"
                type="number"
                domain={['dataMin', 'dataMax']}
                scale="time"
                tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString('en-AU', { 
                  month: 'short',
                  day: 'numeric'
                })}
                className="dark:text-gray-400"
                tick={{ fontSize: 12 }}
                tickCount={Math.min(8, formattedData.length)}
              />
              <YAxis
                domain={yAxisDomain}
                className="dark:text-gray-400"
                label={{ 
                  value: 'Processing Time (days)', 
                  angle: -90, 
                  position: 'insideLeft',
                  className: 'dark:fill-gray-400'
                }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={40}
                wrapperStyle={{ paddingBottom: '20px', fontSize: '12px' }}
              />
              
              {categories.map((category) => (
                <Line
                  key={category}
                  type="monotone"
                  dataKey={category}
                  stroke={categoryColors[category]}
                  strokeWidth={3}
                  name={category}
                  dot={{ 
                    stroke: categoryColors[category], 
                    strokeWidth: 2, 
                    r: 4,
                    fill: '#fff'
                  }}
                  activeDot={{ 
                    r: 6, 
                    stroke: categoryColors[category], 
                    strokeWidth: 3,
                    fill: categoryColors[category]
                  }}
                  connectNulls={true}
                  strokeDasharray={daysBetween > 60 ? "5 5" : "0"}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 space-y-1">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            * Median 90% processing times over time for each visa category
          </div>
          {categories.length > 0 && (
            <div className="text-xs text-gray-600 dark:text-gray-500">
              Showing {categories.length} categories over {formattedData.length} data points
              {daysBetween > 60 && (
                <span className="ml-2 text-amber-600 dark:text-amber-400">
                  • Dashed lines indicate sparse data (gaps &gt; 60 days)
                </span>
              )}
            </div>
          )}
          {daysBetween > 30 && (
            <div className="text-xs text-blue-600 dark:text-blue-400">
              💡 Trends will become clearer as more daily data is collected
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendsChart; 