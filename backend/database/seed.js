const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { mockCategories, mockBanners, mockProducts } = require('./mockData');

const connectionString = process.env.NEON_DATABASE_URL;
if (!connectionString) {
  console.error('Error: NEON_DATABASE_URL environment variable is missing.');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function seed() {
  const client = await pool.connect();
  try {
    console.log('Beginning database seeding...');
    await client.query('BEGIN');

    // 1. Clear Existing Data in logical order (respect foreign keys)
    console.log('Clearing old records...');
    await client.query('TRUNCATE product_variants, product_images, product_videos, product_features, product_tags, products, categories, banners CASCADE;');

    // 2. Insert Categories
    console.log('Seeding categories...');
    for (const cat of mockCategories) {
      await client.query(
        `INSERT INTO categories (id, name, slug, description, image_url, is_active)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [cat.id, cat.name, cat.slug, cat.description, cat.imageUrl, cat.isActive]
      );
    }

    // 3. Insert Banners
    console.log('Seeding banners...');
    for (const b of mockBanners) {
      await client.query(
        `INSERT INTO banners (id, title, subtitle, banner_type, desktop_image_url, mobile_image_url, redirect_url, sort_order, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [b.id, b.title, b.subtitle, b.bannerType, b.desktopImageUrl, b.mobileImageUrl, b.redirectUrl, b.sortOrder, b.isActive]
      );
    }

    // 4. Insert Products, Images, Variants, Features, Tags
    console.log('Seeding products and associations...');
    for (const p of mockProducts) {
      // Products Table
      await client.query(
        `INSERT INTO products (id, name, slug, short_description, description, sku, category_id, price, discount_price, stock_quantity, material, shipping_info, occasion_type, collection_type, is_featured, is_best_seller, is_new_arrival, is_active, average_rating, total_reviews)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)`,
        [p.id, p.name, p.slug, p.shortDescription, p.description, p.sku, p.categoryId, p.price, p.discountPrice, p.stockQuantity, p.material, p.shippingInfo, p.occasionType, p.collectionType, p.isFeatured, p.isBestSeller, p.isNewArrival, p.isActive, p.averageRating, p.totalReviews]
      );

      // Product Images Table
      for (const img of p.images) {
        await client.query(
          `INSERT INTO product_images (product_id, image_url, is_primary)
           VALUES ($1, $2, $3)`,
          [p.id, img.imageUrl, img.isPrimary]
        );
      }

      // Product Variants Table
      for (const v of p.variants) {
        await client.query(
          `INSERT INTO product_variants (product_id, size, color, color_hex, stock, sku)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [p.id, v.size, v.color, v.colorHex, v.stock, v.sku]
        );
      }

      // Product Features Table
      for (const feat of p.features) {
        await client.query(
          `INSERT INTO product_features (product_id, feature_name)
           VALUES ($1, $2)`,
          [p.id, feat]
        );
      }

      // Product Tags Table
      for (const tag of p.tags) {
        await client.query(
          `INSERT INTO product_tags (product_id, tag_name)
           VALUES ($1, $2)`,
          [p.id, tag]
        );
      }
    }

    await client.query('COMMIT');
    console.log('Database successfully seeded with Veloura luxury collections!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seeding transaction failed, rolled back changes:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
