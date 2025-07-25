require('dotenv').config();
const { Pool } = require('pg');

// Configuração para Supabase usando connection string
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    // Connection settings optimized for serverless/cloud environments
    max: 200, // Maximum number of connections
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 20000,
    statement_timeout: 30000,
    query_timeout: 30000
});

module.exports = pool;