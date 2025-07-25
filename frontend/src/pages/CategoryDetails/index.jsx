import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import { api } from '../../services/api';
import StatisticCard from './components/StatisticsCard';
import VisaList from './components/VisaList';
import useSEO from '../../hooks/useSEO';
import Breadcrumbs from '../../components/ui/Breadcrumbs';

const getLatestProcessingTime = (processingTimes) => {
  if (!processingTimes || processingTimes.length === 0) return null;

  const sortedTimes = [...processingTimes].sort((a, b) => 
    new Date(b.collected_at) - new Date(a.collected_at)
  );

  return sortedTimes[0];
};

const categoryNames = {
  1: "Visitor visas",
  2: "Studying and training visas",
  3: "Family and partner visas",
  4: "Working and skilled visas",
  6: "Other visas"
};

const categoryDescriptions = {
  1: "Track processing times for Australian visitor visas including tourist visas, business visitor visas, and short-term stay visas.",
  2: "Monitor processing times for Australian student visas, training visas, and education-related visa applications.",
  3: "Check processing times for family reunion visas, partner visas, spouse visas, and other family-related Australian visas.",
  4: "View processing times for Australian work visas, skilled migration visas, employer-sponsored visas, and working holiday visas.",
  6: "Processing times for various other Australian visa types including transit visas and special category visas."
};

const CategoryDetails = () => {
  const { id } = useParams();
  const [visas, setVisas] = useState([]);
  const [stats, setStats] = useState(null);

  const currentCategory = categoryNames[id] || "Category Not Found";
  const categoryDescription = categoryDescriptions[id] || "Australian visa processing times information.";
  
  // SEO Configuration for Category Pages
  useSEO({
    title: `${currentCategory} - Australian Visa Processing Times | Australian Visa Tracker`,
    description: categoryDescription,
    keywords: `${currentCategory.toLowerCase()}, Australian visa processing times, visa status, ${currentCategory.toLowerCase()} processing time, Australia immigration, visa application status`,
    image: 'https://www.australianvisatracker.com/images/og-image.jpg',
    url: `https://www.australianvisatracker.com/categories/${id}`,
    canonical: `https://www.australianvisatracker.com/categories/${id}`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": `${currentCategory} - Processing Times`,
      "description": categoryDescription,
      "url": `https://www.australianvisatracker.com/categories/${id}`,
      "mainEntity": {
        "@type": "GovernmentService",
        "name": `Australian ${currentCategory}`,
        "description": categoryDescription,
        "provider": {
          "@type": "GovernmentOrganization",
          "name": "Department of Home Affairs",
          "url": "https://www.homeaffairs.gov.au/"
        },
        "areaServed": {
          "@type": "Country",
          "name": "Australia"
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
            "name": currentCategory,
            "item": `https://www.australianvisatracker.com/categories/${id}`
          }
        ]
      }
    }
  });

  // Custom breadcrumbs for this page
  const customBreadcrumbs = [
    { label: currentCategory, path: `/categories/${id}` }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [processingTimesResponse, statsResponse] = await Promise.all([
          api.get(`/processing-times/category/${id}`),
          api.get(`/statistics/category/${id}`),
        ]);

        const mappedVisas = processingTimesResponse.data.map((visa) => ({
          id: visa.visa_type_id,
          code: visa.code, 
          stream_id: visa.stream_id || null,
          stream_name: visa.stream_name || null,
          collected_at: visa.collected_at,
          visa_name: visa.visa_name,
          stream_name: visa.stream_name,
          percent_90: visa.percent_90,
          display_name: visa.stream_name 
          ? `${visa.visa_name} (${visa.stream_name})`
          : visa.visa_name
        })).sort((a, b) => {
          // Sort by: 1) visas with processing times first, 2) then by visa name
          const aHasData = a.percent_90 || a.percent_50;
          const bHasData = b.percent_90 || b.percent_50;
          
          if (aHasData && !bHasData) return -1; // a comes first
          if (!aHasData && bHasData) return 1;  // b comes first
          
          // If both have data or both don't have data, sort by visa name
          return a.visa_name.localeCompare(b.visa_name);
        });

        setVisas(mappedVisas);
        setStats(statsResponse.data);
       
      } catch (error) {
        console.error('Error fetching:', error);
      }
    };

    fetchData();
  }, [id]);


  const latestProcessingTime = getLatestProcessingTime(visas);
  const formatTitle = (text) => {
    return text
      .replace(/\band\b/gi, "&") 
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) 
      .join(" ");
  }
  

  const formattedTitle = formatTitle(currentCategory)

  return (
    <div className="!max-w-3xl container mx-0 px-4 mt-16 py-0 ">
      <Breadcrumbs customCrumbs={customBreadcrumbs} />

      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold dark:text-gray-200">
          {formattedTitle} Details  
        </h1>
        
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Updated on {latestProcessingTime ? new Date(latestProcessingTime.collected_at).toLocaleDateString('en-AU', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
        </span>
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-3 dark:text-gray-200">Interesting Statistics for This Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <StatisticCard 
            title="Fastest 90% Processing" 
            value={stats?.fastest_90}
            description="The quickest 90% processing time for applications of this visa category" 
          />
          <StatisticCard 
            title="Slowest 90% Processing" 
            value={stats?.slowest_90}
            description="Longest processing time for 90% of applications" 
          />
          <StatisticCard 
            title="Median 90% Processing" 
            value={stats?.median_90}
            description="Typical processing time for 90% of applications" 
          />
          <StatisticCard 
            title="Fastest 50% Processing" 
            value={stats?.fastest_50}
            description="The quickest 50% processing time for applications of this visa category" 
          />
          <StatisticCard 
            title="Slowest 50% Processing" 
            value={stats?.slowest_50}
            description="The Longest processing time for 50% of applications" 
          />
          <StatisticCard 
            title="Median 50% Processing" 
            value={stats?.median_50}
            description="Typical processing time for 50% of applications" 
          />
        </div>
        {id === '3' && (
          <div className="m-5">
            <p className="text-sm text-gray-700 dark:text-gray-300">
            * For this category of visas, the Australian Government offers several visas with similar names. Please be aware of this and consider the <strong>subclass code</strong>.
            </p>
            </div>
        )}
        <VisaList visas={visas} />
      </section>
    </div>
   
  );
};

export default CategoryDetails;