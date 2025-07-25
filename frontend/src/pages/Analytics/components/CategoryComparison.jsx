import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded shadow-lg">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
          {label}
        </p>
        <div className="space-y-1">
          <p className="text-sm">
            <span className="text-blue-600 dark:text-blue-400 font-medium">90% Processing: </span>
            <span className="text-gray-900 dark:text-gray-100">{data.median_90} days</span>
          </p>
          <p className="text-sm">
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">50% Processing: </span>
            <span className="text-gray-900 dark:text-gray-100">{data.median_50} days</span>
          </p>
          <div className="flex items-center mt-2">
            {data.change < 0 ? (
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span className={`text-xs font-medium ${
              data.change < 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {Math.abs(data.change).toFixed(1)}% {data.change < 0 ? 'improvement' : 'increase'}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Function to shorten category names for display
const shortenCategoryName = (name) => {
  const shortened = {
    'Visitor visas': 'Visitor',
    'Student visas': 'Student', 
    'Family visas': 'Family',
    'Work visas': 'Work',
    'Other visas': 'Other',
    'Working and skilled visas': 'Work & Skilled',
    'Family and partner visas': 'Family & Partner', 
    'Studying and training visas': 'Study & Training'
  };
  return shortened[name] || name.replace(' visas', '').replace(' and ', ' & ');
};

const CategoryComparison = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="dark:bg-[#0d1117] dark:border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-gray-500 dark:text-gray-400">No comparison data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort data by median_90 for better visualization
  const sortedData = [...data].sort((a, b) => a.median_90 - b.median_90).map(item => ({
    ...item,
    shortName: shortenCategoryName(item.category)
  }));

  return (
    <Card className="dark:bg-[#0d1117] dark:border-gray-800">
      <CardContent className="p-6">
        <div className="w-full h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                className="dark:stroke-gray-800"
                horizontal={true}
                vertical={false}
              />
              <XAxis
                dataKey="shortName"
                className="dark:text-gray-400"
                angle={0}
                textAnchor="middle"
                height={60}
                interval={0}
                tick={{ fontSize: 11 }}
              />
              <YAxis
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
                height={30}
                wrapperStyle={{ fontSize: '12px', paddingBottom: '10px' }}
              />
              
              <Bar 
                dataKey="median_90" 
                name="90% Processing"
                fill="#3b82f6"
                radius={[2, 2, 0, 0]}
              />
              
              <Bar 
                dataKey="median_50" 
                name="50% Processing"
                fill="#10b981"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 space-y-3">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            * Categories sorted by 90% processing time (fastest to slowest)
          </div>
          
          {/* Performance indicators with better layout */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {sortedData.map((category) => (
              <div key={category.category} className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center mb-1">
                  {category.shortName}
                </div>
                <div className="flex items-center justify-center">
                  {category.change < 0 ? (
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span className="text-xs font-medium">{Math.abs(category.change).toFixed(1)}%</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600 dark:text-red-400">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      <span className="text-xs font-medium">{category.change.toFixed(1)}%</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Legend for colors */}
          <div className="flex items-center justify-center space-x-6 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
              <span className="text-gray-600 dark:text-gray-400">90% Processing Time</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-emerald-500 rounded mr-2"></div>
              <span className="text-gray-600 dark:text-gray-400">50% Processing Time</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryComparison; 