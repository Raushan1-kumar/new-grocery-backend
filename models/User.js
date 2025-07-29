const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  number: { type: String, required: true }, // For mobile/phone
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true } // Hashed for security!
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
