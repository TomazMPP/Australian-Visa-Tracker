import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import { api } from '../../services/api';
import StatisticCard from './components/statisticsCard';
import VisaList from './components/VisaList';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/breadcrumb"

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

const CategoryDetails = () => {
  const { id } = useParams();
  const [visas, setVisas] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [processingTimesResponse, statsResponse] = await Promise.all([
          api.get(`/processing-times/category/${id}`),
          api.get(`/statistics/category/${id}`),
        ]);

        const mappedVisas = processingTimesResponse.data.map((visa) => ({
          id: visa.visa_type_id,
          stream_id: visa.stream_id || null,
          stream_name: visa.stream_name || null,
          collected_at: visa.collected_at,
          visa_name: visa.visa_name,
          stream_name: visa.stream_name,
          percent_90: visa.percent_90,
          code: visa.code, 
          display_name: visa.stream_name 
          ? `${visa.visa_name} (${visa.stream_name})`
          : visa.visa_name
        }));

        setVisas(mappedVisas);
        setStats(statsResponse.data);
       
      } catch (error) {
        console.error('Error fetching:', error);
      }
    };

    fetchData();
  }, [id]);


  const latestProcessingTime = getLatestProcessingTime(visas);
  const currentCategory = categoryNames[id] || "Category Not Found";
  console.log(categoryNames[id])
  const formatTitle = (text) => {
    return text
      .replace(/\band\b/gi, "&") 
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) 
      .join(" ");
  }

  const formattedTitle = formatTitle(currentCategory)

  return (
    <div className="container mx-0 px-4 mt-16 py-0">

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/" 
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>{currentCategory}</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>

        <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold dark:text-gray-200">
        {formattedTitle} Details 
        </h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Updated on {latestProcessingTime ? new Date(latestProcessingTime.collected_at).toLocaleDateString('en-AU', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
        </span>
        </div>

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
      <VisaList visas={visas} />
    </div>
   
  );
};

export default CategoryDetails;