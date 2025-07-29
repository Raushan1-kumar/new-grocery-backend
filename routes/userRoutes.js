const express = require('express');
const router = express.Router();
const {
  registerUser, loginUser,
  getProfile, updateProfile, deleteProfile, getAllUsers
} = require('../controllers/userController');
const auth = require('../middleware/auth');

// Register NEW user
router.post('/register', registerUser);

// Login user (returns JWT token)
router.post('/login', loginUser);

// Get current user's own profile
router.get('/me', auth, getProfile);

// Edit profile
router.put('/me', auth, updateProfile);

// Delete user profile
router.delete('/me', auth, deleteProfile);

// Admin: Get all users (optional)
router.get('/', getAllUsers);

module.exports = router;
