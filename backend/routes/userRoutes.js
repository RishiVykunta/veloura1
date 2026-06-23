const express = require('express');
const { getAllUsers } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/admin', protect, authorize('admin'), getAllUsers);

module.exports = router;
