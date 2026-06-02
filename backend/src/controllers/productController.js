const Product = require('../models/Product');
const Store = require('../models/Store');

// GET /api/v1/products/store
exports.getStoreProducts = async (req, res) => {
  try {
    const store = await Store.findOne({ owner_id: req.user._id });
    if (!store) return res.status(404).json({ success: false, message: 'Store not found', data: null });

    const products = await Product.find({ store_id: store._id }).sort({ created_at: -1 });
    res.json({ success: true, message: 'Products fetched', data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// POST /api/v1/products
exports.createProduct = async (req, res) => {
  try {
    const store = await Store.findOne({ owner_id: req.user._id });
    if (!store) return res.status(404).json({ success: false, message: 'Store not found', data: null });

    const { name, description, price, stock, category, origin_region } = req.body;
    
    const product = await Product.create({
      store_id: store._id,
      store_name: store.store_name,
      name,
      description,
      price,
      stock,
      category,
      origin_region,
      image_urls: [`https://source.unsplash.com/random/400x400?batik&sig=${Math.random()}`]
    });

    res.status(201).json({ success: true, message: 'Product created', data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// PATCH /api/v1/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const store = await Store.findOne({ owner_id: req.user._id });
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, store_id: store._id },
      req.body,
      { new: true }
    );

    if (!product) return res.status(404).json({ success: false, message: 'Product not found', data: null });
    
    res.json({ success: true, message: 'Product updated', data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// DELETE /api/v1/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const store = await Store.findOne({ owner_id: req.user._id });
    const product = await Product.findOneAndDelete({ _id: req.params.id, store_id: store._id });

    if (!product) return res.status(404).json({ success: false, message: 'Product not found', data: null });
    
    res.json({ success: true, message: 'Product deleted', data: null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// PATCH /api/v1/products/:id/status
exports.toggleProductStatus = async (req, res) => {
  try {
    const store = await Store.findOne({ owner_id: req.user._id });
    const product = await Product.findOne({ _id: req.params.id, store_id: store._id });

    if (!product) return res.status(404).json({ success: false, message: 'Product not found', data: null });
    
    product.is_active = !product.is_active;
    await product.save();

    res.json({ success: true, message: 'Product status updated', data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};
