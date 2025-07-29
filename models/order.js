const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      productName: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true, min: 0 },
      size: { type: String, default: null },
      imageUrl: { type: String, default: null },
    },
  ],
  status: {
    type: String,
    required: true,
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  shop: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      default: null,
    },
    name: String,         // Shop's name (from frontend data)
    address: String       // Shop's address (from frontend data)
  },
  totalDiscount: {
    type: Number,
    default: 0,
    min: 0,
  },
  appliedOffers: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer', required: true },
      discount: { type: Number, required: true, min: 0 }, // Discount % applied
      productName: { type: String, required: true },      // To identify product offer applied on
    }
  ]
},);

// Update timestamps on every save
orderSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', orderSchema);
