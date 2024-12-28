import React from 'react';
import { useNavigate } from 'react-router-dom';

const VisaList = ({ visas = [] }) => {
  const navigate = useNavigate();
  const capitalizeVisa = (text) => {
    return text.replace(/\bvisa\b/gi, 'Visa');
  };

  return (
    <div className="mt-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-4 sm:mb-0">
          Processing Times Estimates
        </h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Filter by visa name"
            className="w-full sm:w-64 bg-white dark:bg-[#1c2128] text-gray-900 dark:text-gray-300 px-4 py-2 rounded border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="px-4 py-2 bg-white dark:bg-[#1c2128] text-gray-900 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Clear
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <div className="grid grid-cols-[3fr_1.5fr_1.5fr] p-3 !gap-4 border-b border-gray-200 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
          <div className="text-left">Visa</div>
          <div className="text-center">90% Processing Time</div>
          <div className="text-center">Details</div>
        </div>

        {visas.map((visa) => (
          <div
            key={visa.id}
            className="grid grid-cols-[2fr_1fr_1fr] p-2 !gap-0 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className="text-left">
              <span className="font-medium">
                {capitalizeVisa(visa.visa_name)}
                {visa.stream_name && ` (${visa.stream_name})`}
              </span>
              <span className="ml-1 text-xs text-gray-500">(subclass {visa.code})</span>
            </div>
            <div className="text-center">
              ~ {visa.percent_90 || '-'} days
            </div>
            <div className="text-center">
              <button
                onClick={() => navigate(`/visa/${visa.id}`)}
                className="w-3/5 hover:text-gray-700 hover:border-gray-700 dark:hover:text-white bg-transparent dark:hover:border-white transition-colors !py-0"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisaList;