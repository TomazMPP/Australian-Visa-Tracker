import React from 'react';
import { Info } from 'lucide-react';

const ServerNotice = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-6">
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0">
          <Info className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            <span className="font-medium">Note:</span> If you're the first visitor in the last 30 minutes, initial data loading might take up to 30 seconds as our server wakes up.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServerNotice; 