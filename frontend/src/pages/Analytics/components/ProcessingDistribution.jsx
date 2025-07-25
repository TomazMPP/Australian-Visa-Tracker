import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Card, CardContent } from "@/components/ui/card";

const COLORS = ['#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444', '#dc2626'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded shadow-lg">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
          {data.range}
        </p>
        <div className="space-y-1">
          <p className="text-sm">
            <span className="text-gray-600 dark:text-gray-400">Visa Types: </span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {data.count.toLocaleString()}
            </span>
          </p>
          <p className="text-sm">
            <span className="text-gray-600 dark:text-gray-400">Percentage: </span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {data.percentage}%
            </span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const ProcessingDistribution = ({ data }) => {
  return (
    <Card className="dark:bg-[#0d1117] dark:border-gray-800">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <div>
            <h3 className="text-lg font-medium mb-4 dark:text-gray-200">
              Distribution by Time Range
            </h3>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 10, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    className="dark:stroke-gray-800"
                    horizontal={true}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="range"
                    className="dark:text-gray-400"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    className="dark:text-gray-400"
                    label={{ 
                      value: 'Visa Types', 
                      angle: -90, 
                      position: 'insideLeft',
                      className: 'dark:fill-gray-400'
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  <Bar 
                    dataKey="count" 
                    radius={[4, 4, 0, 0]}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div>
            <h3 className="text-lg font-medium mb-4 dark:text-gray-200">
              Percentage Distribution
            </h3>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ percentage }) => `${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="percentage"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {data.slice(0, 2).reduce((sum, item) => sum + item.percentage, 0).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Fast Processing (0-60 days)
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {data.slice(0, 3).reduce((sum, item) => sum + item.percentage, 0).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Standard Processing (0-90 days)
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {data.slice(4).reduce((sum, item) => sum + item.percentage, 0).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Extended Processing (120+ days)
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                {data.reduce((sum, item) => sum + item.count, 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Total visa types tracked
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          * Distribution based on latest 90% processing times across all visa types
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessingDistribution; 