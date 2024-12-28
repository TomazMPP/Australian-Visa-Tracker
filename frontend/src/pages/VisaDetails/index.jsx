import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import { api } from '../../services/api';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/breadcrumb"
import HistoryChart from './components/HistoryChart';
import TimelineList from './components/TimelineList';


const VisaDetails = () => {
  const params = useParams();
  const visaId = params.visaId;
  const streamId = params?.streamId || null;
  const [visaTimes, setVisaTimes] = useState([]);
  const [visaExtraDetails, setVisaDetails] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [processingTimesResponse, visaDetailsResponse] = await Promise.all([
          api.get(`/processing-times/visa/${visaId}/history${streamId ? `?stream_id=${streamId}` : ''}`),
          api.get(`/processing-times/visa/${visaId}${streamId ? `?stream_id=${streamId}` : ''}`)
        ]);

        setVisaTimes(processingTimesResponse.data);
        setVisaDetails(visaDetailsResponse.data);
      } catch (error) {
        console.error('Error fetching:', error);
      }
    };

    fetchData();
  }, [visaId, streamId]);

  const getLatestProcessingTime = (processingTimes) => {
    if (!processingTimes || processingTimes.length === 0) return null;

    const sortedTimes = [...processingTimes].sort((a, b) => 
      new Date(b.collected_at) - new Date(a.collected_at)
    );

    return sortedTimes[0];
  };

  const latestProcessingTime = getLatestProcessingTime(visaTimes);


  const formatTitle = (text) => {
    return text
      .replace(/\band\b/gi, "&") 
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) 
      .join(" ");
  }

   const formattedTitleCategory = visaExtraDetails.category_name ? formatTitle(visaExtraDetails.category_name) : "Category Not Found";
   const currentCategory = formattedTitleCategory;
  const formattedVisaName = visaExtraDetails.visa_name ? formatTitle(visaExtraDetails.visa_name) : "Visa Not Found";
  
  return (
    <div className="container mx-auto px-8 mt-16 max-w-[1400px]">

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" 
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
          <Link to={`/categories/${visaExtraDetails.category_id}`} className="text-slate-500 hover:text-slate-800">{currentCategory}</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
          <BreadcrumbPage>{formattedVisaName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-semibold dark:text-gray-200">
              {formattedTitleCategory} Details
              </h1>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Updated on {latestProcessingTime ? new Date(latestProcessingTime.collected_at).toLocaleDateString('en-AU', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
              </span>
      </div>
       
      <h2 className="text-xl font-semibold mb-3 dark:text-gray-200 text-left">Historical Data for {formattedVisaName}</h2>
      
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <HistoryChart data={visaTimes} />
        <div className="mb-12 mt-8 text-left">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4 ">
              Interpreting this data {formattedVisaName}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              The Australian Government publishes updates to their processing times on a daily basis. However, this estimate is just the average of the processing time taken for <strong>{formattedVisaName}</strong>. The graph shows two main metrics:
            </p>
            <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
              <li>• <span className="font-medium">90% Processing Time</span>: 90% of applications are processed within this timeframe. This gives you a more conservative estimate.</li>
              <li>• <span className="font-medium">50% Processing Time</span>: Half of all applications are processed within this timeframe. This represents the typical processing time.</li>
            </ul>
            <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
              The dotted lines represent the moving average over time, helping to identify trends in processing times. Keep in mind that these are estimates, and your actual processing time may vary based on various factors.
            </p>
        </div>
      </div>
      <div>
        <TimelineList 
          data={visaTimes} 
          visaName={formattedVisaName}
        />
      </div>
    </div>
    </div>
   
  )
}

export default VisaDetails