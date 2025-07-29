const express = require('express');
const router = express.Router();
const multer = require('multer');
const productController = require('../controllers/productController');
const validateProduct = require('../middleware/validateProduct');
const validateCategory = require('../middleware/validateCategory');

// Set up multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Multer error handling middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('Multer error:', err);
    return res.status(400).json({ message: `Multer error: ${err.message}`, error: err.code });
  }
  next(err);
};

router.post('/', upload.single('image'), handleMulterError, validateProduct, productController.addProduct);
router.get('/:category', validateCategory, productController.getProductsByCategory);

module.exports = router;