const cron = require('node-cron');
const { runScraper } = require('./processTimeScraper');

// Schedule the scraper to run every 5 days at 2:00 AM
// Cron pattern: '0 2 */5 * *' means:
// - 0: minute 0
// - 2: hour 2 (2 AM)
// - */5: every 5 days
// - *: every month
// - *: every day of week

const scheduleScraperJob = () => {
    // Run every 5 days at 2:00 AM
    cron.schedule('0 2 */5 * *', async () => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] Starting scheduled scraper job...`);
        
        try {
            await runScraper();
            console.log(`[${timestamp}] Scheduled scraper completed successfully`);
        } catch (error) {
            console.error(`[${timestamp}] Scheduled scraper failed:`, error);
        }
    }, {
        timezone: "Australia/Sydney" // Adjust to your timezone
    });

    // Optional: Run immediately on startup (for testing)
    // Uncomment the next line if you want to test immediately
    // runScraper().catch(console.error);

    console.log('Scraper scheduler initialized - will run every 5 days at 2:00 AM');
};

// Alternative schedules (comment out the one above and use one of these):

// Every day at 3 AM (for testing)
// cron.schedule('0 3 * * *', async () => { ... });

// Every Monday at 2 AM
// cron.schedule('0 2 * * 1', async () => { ... });

// Every 7 days at 2 AM
// cron.schedule('0 2 */7 * *', async () => { ... });

module.exports = { scheduleScraperJob }; 