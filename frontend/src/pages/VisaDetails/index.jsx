import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom'; 
import { api } from '../../services/api';
import useSEO from '../../hooks/useSEO';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import HistoryChart from './components/HistoryChart';
import TimelineList from './components/TimelineList';
import VisaDetailCard from './components/VisaDetailCard';

const VisaDetails = () => {
  const params = useParams();
  const visaCode = params.visaCode; 
  const streamId = params?.streamId || null;
  const location = useLocation();
  const visaId = location.state?.visaId; 

  const [visaTimes, setVisaTimes] = useState([]);
  const [visaExtraDetails, setVisaDetails] = useState([]);

  const formatTitle = (text) => {
    return text
      .replace(/\band\b/gi, "&") 
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) 
      .join(" ");
  }

  const formattedTitleCategory = visaExtraDetails.category_name ? formatTitle(visaExtraDetails.category_name) : "Category Not Found";
  const formattedVisaName = visaExtraDetails.visa_name ? formatTitle(visaExtraDetails.visa_name) : "Visa Not Found";
  
  // SEO Configuration for Visa Details Pages
  useSEO({
    title: `${formattedVisaName} (${visaCode}) Processing Times | Australian Visa Tracker`,
    description: `Track ${formattedVisaName} (${visaCode}) processing times with historical data and trends. Get up-to-date information on Australian visa processing times for better application planning.`,
    keywords: `${formattedVisaName}, ${visaCode}, Australian visa processing times, visa ${visaCode} processing time, ${formattedVisaName} Australia, visa status tracking, Australian immigration`,
    image: 'https://www.australianvisatracker.com/images/og-image.jpg',
    url: `https://www.australianvisatracker.com/visa/${visaCode}${streamId ? `/stream/${streamId}` : ''}`,
    canonical: `https://www.australianvisatracker.com/visa/${visaCode}${streamId ? `/stream/${streamId}` : ''}`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": `${formattedVisaName} (${visaCode}) Processing Times`,
      "description": `Historical processing times and current estimates for ${formattedVisaName} (${visaCode})`,
      "url": `https://www.australianvisatracker.com/visa/${visaCode}${streamId ? `/stream/${streamId}` : ''}`,
      "mainEntity": {
        "@type": "GovernmentService",
        "name": `${formattedVisaName} (${visaCode})`,
        "description": `Australian visa processing service for ${formattedVisaName}`,
        "provider": {
          "@type": "GovernmentOrganization",
          "name": "Department of Home Affairs",
          "url": "https://www.homeaffairs.gov.au/"
        },
        "areaServed": {
          "@type": "Country",
          "name": "Australia"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Visa Processing Times",
          "itemListElement": [
            {
              "@type": "Offer",
              "name": "50% Processing Time",
              "description": "Time within which 50% of applications are processed"
            },
            {
              "@type": "Offer", 
              "name": "90% Processing Time",
              "description": "Time within which 90% of applications are processed"
            }
          ]
        }
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.australianvisatracker.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": formattedTitleCategory,
            "item": `https://www.australianvisatracker.com/categories/${visaExtraDetails.category_id}`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": formattedVisaName,
            "item": `https://www.australianvisatracker.com/visa/${visaCode}${streamId ? `/stream/${streamId}` : ''}`
          }
        ]
      }
    }
  });

  // Custom breadcrumbs for this page
  const customBreadcrumbs = [
    { label: formattedTitleCategory, path: `/categories/${visaExtraDetails.category_id}` },
    { label: formattedVisaName, path: `/visa/${visaCode}${streamId ? `/stream/${streamId}` : ''}` }
  ];

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
    if (visaId) {
      fetchData();
    } else {
      console.error('Visa ID is missing in location state.');
    }
  }, [visaId, streamId]);

  const getLatestProcessingTime = (processingTimes) => {
    if (!processingTimes || processingTimes.length === 0) return null;

    const sortedTimes = [...processingTimes].sort((a, b) => 
      new Date(b.collected_at) - new Date(a.collected_at)
    );

    return sortedTimes[0];
  };

  const latestProcessingTime = getLatestProcessingTime(visaTimes);
  
  return (
    <div className="container mx-auto px-8 mt-16 max-w-[1400px]">
      <Breadcrumbs customCrumbs={customBreadcrumbs} />

      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold dark:text-gray-200">
          {formattedTitleCategory} Category Details
        </h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Updated on {latestProcessingTime ? new Date(latestProcessingTime.collected_at).toLocaleDateString('en-AU', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
        </span>
      </header>
       
      <section>
        <h2 className="text-xl font-semibold mb-3 dark:text-gray-200 text-left">Historical Data for {formattedVisaName} {visaExtraDetails?.stream_name && ` (${visaExtraDetails.stream_name})`}</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <HistoryChart data={visaTimes} />
            <div className="mb-12 mt-8 text-left">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4 ">
                Interpreting this data
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
            <VisaDetailCard visaDetails={visaExtraDetails} />
            <TimelineList 
              data={visaTimes} 
              visaName={formattedVisaName}
            />
          </div>
        </div>
      </section>
    </div>
   
  )
}

export default VisaDetails