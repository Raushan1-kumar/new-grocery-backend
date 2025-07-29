const express = require('express');
const router = express.Router();

const offerController = require('../controllers/offerController');

// For simplicity, assume you have authentication middleware (e.g., isAuth, isSeller).
// Add middleware like `isAuth` in routes to protect as needed.

router.get('/', offerController.getOffers); // List all offers, filter with query params

router.get('/:id', offerController.getOfferById); // Get one offer by ID

router.post('/', offerController.createOffer); // Create new offer

router.put('/:id', offerController.updateOffer); // Update offer

router.delete('/:id', offerController.deleteOffer); // Delete offer

module.exports = router;
