const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authMiddleware, optionalAuth } = require('../middleware/authMiddleware');
const { requireCreator } = require('../middleware/roleMiddleware');

// Public endpoints
router.get('/', optionalAuth, productController.getProducts);
router.get('/categories', productController.getCategories);
router.get('/:slug', optionalAuth, productController.getProductBySlug);

// User wishlist / saved products
router.get('/user/saved', authMiddleware, productController.getSavedProducts);
router.post('/user/toggle-save', authMiddleware, productController.toggleSaveProduct);

// Creator / Admin product management
router.post('/', authMiddleware, requireCreator, productController.createProduct);
router.put('/:id', authMiddleware, requireCreator, productController.updateProduct);
router.delete('/:id', authMiddleware, requireCreator, productController.deleteProduct);

module.exports = router;
