const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.put('/item/:cartItemId', cartController.updateQuantity);
router.delete('/item/:cartItemId', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);

module.exports = router;
