const categories = {
  'fruits-vegetables': { unit: 'kg', requiredFields: ['sizes'] }, // <-- set to 'sizes' if you want multi-size
  'rice-daal': { unit: 'kg', requiredFields: ['sizes'] },             // <-- set to 'sizes' if you want multi-size
  'oil-ghee': { unit: 'kg', requiredFields: ['sizes'] },
  'sweets': { unit: 'kg', requiredFields: ['sizes'] },
  'spices': { unit: 'g', requiredFields: ['sizes'] },
  'cakes': { unit: 'piece', requiredFields: ['sizes'] },
  'kurkure-chips': { unit: 'packet', requiredFields: ['sizes'] },
  'biscuits': { unit: 'packet', requiredFields: ['sizes'] },
  'munch': { unit: 'packet', requiredFields: ['sizes'] },
  'personal-care': { unit: 'unit', requiredFields: ['sizes'] },
  'household-cleaning': { unit: 'unit', requiredFields: ['sizes'] },
  'beverages': { unit: 'ml', requiredFields: ['sizes'] }, // multiple bottle sizes supported
  'dry-fruits': { unit: 'g', requiredFields: ['sizes'] }
  // If a category needs single-attribute style, use: requiredFields: ['weight', 'pricePerKg'] etc.
};

const validateProduct = (req, res, next) => {
  const { category, productName } = req.body;

  let attributes, sizes;
  try {
    attributes = req.body.attributes ? JSON.parse(req.body.attributes) : {};
    sizes = req.body.sizes ? JSON.parse(req.body.sizes) : [];
  } catch (error) {
    console.error('JSON parsing error:', error);
    return res.status(400).json({ message: 'Invalid attributes or sizes format' });
  }

  if (!productName || !category) {
    return res.status(400).json({ message: 'Product name and category are required' });
  }

  if (!categories[category]) {
    return res.status(400).json({ message: 'Invalid category' });
  }

  const reqFields = categories[category].requiredFields;

  // Case 1: sizes-based (multi-pack/weight)
  if (reqFields.length === 1 && reqFields[0] === 'sizes') {
    if (!sizes || !Array.isArray(sizes) || sizes.length === 0 || sizes.some(s => !s.size || !s.price)) {
      return res.status(400).json({ message: 'Please provide all size and price values for this category' });
    }
  }
  // Case 2: attribute-based (single pack/weight)
  else {
    if (!attributes || reqFields.some(field => !attributes[field])) {
      return res.status(400).json({ message: 'Missing required fields: ' + reqFields.join(', ') });
    }
  }

  req.body.attributes = attributes;
  req.body.sizes = sizes;
  next();
};

module.exports = validateProduct;
