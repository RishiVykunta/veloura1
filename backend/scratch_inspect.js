const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    const { rows: categories } = await pool.query('SELECT id, name, slug FROM categories');
    console.log('Categories in database:', categories);

    const { rows: products } = await pool.query('SELECT id, name, slug, price, category_id FROM products LIMIT 5');
    console.log('Sample products in database:', products);

    const { rows: variants } = await pool.query('SELECT DISTINCT size, color FROM product_variants');
    console.log('Unique sizes/colors in database:', variants);
  } catch (err) {
    console.error('Error running query:', err);
  } finally {
    await pool.end();
  }
}

run();
