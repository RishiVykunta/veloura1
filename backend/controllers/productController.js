const { query } = require('../config/db');
const { mockProducts, mockCategories } = require('../database/mockData');
const asyncHandler = require('../utils/asyncHandler');

// Helper to compile a full product object (with images, variants, features, tags) from database
async function getCompleteProduct(productRow) {
  const productId = productRow.id;
  
  const { rows: images } = await query('SELECT image_url as "imageUrl", is_primary as "isPrimary" FROM product_images WHERE product_id = $1 ORDER BY sort_order ASC', [productId]);
  const { rows: variants } = await query('SELECT id, size, color, color_hex as "colorHex", stock, sku FROM product_variants WHERE product_id = $1', [productId]);
  const { rows: features } = await query('SELECT feature_name as "featureName" FROM product_features WHERE product_id = $1', [productId]);
  const { rows: tags } = await query('SELECT tag_name as "tagName" FROM product_tags WHERE product_id = $1', [productId]);

  return {
    ...productRow,
    images,
    variants,
    features: features.map(f => f.featureName),
    tags: tags.map(t => t.tagName)
  };
}

// @desc    Get all products (with dynamic filtering)
// @route   GET /api/v1/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const { category, minPrice, maxPrice, size, color, search, sort, collection } = req.query;

  try {
    let sqlQuery = `
      SELECT DISTINCT p.*, pi.image_url as "primaryImage"
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
      LEFT JOIN product_variants pv ON p.id = pv.product_id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
    `;
    const params = [];
    let paramIndex = 1;

    if (category) {
      sqlQuery += ` AND (c.slug = $${paramIndex} OR c.id::text = $${paramIndex})`;
      params.push(category);
      paramIndex++;
    }

    if (collection) {
      sqlQuery += ` AND p.collection_type ILIKE $${paramIndex}`;
      params.push(`%${collection}%`);
      paramIndex++;
    }

    if (minPrice) {
      sqlQuery += ` AND p.price >= $${paramIndex}`;
      params.push(parseFloat(minPrice));
      paramIndex++;
    }

    if (maxPrice) {
      sqlQuery += ` AND p.price <= $${paramIndex}`;
      params.push(parseFloat(maxPrice));
      paramIndex++;
    }

    if (size) {
      sqlQuery += ` AND pv.size = $${paramIndex}`;
      params.push(size);
      paramIndex++;
    }

    if (color) {
      sqlQuery += ` AND pv.color ILIKE $${paramIndex}`;
      params.push(color);
      paramIndex++;
    }

    if (search) {
      sqlQuery += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Apply Sorting
    if (sort === 'price_asc') {
      sqlQuery += ' ORDER BY p.price ASC';
    } else if (sort === 'price_desc') {
      sqlQuery += ' ORDER BY p.price DESC';
    } else if (sort === 'ratings') {
      sqlQuery += ' ORDER BY p.average_rating DESC';
    } else {
      sqlQuery += ' ORDER BY p.created_at DESC'; // default newest
    }

    const { rows } = await query(sqlQuery, params);

    // If query returns empty because database is empty, trigger fallback
    if (rows.length === 0 && params.length === 0) {
      throw new Error('Database is empty');
    }

    // Load full details (images, variants) for each product
    const fullProducts = await Promise.all(rows.map(row => getCompleteProduct(row)));

    res.status(200).json({
      success: true,
      count: fullProducts.length,
      data: fullProducts
    });

  } catch (error) {
    console.warn('Database products query failed, using offline fallback filter engine:', error.message);
    
    // JS Filtering Engine for mockProducts
    let filtered = [...mockProducts];

    if (category) {
      const catObj = mockCategories.find(c => c.slug === category || c.id === category);
      const catId = catObj ? catObj.id : category;
      filtered = filtered.filter(p => p.categoryId === catId);
    }

    if (collection) {
      filtered = filtered.filter(p => p.collectionType?.toLowerCase().includes(collection.toLowerCase()));
    }

    if (minPrice) {
      filtered = filtered.filter(p => p.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter(p => p.price <= parseFloat(maxPrice));
    }

    if (size) {
      filtered = filtered.filter(p => p.variants.some(v => v.size === size));
    }

    if (color) {
      filtered = filtered.filter(p => p.variants.some(v => v.color.toLowerCase() === color.toLowerCase()));
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    // Apply sorting
    if (sort === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'ratings') {
      filtered.sort((a, b) => b.averageRating - a.averageRating);
    } else {
      // Default to newest / index order
    }

    res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  }
});

// @desc    Get single product by slug
// @route   GET /api/v1/products/:slug
// @access  Public
const getProductBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  try {
    const { rows } = await query('SELECT * FROM products WHERE slug = $1 AND is_active = true', [slug]);
    if (rows.length === 0) {
      res.status(404);
      throw new Error('Product not found in database');
    }

    const completeProduct = await getCompleteProduct(rows[0]);
    res.status(200).json({
      success: true,
      data: completeProduct
    });
  } catch (error) {
    console.warn(`Product query for ${slug} failed, searching mock dataset:`, error.message);
    const product = mockProducts.find(p => p.slug === slug);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.status(200).json({
      success: true,
      data: product
    });
  }
});

// @desc    Get featured products
// @route   GET /api/v1/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM products WHERE is_featured = true AND is_active = true LIMIT 8');
    if (rows.length === 0) throw new Error('No featured products in DB');
    
    const data = await Promise.all(rows.map(row => getCompleteProduct(row)));
    res.status(200).json({ success: true, data });
  } catch (error) {
    const data = mockProducts.filter(p => p.isFeatured);
    res.status(200).json({ success: true, data });
  }
});

// @desc    Get best sellers
// @route   GET /api/v1/products/best-sellers
// @access  Public
const getBestSellers = asyncHandler(async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM products WHERE is_best_seller = true AND is_active = true LIMIT 8');
    if (rows.length === 0) throw new Error('No best sellers in DB');

    const data = await Promise.all(rows.map(row => getCompleteProduct(row)));
    res.status(200).json({ success: true, data });
  } catch (error) {
    const data = mockProducts.filter(p => p.isBestSeller);
    res.status(200).json({ success: true, data });
  }
});

// @desc    Get new arrivals
// @route   GET /api/v1/products/new-arrivals
// @access  Public
const getNewArrivals = asyncHandler(async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM products WHERE is_new_arrival = true AND is_active = true ORDER BY created_at DESC LIMIT 8');
    if (rows.length === 0) throw new Error('No new arrivals in DB');

    const data = await Promise.all(rows.map(row => getCompleteProduct(row)));
    res.status(200).json({ success: true, data });
  } catch (error) {
    const data = mockProducts.filter(p => p.isNewArrival);
    res.status(200).json({ success: true, data });
  }
});

// @desc    Create a product (Admin only, stubbed/mocked)
// @route   POST /api/v1/products/create
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, sku, categoryId, images, variants, features, tags } = req.body;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  try {
    const { rows } = await query(
      `INSERT INTO products (name, slug, description, sku, category_id, price, stock_quantity)
       VALUES ($1, $2, $3, $4, $5, $6, 100) RETURNING *`,
      [name, slug, description, sku, categoryId, price]
    );

    const product = rows[0];

    // Images
    if (images && images.length > 0) {
      for (const imgUrl of images) {
        await query('INSERT INTO product_images (product_id, image_url, is_primary) VALUES ($1, $2, $3)', [product.id, imgUrl, imgUrl === images[0]]);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    // If DB fails, simulate successful creation
    console.warn('DB write failed during product creation, simulating response:', error.message);
    const newMockProduct = {
      id: `mock-${Date.now()}`,
      name,
      slug,
      description,
      sku,
      price: parseFloat(price),
      categoryId,
      images: images ? images.map(url => ({ imageUrl: url, isPrimary: url === images[0] })) : [],
      variants: variants || [],
      features: features || [],
      tags: tags || []
    };

    mockProducts.push(newMockProduct);

    res.status(201).json({
      success: true,
      message: 'Product created successfully (Mock Offline Mode)',
      data: newMockProduct
    });
  }
});

module.exports = {
  getProducts,
  getProductBySlug,
  getFeaturedProducts,
  getBestSellers,
  getNewArrivals,
  createProduct
};
