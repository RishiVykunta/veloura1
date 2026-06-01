const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.NEON_DATABASE_URL;
if (!connectionString) {
  console.error('Error: NEON_DATABASE_URL environment variable is missing.');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function seedAdmin() {
  const client = await pool.connect();
  try {
    const email = process.env.ADMIN_EMAIL || 'thevelouraofficial@gmail.com';
    const password = process.env.ADMIN_PASSWORD || 'Veloura@0109';

    // Check if admin already exists
    const { rows: existing } = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existing.length > 0) {
      // Update role to admin if user exists
      await client.query(
        'UPDATE users SET role = $1 WHERE email = $2',
        ['admin', email]
      );
      console.log(`✅ Existing user "${email}" updated to admin role.`);
    } else {
      // Hash password and create admin user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await client.query(
        `INSERT INTO users (first_name, last_name, email, password_hash, role)
         VALUES ($1, $2, $3, $4, $5)`,
        ['Veloura', 'Admin', email, hashedPassword, 'admin']
      );
      console.log(`✅ Admin user "${email}" created successfully.`);
    }
  } catch (error) {
    console.error('❌ Failed to seed admin:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

seedAdmin();
