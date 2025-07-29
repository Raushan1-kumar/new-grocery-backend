const categories = [
  'fruits-vegetables',
  'rice-daal',
  'oil-ghee',
  'sweets',
  'spices',
  'cakes',
  'kurkure-chips',
  'biscuits',
  'munch',
  'personal-care',
  'household-cleaning',
  'beverages',
  'dry-fruits'
];

const validateCategory = (req, res, next) => {
  const { category } = req.params;

  if (!categories.includes(category)) {
    return res.status(400).json({ message: `Invalid category: ${category}` });
  }

  next();
};

module.exports = validateCategory;