import React, { useState, useEffect } from 'react';
import { api } from '../../services/api'
import VisaCard from './components/VisaCard'
import useSEO from '../../hooks/useSEO';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import ServerNotice from '../../components/ui/ServerNotice';

const Home = () => {
  const [categories, setCategories] = useState([]);

  // SEO Configuration for Home Page
  useSEO({
    title: 'Australian Visa Tracker - Check Visa Processing Times & Status',
    description: 'Track Australian visa processing times effortlessly with the Australian Visa Tracker. Get up-to-date information on all visa categories including tourist, student, family, and work visas.',
    keywords: 'Australian visa tracker, visa status Australia, visa processing times, Australia visa application, check visa status, Australian immigration, visa updates, tourist visa, student visa, work visa, family visa',
    image: 'https://www.australianvisatracker.com/images/og-image.jpg',
    url: 'https://www.australianvisatracker.com/',
    canonical: 'https://www.australianvisatracker.com/',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Australian Visa Tracker",
      "url": "https://www.australianvisatracker.com/",
      "description": "Track your Australian visa status and processing times effortlessly with the Australian Visa Tracker.",
      "applicationCategory": "GovernmentApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "AUD"
      },
      "featureList": [
        "Real-time visa processing times",
        "Historical processing data",
        "Multiple visa categories",
        "User-friendly interface"
      ],
      "audience": {
        "@type": "Audience",
        "audienceType": "People applying for Australian visas"
      }
    }
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    }

    fetchCategories()
  }, [])
  
  const categoryDescriptions = {
    1: "For people visiting Australia for tourism or leisure",
    2: "For people who want to study at an Australian university or college",
    3: "For family members and partners of Australian citizens or permanent residents",
    4: "For people who want to work in Australia",
    6: "Various other visa types",
  }

  const categoryEmojis = {
    1: "🧳",
    2: "🎓",
    3: "👨‍👩‍👧‍👦",
    4: "💼",
    6: "😀",
  }

  const formatTitle = (text) => {
    return text
      .replace(/\band\b/gi, "&") 
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) 
      .join(" ");
  }
      
  return (
    <div className="container mx-auto px-4 py-8 mt-16 max-w-6xl">
      <Breadcrumbs />
      
      <header>
        <h1 className="text-5xl font-bold text-center mb-4 dark:text-white">
          Check processing times for Australian visas 📘
        </h1>
        <p className="text-center mb-8 dark:text-gray-400 max-w-3xl mx-auto text-lg">
          This is an unofficial website that provides both the latest and historical Australian visa processing times in an accessible format. While the official website also includes historical data, it is less user-friendly and harder to navigate.
        </p>
      </header>

      <ServerNotice />

      <section>
        <h2 className="text-3xl font-semibold mb-8 dark:text-gray-200">Visa Categories</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map(category => (
            <VisaCard
              key={category.id}
              id={category.id}
              title={`${categoryEmojis[category.id] || ''} ${formatTitle(category.name)}`}
              description={categoryDescriptions[category.id]}
            />
          ))}

          <VisaCard
            key="analytics"
            id="analytics"
            title="📊 Analytics"
            description="View analytics for Australian visa processing times"
            isAnalyticsCard={true}
          />
          {/* <VisaCard
            key="donate"
            id="donate"
            title="💝 Support This Project"
            description="Read more about the project & support"
            isDonationCard={true}
          /> */}
        </div>
      </section>
    </div>
  );
}

export default Home;
