import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import { api } from '../../services/api';
import StatisticCard from './components/statisticsCard';

const CategoryDetails = () => {
  const { id } = useParams();
  const [visas, setVisas] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [visasResponse, statsResponse] = await Promise.all([
          api.get(`/categories/${id}/visas`),
          api.get(`/statistics/category/${id}`)
        ]);

        setVisas(visasResponse.data);
        setStats(statsResponse.data);
      } catch (error) {
        console.error('Error fetching visas:', error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h2 className="text-3xl font-semibold mb-8 dark:text-gray-200">Interesting Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </div>
  );
};

export default CategoryDetails;