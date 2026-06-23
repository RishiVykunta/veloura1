const express = require('express');
const { getAllOrders, updateOrderStatus, createOrder } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/admin', protect, authorize('admin'), getAllOrders);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);
router.post('/', protect, createOrder);

module.exports = router;
