const asyncHandler = require('../utils/asyncHandler');
const { query } = require('../config/db');

// @desc    Get all users (Admin only)
// @route   GET /api/v1/users/admin
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const { rows } = await query(
      'SELECT id, first_name as "firstName", last_name as "lastName", email, role, created_at as "createdAt" FROM users ORDER BY created_at DESC'
    );
    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(200).json({
      success: true,
      data: []
    });
  }
});

module.exports = { getAllUsers };
