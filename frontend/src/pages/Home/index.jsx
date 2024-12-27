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

  return (
    <div>
      <h1>Check processing times for Australian visas</h1>
      <p>This is an unofficial website that shows the latest and historical processing times for Australian visas. The official website is a harder to use and shows only the latest processing times.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map(category => (
          <VisaCard
          key={category.id}
          title={category.name}
          description="test" />
        ))}
      </div>
    </div>
  )
}

export default Home;