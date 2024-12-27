import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import { api } from '../../services/api';
import StatisticCard from './components/statisticsCard';
import VisaList from './components/VisaList';

const CategoryDetails = () => {
  const { id } = useParams();
  const [visas, setVisas] = useState([]);
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [visasResponse, statsResponse, categoriesResponse] = await Promise.all([
          api.get(`/categories/${id}/visas`),
          api.get(`/statistics/category/${id}`),
          api.get(`/categories`)
        ]);

        setVisas(visasResponse.data);
        setStats(statsResponse.data);
        setCategories(categoriesResponse.data)
        console.log(categories)
      } catch (error) {
        console.error('Error fetching visas:', error);
      }
    };

    fetchData();
  }, [id]);

  const currentCategory = categories.find(category => category.id === Number(id));
  const formatTitle = (text) => {
    return text
      .replace(/\band\b/gi, "&") 
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) 
      .join(" ");
  }

  const formattedTitle = currentCategory?.name ? formatTitle(currentCategory.name) : "Category Not Found";

  return (
    <div className="container mx-0 px-4 mt-16 py-0">
       <div className="flex justify-between items-center mb-0">
       <div className="flex gap-2 items-center mb-6">
       <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
          Home
        </Link>
        <span className="text-gray-500 dark:text-gray-400">/</span>
        <span className="text-sm text-gray-700 dark:text-gray-200">
          {currentCategory?.name}
        </span>
        </div>
        </div>

        <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold dark:text-gray-200">
        {formattedTitle} Details
        </h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Updated on Dec 24, 2024, GMT
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