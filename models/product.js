const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  category: { type: String, required: true },
  productName: { type: String, required: true },
  attributes: {
    type: Map,
    of: mongoose.Mixed,
    default: {}
  },
  sizes: [{
    size: String,
    price: Number
  }],
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);