import React from 'react';
import { useNavigate } from 'react-router-dom';

const VisaList = ({ visas = [] }) => {
  const navigate = useNavigate();
  const capitalizeVisa = (text) => {
    return text.replace(/\bvisa\b/gi, 'Visa');
  };

  const handleClick = (visa) => {
    if (!visa.code || !visa.id) return;
    const path = visa.stream_id 
      ? `/visa/${visa.code}/stream/${visa.stream_id}`
      : `/visa/${visa.code}/stream`; 

    navigate(path, { state: { visaId: visa.id } });
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
            key={`${visa.id}-${visa.stream_id || 'no-stream'}`}
            className="grid grid-cols-[2fr_1fr_1fr] p-2 !gap-0 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className="text-left">
              <span className="font-medium">
                {capitalizeVisa(visa.visa_name)}
                {visa.stream_name && ` (${visa.stream_name})`}
              </span>
              <span className="ml-1 text-xs text-gray-500">(subclass {visa.code})</span>
              {!visa.percent_90 && !visa.percent_50 && (
                <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  ⚠️ Processing times not available
                </div>
              )}
            </div>
            <div className="text-center">
              {visa.percent_90 ? `~ ${visa.percent_90} days` : (
                <span className="text-gray-400 dark:text-gray-500">No data</span>
              )}
            </div>
            <div className="text-center">
              <button
                onClick={() => handleClick(visa)}
                className="w-3/5 hover:text-gray-700 hover:border-gray-700 dark:hover:text-white bg-transparent dark:hover:border-white transition-colors !py-0"
                disabled={!visa.percent_90 && !visa.percent_50}
              >
                {visa.percent_90 || visa.percent_50 ? 'View' : 'N/A'}
              </button>
            </div>
          </div>
        ))}
        
        {visas.length === 0 && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No visa data available for this category.
          </div>
        )}
        
        {visas.some(visa => !visa.percent_90 && !visa.percent_50) && (
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border-t border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Note:</strong> Some visas in this category don't have current processing times available. 
              This might be because they are processed instantly, rarely used, or the government doesn't publish 
              processing times for these visa types.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisaList;