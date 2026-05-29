const { query } = require('../config/db');
const { mockCategories } = require('../database/mockData');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all active categories
// @route   GET /api/v1/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM categories WHERE is_active = true ORDER BY name ASC');
    
    // Fallback if DB connects but has no data, or if connection fails (handled by catch)
    if (rows.length === 0) {
      return res.status(200).json({
        success: true,
        count: mockCategories.length,
        data: mockCategories
      });
    }

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.warn('Database query failed, falling back to mock categories data:', error.message);
    res.status(200).json({
      success: true,
      count: mockCategories.length,
      data: mockCategories
    });
  }
});

module.exports = {
  getCategories
};
