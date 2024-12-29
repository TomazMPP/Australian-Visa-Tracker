import React from "react";

const VisaDetailCard = ({ visaDetails }) => {

  const formatTitle = (text) => {
    return text
      .replace(/\band\b/gi, "&") 
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) 
      .join(" ");
  }


  const formattedTitleCategory = visaDetails.category_name ? formatTitle(visaDetails.category_name) : "Category Not Found";
  
  return (
    <div className="bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-8">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Visa Subclass</p>
          <p className="font-medium text-gray-900 dark:text-gray-100">{visaDetails.code}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
          <p className="font-medium text-gray-900 dark:text-gray-100">{formattedTitleCategory}</p>
        </div>
        {visaDetails.stream_name && (
          <div className="col-span-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">Stream</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">{visaDetails.stream_name}</p>
          </div>
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <a 
          href={`https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
        >
          View on official immigration website →
        </a>
      </div>
    </div>
  );
 };

 export default VisaDetailCard