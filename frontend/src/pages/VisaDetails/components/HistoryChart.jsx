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

const CustomTooltip = ({ active, payload, label }) => {
 if (active && payload && payload.length) {
   return (
     <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded shadow-lg">
       <p className="text-sm text-gray-600 dark:text-gray-300">
         {new Date(label).toLocaleDateString('en-AU', { 
           year: 'numeric',
           month: 'short',
           day: 'numeric'
         })}
       </p>
       {payload.map((entry, index) => (
         <p key={index} style={{ color: entry.color }} className="text-sm">
           <span className="font-medium">{entry.name}: </span>
           {entry.value} days
         </p>
       ))}
     </div>
   );
 }
 return null;
};

const HistoryChart = ({ data }) => {
 const formattedData = data.map(item => ({
   ...item,
   collected_at: new Date(item.collected_at).getTime(),
 }));

 return (
   <div className="w-full h-[350px] mt-4">
     <ResponsiveContainer width="100%" height="100%">
       <LineChart
         data={formattedData}
         margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
       >
         <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-700" />
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
           label={{ 
             value: 'Processing Time (days)', 
             angle: -90, 
             position: 'insideLeft',
             className: "dark:fill-gray-400",
             offset: 10
           }}
           className="dark:text-gray-400"
         />
         <Tooltip content={<CustomTooltip />} />
         <Legend />
         
         <Area
           type="monotone"
           dataKey="percent_90"
           stroke="none"
           fill="#3b82f6"
           fillOpacity={0.1}
           activeDot={false}
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
         />
         <Line
           type="monotone"
           dataKey="avg_50"
           stroke="#22c55e"
           strokeDasharray="5 5"
           strokeWidth={1}
           name="50% Average"
           dot={false}
         />
       </LineChart>
     </ResponsiveContainer>
   </div>
 );
};

export default HistoryChart;