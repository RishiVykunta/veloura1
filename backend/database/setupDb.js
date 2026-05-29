const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.NEON_DATABASE_URL;
if (!connectionString) {
  console.error('Error: NEON_DATABASE_URL is not set in env variables.');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function run() {
  try {
    console.log('Connecting to Neon PostgreSQL and initializing schema...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    // Execute the SQL schema script
    await pool.query(sql);
    console.log('Schema tables created and configured successfully!');
  } catch (error) {
    console.error('Failed to initialize schema database:', error);
  } finally {
    await pool.end();
  }
}

run();
