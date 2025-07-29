// models/Shop.js
const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  number: { type: String, required: true }
});

module.exports = mongoose.model('Shop', shopSchema);
