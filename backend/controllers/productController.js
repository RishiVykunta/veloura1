const { query } = require('../config/db');
const { mockProducts, mockCategories } = require('../database/mockData');
const asyncHandler = require('../utils/asyncHandler');

function mapProductRowToCamel(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    shortDescription: row.short_description,
    description: row.description,
    sku: row.sku,
    categoryId: row.category_id,
    price: row.price ? parseFloat(row.price) : 0,
    discountPrice: row.discount_price ? parseFloat(row.discount_price) : null,
    stockQuantity: row.stock_quantity,
    material: row.material,
    shippingInfo: row.shipping_info,
    occasionType: row.occasion_type,
    collectionType: row.collection_type,
    isFeatured: row.is_featured,
    isBestSeller: row.is_best_seller,
    isNewArrival: row.is_new_arrival,
    isActive: row.is_active,
    averageRating: row.average_rating ? parseFloat(row.average_rating) : 0,
    totalReviews: row.total_reviews,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// Helper to compile a full product object (with images, variants, features, tags) from database
async function getCompleteProduct(productRow) {
  const productId = productRow.id;
  
  const { rows: images } = await query('SELECT image_url as "imageUrl", is_primary as "isPrimary" FROM product_images WHERE product_id = $1 ORDER BY sort_order ASC', [productId]);
  const { rows: variants } = await query('SELECT id, size, color, color_hex as "colorHex", stock, sku FROM product_variants WHERE product_id = $1', [productId]);
  const { rows: features } = await query('SELECT feature_name as "featureName" FROM product_features WHERE product_id = $1', [productId]);
  const { rows: tags } = await query('SELECT tag_name as "tagName" FROM product_tags WHERE product_id = $1', [productId]);

  const mapped = mapProductRowToCamel(productRow);

  return {
    ...mapped,
    primaryImage: productRow.primaryImage || (images.find(img => img.isPrimary)?.imageUrl) || (images[0]?.imageUrl) || null,
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
      sqlQuery += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex + 1})`;
      params.push(`%${search}%`, `%${search}%`);
      paramIndex += 2;
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

    // Only fall back to mock data when the database itself is completely empty (no filters applied)
    if (rows.length === 0 && !category && !search && !size && !color && !collection) {
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

// @desc    Get single product by ID (for admin edit)
// @route   GET /api/v1/products/id/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await query('SELECT * FROM products WHERE id = $1', [id]);
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
    console.warn(`Product query for id ${id} failed, searching mock dataset:`, error.message);
    const product = mockProducts.find(p => p.id === id);
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

const getFeaturedProducts = asyncHandler(async (req, res) => {
  try {
    let { rows } = await query('SELECT * FROM products WHERE is_featured = true AND is_active = true LIMIT 8');
    
    // If no products are explicitly marked as featured, fallback to active products in DB
    if (rows.length === 0) {
      const activeResult = await query('SELECT * FROM products WHERE is_active = true LIMIT 8');
      rows = activeResult.rows;
    }

    if (rows.length === 0) {
      throw new Error('No products in DB');
    }
    
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
  const { name, description, price, discountPrice, sku, categoryId, images, variants, features, tags, isActive, isNewArrival, isFeatured, shippingInfo, material } = req.body;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  try {
    const { rows } = await query(
      `INSERT INTO products (name, slug, description, sku, category_id, price, discount_price, stock_quantity, is_active, is_featured, is_new_arrival, shipping_info, material)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [
        name, 
        slug, 
        description, 
        sku, 
        categoryId, 
        price ? parseFloat(price) : 0, 
        discountPrice ? parseFloat(discountPrice) : null,
        100, 
        isActive !== false, 
        !!isFeatured, 
        !!isNewArrival,
        shippingInfo || null,
        material || null
      ]
    );

    const product = rows[0];

    // Images
    if (images && images.length > 0) {
      for (const imgUrl of images) {
        await query('INSERT INTO product_images (product_id, image_url, is_primary) VALUES ($1, $2, $3)', [product.id, imgUrl, imgUrl === images[0]]);
      }
    }

    // Variants
    if (variants && variants.length > 0) {
      for (const v of variants) {
        await query(
          'INSERT INTO product_variants (product_id, size, color, color_hex, stock, sku) VALUES ($1, $2, $3, $4, $5, $6)',
          [product.id, v.size, v.color, v.colorHex || '#D4AF37', v.stock || 10, v.sku]
        );
      }
    }

    // Features
    if (features && features.length > 0) {
      for (const f of features) {
        await query('INSERT INTO product_features (product_id, feature_name) VALUES ($1, $2)', [product.id, f]);
      }
    }

    // Tags
    if (tags && tags.length > 0) {
      for (const t of tags) {
        await query('INSERT INTO product_tags (product_id, tag_name) VALUES ($1, $2)', [product.id, t]);
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
      shippingInfo,
      material,
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

// @desc    Update a product (Admin only)
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, price, discountPrice, sku, categoryId, images, variants, features, tags, isActive, isNewArrival, isFeatured, shippingInfo, material } = req.body;
  const slug = name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : undefined;

  try {
    const { rows } = await query(
      `UPDATE products 
       SET name = $1, 
           slug = $2, 
           description = $3, 
           sku = $4, 
           category_id = $5, 
           price = $6,
           discount_price = $7,
           is_active = $8,
           is_featured = $9,
           is_new_arrival = $10,
           shipping_info = $11,
           material = $12
       WHERE id = $13 RETURNING *`,
      [
        name, 
        slug, 
        description, 
        sku, 
        categoryId, 
        price ? parseFloat(price) : 0,
        discountPrice ? parseFloat(discountPrice) : null,
        isActive !== false,
        !!isFeatured,
        !!isNewArrival,
        shippingInfo || null,
        material || null,
        id
      ]
    );

    if (rows.length === 0) {
      res.status(404);
      throw new Error('Product not found in database');
    }

    // Clear old images and insert new ones
    if (images && images.length > 0) {
      await query('DELETE FROM product_images WHERE product_id = $1', [id]);
      for (const imgUrl of images) {
        await query('INSERT INTO product_images (product_id, image_url, is_primary) VALUES ($1, $2, $3)', [id, imgUrl, imgUrl === images[0]]);
      }
    }

    // Update Variants
    if (variants) {
      await query('DELETE FROM product_variants WHERE product_id = $1', [id]);
      if (variants.length > 0) {
        for (const v of variants) {
          await query(
            'INSERT INTO product_variants (product_id, size, color, color_hex, stock, sku) VALUES ($1, $2, $3, $4, $5, $6)',
            [id, v.size, v.color, v.colorHex || '#D4AF37', v.stock || 10, v.sku]
          );
        }
      }
    }

    // Update Features
    if (features) {
      await query('DELETE FROM product_features WHERE product_id = $1', [id]);
      if (features.length > 0) {
        for (const f of features) {
          await query('INSERT INTO product_features (product_id, feature_name) VALUES ($1, $2)', [id, f]);
        }
      }
    }

    // Update Tags
    if (tags) {
      await query('DELETE FROM product_tags WHERE product_id = $1', [id]);
      if (tags.length > 0) {
        for (const t of tags) {
          await query('INSERT INTO product_tags (product_id, tag_name) VALUES ($1, $2)', [id, t]);
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: rows[0]
    });
  } catch (error) {
    console.error('DB update failed:', error.message);
    // Try mock fallback for mock/demo products
    const index = mockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      mockProducts[index] = {
        ...mockProducts[index],
        ...req.body,
        price: price ? parseFloat(price) : mockProducts[index].price,
        slug: slug || mockProducts[index].slug
      };
      return res.status(200).json({
        success: true,
        message: 'Product updated successfully (Mock Offline Mode)',
        data: mockProducts[index]
      });
    }
    // Real DB product — return the actual error so the frontend can show it
    return res.status(500).json({
      success: false,
      message: error.message || 'Database error while updating product'
    });
  }
});

// @desc    Delete a product (Admin only)
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const { rowCount } = await query('DELETE FROM products WHERE id = $1', [id]);
    if (rowCount === 0) {
      res.status(404);
      throw new Error('Product not found in database');
    }
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.warn('DB delete failed, deleting from mock dataset:', error.message);
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    mockProducts.splice(index, 1);
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully (Mock Offline Mode)'
    });
  }
});

module.exports = {
  getProducts,
  getProductBySlug,
  getProductById,
  getFeaturedProducts,
  getBestSellers,
  getNewArrivals,
  createProduct,
  updateProduct,
  deleteProduct
};
