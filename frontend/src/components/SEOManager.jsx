import React, { useEffect } from 'react';
import { generateSitemap } from '../utils/sitemap';

const SEOManager = () => {
  useEffect(() => {
    // Generate and update sitemap on app load
    const updateSitemap = async () => {
      try {
        const sitemapContent = await generateSitemap();
        
        // Send sitemap to server or store it (in a real app)
        // For now, we'll just log it or make it available for download
        console.log('Sitemap generated successfully');
        
        // Store in sessionStorage for admin access if needed
        if (window.location.search.includes('admin=true')) {
          sessionStorage.setItem('sitemap', sitemapContent);
        }
      } catch (error) {
        console.error('Error generating sitemap:', error);
      }
    };

    updateSitemap();
  }, []);

  // Add JSON-LD schema for the entire site
  useEffect(() => {
    const siteSchema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://www.australianvisatracker.com/#organization",
          "name": "Australian Visa Tracker",
          "url": "https://www.australianvisatracker.com/",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.australianvisatracker.com/images/logo.png"
          },
          "description": "Track Australian visa processing times effortlessly with historical data and trends.",
          "foundingDate": "2024",
          "knowsAbout": [
            "Australian visa processing times",
            "Immigration to Australia",
            "Visa application tracking",
            "Department of Home Affairs data"
          ]
        },
        {
          "@type": "WebSite",
          "@id": "https://www.australianvisatracker.com/#website",
          "url": "https://www.australianvisatracker.com/",
          "name": "Australian Visa Tracker",
          "description": "Track Australian visa processing times effortlessly with the Australian Visa Tracker.",
          "publisher": {
            "@id": "https://www.australianvisatracker.com/#organization"
          },
          "potentialAction": [
            {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://www.australianvisatracker.com/search?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          ],
          "inLanguage": "en-AU"
        }
      ]
    };

    // Remove existing site schema
    const existingSchema = document.querySelector('script[data-schema="site"]');
    if (existingSchema) {
      existingSchema.remove();
    }

    // Add new site schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', 'site');
    script.textContent = JSON.stringify(siteSchema);
    document.head.appendChild(script);

    return () => {
      const schemaToRemove = document.querySelector('script[data-schema="site"]');
      if (schemaToRemove) {
        schemaToRemove.remove();
      }
    };
  }, []);

  return null; // This component doesn't render anything
};

export default SEOManager; 