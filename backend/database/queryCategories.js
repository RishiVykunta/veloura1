const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.NEON_DATABASE_URL;
const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  const { rows } = await pool.query('SELECT id, name, slug FROM categories');
  console.log('Categories in DB:', rows);
  process.exit(0);
}
main().catch(err => {
  console.error(err);
  process.exit(1);
});
