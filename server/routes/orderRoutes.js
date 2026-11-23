const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware, optionalAuth } = require('../middleware/authMiddleware');

// Demo checkout is open to both logged-in users and guests
router.post('/checkout', optionalAuth, orderController.createDemoOrder);
router.get('/my-orders', authMiddleware, orderController.getUserOrders);
router.get('/:identifier', optionalAuth, orderController.getOrderById);
router.get('/download/:downloadKey', orderController.downloadAsset);

module.exports = router;
