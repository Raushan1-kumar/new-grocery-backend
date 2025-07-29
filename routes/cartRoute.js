const express = require('express');
const router = express.Router();
const { addToCart, getCart, removeFromCart, updateCartItem, clearCart } = require('../controllers/cartController');
const auth = require('../middleware/auth');  // JWT auth middleware

// Add to cart
router.post('/add', auth, addToCart);

// Get user cart
router.get('/', auth, getCart);

// Remove a product from cart
router.delete('/remove/:productId', auth, removeFromCart);

// Update cart item quantity or size (optional)
router.put('/update', auth, updateCartItem);

// Clear cart (for after order placed)
router.delete('/clear', auth, clearCart);

module.exports = router;
