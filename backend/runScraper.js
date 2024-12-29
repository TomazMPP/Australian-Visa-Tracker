const { runScraper } = require('./processTimeScraper');

if (require.main === module) {
  runScraper()
      .then(() => {
          console.log('Scraper completed successfully');
          process.exit(0);
      })
      .catch(error => {
          console.error('Scraper failed:', error);
          process.exit(1);
      });
}