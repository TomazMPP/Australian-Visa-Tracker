// Performance optimization utilities

// Lazy load images
export const lazyLoadImages = () => {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
};

// Preload critical resources
export const preloadCriticalResources = () => {
  const preloadLinks = [
    { href: '/api/categories', as: 'fetch' },
    { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', as: 'style' }
  ];

  preloadLinks.forEach(link => {
    const linkElement = document.createElement('link');
    linkElement.rel = 'preload';
    linkElement.href = link.href;
    linkElement.as = link.as;
    if (link.as === 'fetch') {
      linkElement.crossOrigin = 'anonymous';
    }
    document.head.appendChild(linkElement);
  });
};

// Web Vitals monitoring
export const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

// Optimize scroll performance
export const optimizeScrollPerformance = () => {
  let ticking = false;

  const updateScrollPosition = () => {
    // Add scroll-based optimizations here
    ticking = false;
  };

  const requestScrollUpdate = () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollPosition);
      ticking = true;
    }
  };

  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
};

// Resource hints for better loading
export const addResourceHints = () => {
  const hints = [
    { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: '//www.googletagmanager.com' },
    { rel: 'preconnect', href: 'https://api.australianvisatracker.com' }
  ];

  hints.forEach(hint => {
    const link = document.createElement('link');
    link.rel = hint.rel;
    link.href = hint.href;
    document.head.appendChild(link);
  });
};

// Initialize all performance optimizations
export const initPerformanceOptimizations = () => {
  // Run immediately
  addResourceHints();
  preloadCriticalResources();

  // Run after DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    lazyLoadImages();
    optimizeScrollPerformance();
  });

  // Report web vitals in production
  if (process.env.NODE_ENV === 'production') {
    reportWebVitals(console.log);
  }
}; 