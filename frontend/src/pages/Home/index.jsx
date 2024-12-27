import React, { useState, useEffect } from 'react';
import { api } from '../../services/api'
import VisaCard from './components/VisaCard'

const Home = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data)
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
    <h1 className="text-5xl font-bold text-center mb-4 dark:text-white">
      Check processing times for Australian visas 📘
    </h1>
    <p className="text-center mb-12 dark:text-gray-400 max-w-3xl mx-auto text-lg">
    This is an unofficial website that provides both the latest and historical Australian visa processing times in an accessible format. While the official website also includes historical data, it is less user-friendly and harder to navigate.
    </p>
    
    <h2 className="text-3xl font-semibold mb-8 dark:text-gray-200">Visa Categories</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {categories.map(category => (
        <VisaCard
          key={category.id}
          title={`${categoryEmojis[category.id] || ''} ${formatTitle(category.name)}`}
          description={categoryDescriptions[category.id]}
        />
      ))}
    </div>
  </div>
);
}

export default Home;