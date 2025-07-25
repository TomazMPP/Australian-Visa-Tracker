const pool = require('./config/db');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const visaTypesRouter = require('./routes/visaTypes');
const processingTimesRouter = require('./routes/processingTimes')
const categoriesRouter = require('./routes/categories')
const statisticsRouter = require('./routes/statistics')
const analyticsRouter = require('./routes/analytics')
const app = express();
const { runScraper } = require('./processTimeScraper');
const { scheduleScraperJob } = require('./scheduler');

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend está funcionando!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    
    // Initialize the scheduler
    scheduleScraperJob();
});

// Testing db.js
app.get('/api/test-db', async (req, res) => {
  try {
    console.log('Attempting to connect to database...');
    console.log('Host:', process.env.SUPABASE_DB_HOST);
    console.log('User:', process.env.SUPABASE_DB_USER);
    console.log('Database:', process.env.SUPABASE_DB_NAME);
    console.log('Port:', process.env.SUPABASE_DB_PORT);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    
    // Test basic connection
    const client = await pool.connect();
    console.log('Pool connection successful');
    
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    client.release();
    
    res.json({ 
        message: 'Connected to Supabase DB!',
        timestamp: result.rows[0].current_time,
        version: result.rows[0].pg_version,
        host: process.env.SUPABASE_DB_HOST
    });
} catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({ 
        error: 'Error connecting to db',
        details: err.message,
        code: err.code,
        hostname: err.hostname || 'N/A'
    });
  }
})

// Test environment variables
app.get('/api/test-env', (req, res) => {
    res.json({
        hasHost: !!process.env.SUPABASE_DB_HOST,
        hasUser: !!process.env.SUPABASE_DB_USER,
        hasPassword: !!process.env.SUPABASE_DB_PASSWORD,
        hasPort: !!process.env.SUPABASE_DB_PORT,
        nodeEnv: process.env.NODE_ENV,
        // Don't expose actual values for security
        hostLength: process.env.SUPABASE_DB_HOST?.length || 0
    });
})

// Visa Types Route
app.use('/api', visaTypesRouter)

// Processing Times Route
app.use('/api', processingTimesRouter)

// Categories Route
app.use('/api', categoriesRouter)

// Statistics Route
app.use('/api', statisticsRouter)

// Analytics Route
app.use('/api', analyticsRouter)

// Run Scraper
app.post('/api/run-scraper', async (req, res) => {
    try {
        await runScraper();
        res.json({ message: 'Scraper executed successfully' });
    } catch (error) {
        console.error('Scraper execution failed:', error);
        res.status(500).json({ error: 'Failed to run scraper' });
    }
});