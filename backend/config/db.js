const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false 
});

pool.connect((err, client, release) => {
    if (err) return console.error('Error conectando a la base de datos:', err.stack);
    console.log('Conectado a la base de datos PostgreSQL');
    release();
});

module.exports = pool;