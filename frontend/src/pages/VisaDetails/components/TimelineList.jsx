import React from 'react';
import TimelineItem from './TimelineItem';

const TimelineList = ({ data, visaName }) => {
  const sortedData = [...data]
    .sort((a, b) => new Date(b.collected_at) - new Date(a.collected_at))
    .slice(0, 5); 

  return (
    <div className="mt-8 bg-white dark:bg-[#0d1117] rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-200">Recent Updates</h3>
      <div className="relative">
        {sortedData.map((item, index) => (
          <TimelineItem
            key={index}
            date={item.collected_at}
            visaName={visaName}
            percent50={item.percent_50}
            percent90={item.percent_90}
            isLast={index === sortedData.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default TimelineList;