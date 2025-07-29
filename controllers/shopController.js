// controllers/shopController.js
const Shop = require('../models/Shop');

// 1. Add/Create
exports.createShop = async (req, res) => {
  try {
    const { name, address, number } = req.body;
    const shop = new Shop({ name, address, number });
    await shop.save();
    res.status(201).json(shop);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 2. Fetch/Read (All shops)
exports.getShops = async (req, res) => {
  try {
    const shops = await Shop.find();
    res.status(200).json(shops);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 3. Fetch/Read (Single shop)
exports.getShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) throw new Error('Shop not found');
    res.status(200).json(shop);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// 4. Edit/Update
exports.updateShop = async (req, res) => {
  const { id } = req.params;
  const { name, address, number } = req.body;
  try {
    const shop = await Shop.findByIdAndUpdate(
      id,
      { name, address, number },
      { new: true, runValidators: true }
    );
    if (!shop) throw new Error('Shop not found');
    res.status(200).json(shop);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 5. Delete
exports.deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findByIdAndDelete(req.params.id);
    if (!shop) throw new Error('Shop not found');
    res.status(200).json({ message: 'Shop deleted successfully' });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
