const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
exports.registerUser = async (req, res) => {
  try {
    const { name, address, number, email, password } = req.body;
    if (!name || !address || !number || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email already in use' });
    const hashed = await bcrypt.hash(password, 10);
    user = new User({ name, address, number, email, password: hashed });
    await user.save();
    res.status(201).json({ message: 'User registered', user: { name, address, number, email, _id: user._id } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });
  // Issue JWT
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({
    token,
    user: { name: user.name, address: user.address, number: user.number, email: user.email }
  });
};

// Read user profile (current logged in user)
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

// Update profile
exports.updateProfile = async (req, res) => {
  const updates = {};
  ['name', 'address', 'number'].forEach((f) => {
    if (req.body[f]) updates[f] = req.body[f];
  });
  // Optional: Allow password update
  if (req.body.password) {
    updates.password = await bcrypt.hash(req.body.password, 10);
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true, runValidators: true }
  ).select('-password');
  res.json({ message: 'Profile updated', user });
};

// Delete user profile
exports.deleteProfile = async (req, res) => {
  await User.findByIdAndDelete(req.user._id);
  res.json({ message: 'User deleted' });
};

// (Optional) List all users (admin only)
exports.getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};
