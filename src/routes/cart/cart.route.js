const express = require('express');
const { getCart, addToCart, updateCartItem, removeFromCart } = require('../../controllers/cart/cart.controller');

const { protect } = require('../../middlewares/auth');

const router = express.Router();

router.get('/cart', getCart);
router.post('/cart', addToCart);
router.put('/productId', protect, updateCartItem);
router.delete('/cart', protect, removeFromCart);

module.exports = router;