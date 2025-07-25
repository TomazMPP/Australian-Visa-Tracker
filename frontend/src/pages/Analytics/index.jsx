import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import TrendsChart from './components/TrendsChart';
import CategoryComparison from './components/CategoryComparison';
import PerformanceKPIs from './components/PerformanceKPIs';
import ProcessingDistribution from './components/ProcessingDistribution';
import useSEO from '../../hooks/useSEO';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import { api } from '../../services/api';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // SEO Configuration
  useSEO({
    title: 'Analytics Dashboard - Australian Visa Processing Times | Australian Visa Tracker',
    description: 'Comprehensive analytics and trends for Australian visa processing times across all categories. Track performance, compare categories, and view historical data.',
    keywords: 'visa analytics, processing time trends, Australian visa statistics, visa performance dashboard, immigration data analysis',
    canonical: 'https://www.australianvisatracker.com/analytics',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Visa Processing Analytics Dashboard",
      "description": "Analytics dashboard showing trends and statistics for Australian visa processing times",
      "url": "https://www.australianvisatracker.com/analytics"
    }
  });

  // Custom breadcrumbs
  const customBreadcrumbs = [
    { label: 'Analytics Dashboard', path: '/analytics' }
  ];

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all analytics data from backend
        const [kpisResponse, trendsResponse, comparisonResponse, distributionResponse] = await Promise.all([
          api.get('/analytics/kpis'),
          api.get('/analytics/trends'),
          api.get('/analytics/comparison'),
          api.get('/analytics/distribution')
        ]);

        setAnalyticsData({
          kpis: kpisResponse.data,
          categoryTrends: trendsResponse.data,
          categoryComparison: comparisonResponse.data,
          distributionData: distributionResponse.data
        });

      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setError('Failed to load analytics data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 mt-16 py-0 max-w-7xl">
        <Breadcrumbs customCrumbs={customBreadcrumbs} />
        <div className="flex items-center justify-center h-96">
          <div className="text-lg text-gray-600 dark:text-gray-400">Loading analytics...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 mt-16 py-0 max-w-7xl">
        <Breadcrumbs customCrumbs={customBreadcrumbs} />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-lg text-red-600 dark:text-red-400 mb-2">Error</div>
            <div className="text-gray-600 dark:text-gray-400">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="container mx-auto px-4 mt-16 py-0 max-w-7xl">
        <Breadcrumbs customCrumbs={customBreadcrumbs} />
        <div className="flex items-center justify-center h-96">
          <div className="text-lg text-gray-600 dark:text-gray-400">No analytics data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 mt-16 py-0 max-w-7xl">
      <Breadcrumbs customCrumbs={customBreadcrumbs} />
      
      <header className="mb-8">
        <h1 className="text-3xl font-bold dark:text-gray-200 mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive insights into Australian visa processing times and trends
        </p>
      </header>

      {/* KPIs Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">
          Key Performance Indicators
        </h2>
        <PerformanceKPIs data={analyticsData.kpis} />
      </section>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Trends Chart */}
        <section>
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">
            Processing Time Trends
          </h2>
          <TrendsChart data={analyticsData.categoryTrends} />
        </section>

        {/* Category Comparison */}
        <section>
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">
            Category Comparison
          </h2>
          <CategoryComparison data={analyticsData.categoryComparison} />
        </section>
      </div>

      {/* Distribution Chart */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">
          Processing Time Distribution
        </h2>
        <ProcessingDistribution data={analyticsData.distributionData} />
      </section>

      {/* Insights Section */}
      <section className="mb-8">
        <Card className="dark:bg-[#0d1117] dark:border-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-gray-200">Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium dark:text-gray-300">Improvements</h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  {analyticsData.categoryComparison
                    .filter(cat => cat.change < 0)
                    .map(cat => (
                      <li key={cat.category}>
                        • {cat.category} showing {Math.abs(cat.change).toFixed(1)}% improvement
                      </li>
                    ))}
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium dark:text-gray-300">Areas to Watch</h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  {analyticsData.categoryComparison
                    .filter(cat => cat.change > 0)
                    .map(cat => (
                      <li key={cat.category}>
                        • {cat.category} showing {cat.change.toFixed(1)}% increase
                      </li>
                    ))}
                  <li>• Tracking {analyticsData.kpis.totalVisaTypes.current} visa types</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Analytics; 