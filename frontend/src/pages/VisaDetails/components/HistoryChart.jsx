import React from 'react';
import {
 LineChart,
 Line,
 XAxis,
 YAxis,
 CartesianGrid,
 Tooltip,
 Legend,
 Area,
 ResponsiveContainer
} from 'recharts';

// Utility function to calculate moving average
const calculateMovingAverage = (data, field, windowSize = 7) => {
  return data.map((item, index) => {
    if (index < windowSize - 1) {
      // For early data points, use available data
      const availableData = data.slice(0, index + 1);
      const sum = availableData.reduce((acc, curr) => acc + (curr[field] || 0), 0);
      const validCount = availableData.filter(d => d[field] != null).length;
      return validCount > 0 ? sum / validCount : null;
    } else {
      // For points with enough history, use full window
      const windowData = data.slice(index - windowSize + 1, index + 1);
      const sum = windowData.reduce((acc, curr) => acc + (curr[field] || 0), 0);
      const validCount = windowData.filter(d => d[field] != null).length;
      return validCount > 0 ? sum / validCount : null;
    }
  });
};

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
        {payload.map((entry, index) => {
          if (entry.dataKey.includes('avg')) return null;
          return (
            <p key={index} className="text-sm">
              <span style={{ color: entry.color }} className="font-medium">
                {entry.name}: 
              </span>
              <span className="ml-1 text-gray-900 dark:text-gray-100">
                {entry.value} days
              </span>
              {entry.payload[`avg_${entry.dataKey.split('_')[1]}`] && (
                <span className="text-gray-500 dark:text-gray-400 text-xs ml-2">
                  (avg: {Math.round(entry.payload[`avg_${entry.dataKey.split('_')[1]}`])} days)
                </span>
              )}
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

const HistoryChart = ({ data }) => {
  // Sort data by date to ensure proper chronological order
  const sortedData = [...data].sort((a, b) => new Date(a.collected_at) - new Date(b.collected_at));
  
  // Calculate moving averages
  const avg90Values = calculateMovingAverage(sortedData, 'percent_90');
  const avg50Values = calculateMovingAverage(sortedData, 'percent_50');
  
  // Format data with moving averages
  const formattedData = sortedData.map((item, index) => ({
    ...item,
    collected_at: new Date(item.collected_at).getTime(),
    avg_90: avg90Values[index],
    avg_50: avg50Values[index],
  }));

  return (
    <div className="w-full h-[400px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            className="dark:stroke-gray-800"
            vertical={false}
          />
          <XAxis
            dataKey="collected_at"
            type="number"
            domain={['auto', 'auto']}
            scale="time"
            tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString('en-AU', { 
              month: 'short',
              day: 'numeric'
            })}
            className="dark:text-gray-400"
          />
          <YAxis
            className="dark:text-gray-400"
            ticks={[0, 15, 30, 45, 60, 75, 90]}
            domain={[0, 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} />
          
          <Area
            type="monotone"
            dataKey="percent_90"
            fill="#3b82f6"
            fillOpacity={0.1}
            stroke="none"
          />
          
          <Line
            type="monotone"
            dataKey="percent_90"
            stroke="#3b82f6"
            strokeWidth={2}
            name="90% Processing"
            dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 2 }}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="percent_50"
            stroke="#22c55e"
            strokeWidth={2}
            name="50% Processing"
            dot={{ stroke: '#22c55e', strokeWidth: 2, r: 2 }}
            activeDot={{ r: 4 }}
          />
          
          <Line
            type="monotone"
            dataKey="avg_90"
            stroke="#3b82f6"
            strokeDasharray="5 5"
            strokeWidth={1}
            name="90% Average"
            dot={false}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="avg_50"
            stroke="#22c55e"
            strokeDasharray="5 5"
            strokeWidth={1}
            name="50% Average"
            dot={false}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoryChart;