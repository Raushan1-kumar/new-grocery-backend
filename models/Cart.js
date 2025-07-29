const mongoose = require('mongoose');
const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 },
  size: { type: String },          // e.g. '1kg', '10g', ...
  price: { type: Number, required: true }, // price at the time carted
  productName: { type: String, required: true }, // name of the product
  imageUrl: { type: String } // optional, can be used for displaying in cart
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cart', cartSchema);
