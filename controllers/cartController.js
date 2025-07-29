const Cart = require('../models/Cart');

// 1. Add to cart (merge logic)
exports.addToCart = async (req, res) => {
  const userId = req.user._id; // from auth middleware
  const { productId, quantity, size, price, productName, imageurl } = req.body;
  if (!productId || !quantity || !price) {
    return res.status(400).json({ message: 'Product ID, quantity, and price are required.' });
  }

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    // New cart for user
    cart = new Cart({ userId, items: [] });
  }

  // Check if item (and size) exists in cart already
  const existingItem = cart.items.find(
    item => item.productId.toString() === productId && item.size === size
  );
  if (existingItem) {
    existingItem.quantity += quantity; // increase qty
    existingItem.price = price; // update price if needed
  } else {
    cart.items.push({ productId, quantity, size, price, productName, imageurl });
  }
  cart.updatedAt = Date.now();
  await cart.save();
  res.status(200).json({ message: 'Item added to cart', cart });
};

// 2. Get user's cart
exports.getCart = async (req, res) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ userId }).populate('items.productId');
  if (!cart) return res.status(200).json({ cart: { items: [] } });
  res.status(200).json({ cart });
};

// 3. Remove item from cart
exports.removeFromCart = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;
  let cart = await Cart.findOne({ userId });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  cart.items = cart.items.filter(item => item.productId.toString() !== productId);
  cart.updatedAt = Date.now();
  await cart.save();
  res.json({ message: 'Item removed', cart });
};

// 4. Update cart item (quantity, size, etc.)
exports.updateCartItem = async (req, res) => {
  const userId = req.user._id;
  const { productId, size, quantity } = req.body;
  let cart = await Cart.findOne({ userId });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  const item = cart.items.find(it => it.productId.toString() === productId && it.size === size);
  if (!item) return res.status(404).json({ message: 'Item not found in cart' });

  item.quantity = quantity;
  cart.updatedAt = Date.now();
  await cart.save();
  res.json({ message: 'Cart updated', cart });
};

// 5. Clear cart (after order placed)
exports.clearCart = async (req, res) => {
  const userId = req.user._id;
  await Cart.findOneAndUpdate({ userId }, { items: [] });
  res.json({ message: 'Cart cleared' });
};