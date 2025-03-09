const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false  // ❌ Desactiva SSL para probar
});

module.exports = pool;
