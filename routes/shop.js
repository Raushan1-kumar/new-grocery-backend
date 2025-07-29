// routes/shops.js
const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');

router.post('/', shopController.createShop);            // Add Shop
router.get('/', shopController.getShops);               // Fetch All Shops
router.get('/:id', shopController.getShop);             // Fetch Single Shop
router.put('/:id', shopController.updateShop);          // Edit Shop
router.delete('/:id', shopController.deleteShop);       // Delete Shop

module.exports = router;
