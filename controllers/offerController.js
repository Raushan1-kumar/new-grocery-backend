const Offer = require('../models/offerModel');
const Product = require('../models/product');


// Get all offers (with optional filtering by category or product)
const getOffers = async (req, res) => {
  try {
    const { categoryName, product } = req.query;
    let filter = {};

    if (categoryName) filter.categoryName = categoryName;
    if (product) filter.product = product;

    const offers = await Offer.find(filter)
      .populate('product', 'productName categoryName')
      .exec();

    res.json({ success: true, offers });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching offers', error: err.message });
  }
};


// Get one offer by ID
const getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id)
      .populate('product', 'productName')
      .populate('category', 'categoryName')
      .exec();

    if (!offer) return res.status(404).json({ success: false, message: 'Offer not found' });

    res.json({ success: true, offer });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching offer', error: err.message });
  }
};




// Create a new offer
const createOffer = async (req, res) => {
  try {
    const { categoryName, product, minPurchase, discount, description, createdBySeller } = req.body;

    if (!categoryName || !product || minPurchase == null || discount == null || !description || !createdBySeller) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }
   console.log(categoryName, product, minPurchase, discount, description, createdBySeller);
    const productDoc = await Product.findById(product);
    if (!productDoc) {
      return res.status(400).json({ success: false, message: 'Product not found' });
    }

    if (productDoc.category !== categoryName) {
      return res.status(400).json({ success: false, message: 'Product does not belong to selected category' });
    }

    const offerDescription = description || `Get ${discount}% off on ${productDoc.productName} when you spend ₹${minPurchase} or more!`;

    const newOffer = new Offer({
      categoryName,
      product,
      minPurchase,
      discount,
      description: offerDescription,
      createdBySeller,
    });

    const savedOffer = await newOffer.save();
    res.status(201).json({ success: true, offer: savedOffer });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error creating offer', error: err.message });
  }
};


// Update/Edit offer by ID
const updateOffer = async (req, res) => {
  try {
    const { category, product, minPurchase, discount, description, createdBySeller } = req.body;

    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ success: false, message: 'Offer not found' });

    // Optional: Validate product belongs to category on update as well
    if (category && product) {
      const productDoc = await Product.findOne({ _id: product, category: category });
      if (!productDoc) {
        return res.status(400).json({ success: false, message: 'Product does not belong to selected category' });
      }
    }

    // Update fields if provided
    if (category) offer.category = category;
    if (product) offer.product = product;
    if (minPurchase != null) offer.minPurchase = minPurchase;
    if (discount != null) offer.discount = discount;
    if (description) offer.description = description;
    if (createdBySeller) offer.createdBySeller = createdBySeller;

    const updatedOffer = await offer.save();
    res.json({ success: true, offer: updatedOffer });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating offer', error: err.message });
  }
};

// Delete offer by ID
const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) return res.status(404).json({ success: false, message: 'Offer not found' });
    res.json({ success: true, message: 'Offer deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting offer', error: err.message });
  }
};

module.exports = {
  getOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
};
