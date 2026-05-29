const { query } = require('../config/db');
const { mockBanners } = require('../database/mockData');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all active banners
// @route   GET /api/v1/banners
// @access  Public
const getBanners = asyncHandler(async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM banners WHERE is_active = true ORDER BY sort_order ASC');
    
    if (rows.length === 0) {
      return res.status(200).json({
        success: true,
        count: mockBanners.length,
        data: mockBanners
      });
    }

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.warn('Database query failed, falling back to mock banners data:', error.message);
    res.status(200).json({
      success: true,
      count: mockBanners.length,
      data: mockBanners
    });
  }
});

module.exports = {
  getBanners
};
