const express = require('express');
const { getCart, addToCart, updateCartItem, removeFromCart } = require('../../controllers/cart/cart.controller');
const { protect } = require('../../middlewares/auth');

const router = express.Router();

router.get('/cart', protect, getCart);

router.post('/cart', protect, addToCart);

router.put('/cart/:productId', protect, updateCartItem);

router.delete('/cart', protect, removeFromCart);

module.exports = router;