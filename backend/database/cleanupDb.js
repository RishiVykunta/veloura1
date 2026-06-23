const { Pool } = require('pg');
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

async function cleanupDb() {
  const client = await pool.connect();
  try {
    console.log('🔍 Checking current state of DB...\n');

    // Show all users
    const { rows: users } = await client.query('SELECT id, email, role, created_at FROM users ORDER BY created_at ASC');
    console.log(`Found ${users.length} users:`);
    users.forEach(u => console.log(`  - ${u.email} (${u.role}) [${u.id}]`));

    // Remove duplicate admins — keep the one with the correct admin email
    const adminEmail = process.env.ADMIN_EMAIL || 'theofficialveloura@gmail.com';
    const admins = users.filter(u => u.role === 'admin');
    
    if (admins.length > 1) {
      console.log(`\n⚠️  Found ${admins.length} admin users. Keeping only ${adminEmail}...`);
      for (const admin of admins) {
        if (admin.email !== adminEmail) {
          await client.query('DELETE FROM users WHERE id = $1', [admin.id]);
          console.log(`  ✅ Deleted duplicate admin: ${admin.email}`);
        }
      }
    } else {
      console.log('\n✅ No duplicate admins found.');
    }

    // Show all orders
    const { rows: orders } = await client.query('SELECT id, order_number, order_status, created_at FROM orders ORDER BY created_at ASC');
    console.log(`\nFound ${orders.length} orders:`);
    orders.forEach(o => console.log(`  - ${o.order_number} (${o.order_status}) [${o.id}]`));

    // Delete all test/fake orders if desired
    if (orders.length > 0) {
      await client.query('DELETE FROM order_items WHERE 1=1');
      await client.query('DELETE FROM orders WHERE 1=1');
      console.log(`\n✅ Deleted all ${orders.length} existing orders (fresh start).`);
    }

    console.log('\n🎉 Database cleanup complete!');
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

cleanupDb();
