const { Pool } = require('pg');

// URL forzada sin la palabra "-pooler"
const URL_LIMPIA = "postgresql://neondb_owner:npg_b2HfFAq3EwVy@ep-flat-sea-anieo6pn.c-6.us-east-1.aws.neon.tech/neondb";

const pool = new Pool({
    connectionString: URL_LIMPIA,
    ssl: { rejectUnauthorized: false } 
});

pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Error conectando a la base de datos:', err.stack);
        return;
    }
    console.log('✅ Conectado a la base de datos PostgreSQL con éxito');
    release();
});

module.exports = pool;