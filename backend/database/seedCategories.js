const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.NEON_DATABASE_URL;
const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

const targetCategories = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    name: 'Sharara',
    slug: 'sharara',
    description: 'Elegant and flowing traditional Sharara sets.',
    imageUrl: 'https://res.cloudinary.com/dqcxekzxn/image/upload/v1779815830/WhatsApp_Image_2026-05-26_at_10.36.46_PM_re74eo.jpg',
    isActive: true
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    name: 'Tops',
    slug: 'tops',
    description: 'Premium basics, tailored shirts, and statement tops.',
    imageUrl: 'https://res.cloudinary.com/dqcxekzxn/image/upload/v1779815830/WhatsApp_Image_2026-05-26_at_10.36.46_PM_re74eo.jpg',
    isActive: true
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    name: 'Short Kurthi',
    slug: 'short-kurthi',
    description: 'Chic and versatile short kurthis for daily and festive wear.',
    imageUrl: 'https://res.cloudinary.com/dqcxekzxn/image/upload/v1779815830/WhatsApp_Image_2026-05-26_at_10.36.46_PM_re74eo.jpg',
    isActive: true
  },
  {
    id: 'c4444444-4444-4444-4444-444444444444',
    name: 'Anarkali',
    slug: 'anarkali',
    description: 'Royal and timeless Anarkali gowns and suits.',
    imageUrl: 'https://res.cloudinary.com/dqcxekzxn/image/upload/v1779815830/WhatsApp_Image_2026-05-26_at_10.36.46_PM_re74eo.jpg',
    isActive: true
  }
];

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Clear old categories (setting null to products referencing them, or cascading)
    console.log('Clearing old categories...');
    await client.query('UPDATE products SET category_id = NULL');
    await client.query('DELETE FROM categories');

    console.log('Seeding new categories...');
    for (const cat of targetCategories) {
      await client.query(
        `INSERT INTO categories (id, name, slug, description, image_url, is_active)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [cat.id, cat.name, cat.slug, cat.description, cat.imageUrl, cat.isActive]
      );
    }

    await client.query('COMMIT');
    console.log('Categories successfully seeded!');
    process.exit(0);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
