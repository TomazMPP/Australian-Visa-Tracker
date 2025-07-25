import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = ({ customCrumbs = [] }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  // Generate breadcrumb data for structured data
  const generateBreadcrumbStructuredData = (crumbs) => {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": crumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.label,
        "item": `https://www.australianvisatracker.com${crumb.path}`
      }))
    };
  };

  // Default breadcrumb mapping
  const getBreadcrumbLabel = (path, index, pathnames) => {
    switch (path) {
      case 'categories':
        return 'Categories';
      case 'visa':
        return 'Visa Details';
      case 'stream':
        return 'Stream';
      case 'donate':
        return 'Support Project';
      default:
        // For dynamic segments like visa codes, stream IDs
        if (pathnames[index - 1] === 'categories') {
          return `Category ${path}`;
        }
        if (pathnames[index - 1] === 'visa') {
          return `Visa ${path}`;
        }
        if (pathnames[index - 1] === 'stream') {
          return `Stream ${path}`;
        }
        return path.charAt(0).toUpperCase() + path.slice(1);
    }
  };

  // Use custom crumbs if provided, otherwise generate from URL
  const breadcrumbs = customCrumbs.length > 0 
    ? [{ label: 'Home', path: '/' }, ...customCrumbs]
    : [
        { label: 'Home', path: '/' },
        ...pathnames.map((path, index) => ({
          label: getBreadcrumbLabel(path, index, pathnames),
          path: `/${pathnames.slice(0, index + 1).join('/')}`
        }))
      ];

  // Don't show breadcrumbs on home page
  if (location.pathname === '/') {
    return null;
  }

  // Add structured data to page
  React.useEffect(() => {
    const structuredData = generateBreadcrumbStructuredData(breadcrumbs);
    
    // Remove existing breadcrumb structured data
    const existingScript = document.querySelector('script[data-breadcrumb="structured-data"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new breadcrumb structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-breadcrumb', 'structured-data');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.querySelector('script[data-breadcrumb="structured-data"]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [breadcrumbs]);

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li key={crumb.path} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
              )}
              
              {isLast ? (
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {index === 0 ? <Home className="w-4 h-4" /> : crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center"
                >
                  {index === 0 ? <Home className="w-4 h-4" /> : crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs; 