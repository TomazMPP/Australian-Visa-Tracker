const pool = require('./config/db');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const visaTypesRouter = require('./routes/visaTypes');
const processingTimesRouter = require('./routes/processingTimes')
const app = express();

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
});

// Testing db.js
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
        message: 'Connected to DB!',
        timestamp: result.rows[0].now
    });
} catch (err) {
    console.error('Error:', err.message); 
    res.status(500).json({ 
        error: 'Error connecting to db' 
    });
  }
})

// Visa Types Route
app.use('/api', visaTypesRouter);

// Processing Times Route
app.use('/api', processingTimesRouter)