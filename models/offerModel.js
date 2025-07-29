const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  categoryName: {
    type: String,
    required: true,
  },
  minPurchase: {
    type: Number,
    required: true,
    min: 0,
  },
  discount: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  createdBySeller: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);
