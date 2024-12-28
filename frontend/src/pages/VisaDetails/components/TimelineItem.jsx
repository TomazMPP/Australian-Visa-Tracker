import React from 'react';

const TimelineItem = ({ date, visaName, percent50, percent90 }) => {
  const formattedDate = new Date(date).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="flex mb-8 relative">
      <div className="absolute left-2 w-px h-full bg-blue-100 dark:bg-gray-700" />
      <div className="absolute left-2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-blue-500 bg-white dark:bg-gray-800 mt-1.5" />
      <div className="ml-8">
        <div className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</div>
        <div className="text-base font-medium text-gray-900 dark:text-gray-100 mt-1">
          {visaName}
        </div>
        <div className="mt-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex gap-4">
            <div className=" flex flex-col items-center">
              <span className="text-gray-500 dark:text-gray-400 mb-1">50% Processing: </span>
              <span className="text-gray-900 dark:text-gray-200 font-semibold text-lg">{percent50} days</span>
            </div>
            <div className=" flex flex-col items-center">
              <span className="text-gray-500 dark:text-gray-400 mb-1">90% Processing: </span>
              <span className="text-gray-900 dark:text-gray-200 font-semibold text-lg">{percent90} days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineItem