const express = require('express');
const {
  getProducts,
  getProductBySlug,
  getFeaturedProducts,
  getBestSellers,
  getNewArrivals,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const router = express.Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/best-sellers', getBestSellers);
router.get('/new-arrivals', getNewArrivals);
router.get('/:slug', getProductBySlug);
router.post('/create', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
