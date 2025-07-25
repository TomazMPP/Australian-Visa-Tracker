import { api } from '../services/api';

const SITE_URL = 'https://www.australianvisatracker.com';

export const generateSitemap = async () => {
  try {
    // Fetch all categories and visas from API
    const [categoriesResponse, visasResponse] = await Promise.all([
      api.get('/categories'),
      api.get('/visas')
    ]);

    const categories = categoriesResponse.data;
    const visas = visasResponse.data;

    const urls = [
      {
        loc: SITE_URL,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '1.0'
      },
      {
        loc: `${SITE_URL}/donate`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: '0.5'
      }
    ];

    // Add category pages
    categories.forEach(category => {
      urls.push({
        loc: `${SITE_URL}/categories/${category.id}`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.8'
      });
    });

    // Add visa detail pages
    visas.forEach(visa => {
      urls.push({
        loc: `${SITE_URL}/visa/${visa.code}`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.7'
      });

      // Add stream pages if visa has streams
      if (visa.streams && visa.streams.length > 0) {
        visa.streams.forEach(stream => {
          urls.push({
            loc: `${SITE_URL}/visa/${visa.code}/stream/${stream.id}`,
            lastmod: new Date().toISOString(),
            changefreq: 'weekly',
            priority: '0.6'
          });
        });
      }
    });

    return generateSitemapXML(urls);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return generateBasicSitemap();
  }
};

const generateSitemapXML = (urls) => {
  const urlElements = urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
};

const generateBasicSitemap = () => {
  const basicUrls = [
    {
      loc: SITE_URL,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '1.0'
    },
    {
      loc: `${SITE_URL}/donate`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: '0.5'
    }
  ];

  return generateSitemapXML(basicUrls);
};

export const downloadSitemap = async () => {
  const sitemapContent = await generateSitemap();
  const blob = new Blob([sitemapContent], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sitemap.xml';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}; 