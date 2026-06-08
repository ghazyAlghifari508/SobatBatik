const Product = require('../models/Product');
const Store = require('../models/Store');

// GET /api/v1/products (Public)
// Supports: ?search=, ?category=, ?region=, ?min_price=, ?max_price=, ?sort=newest|price_asc|price_desc|rating, ?page=, ?limit=
exports.getAllProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      region,
      min_price,
      max_price,
      sort = 'newest',
      page = 1,
      limit = 20,
    } = req.query;

    // Build filter query
    const filter = { is_active: true };

    // Full-text search: name, description, origin_region, store_name
    if (search && search.trim()) {
      const regex = new RegExp(search.trim().split(/\s+/).join('|'), 'i');
      filter.$or = [
        { name: regex },
        { description: regex },
        { origin_region: regex },
        { store_name: regex },
      ];
    }

    if (category && category !== 'Semua Kategori') {
      filter.category = category;
    }

    if (region && region !== 'Semua Daerah') {
      filter.origin_region = region;
    }

    if (min_price || max_price) {
      filter.price = {};
      if (min_price) filter.price.$gte = Number(min_price);
      if (max_price) filter.price.$lte = Number(max_price);
    }

    // Sort
    let sortQuery = { created_at: -1 };
    if (sort === 'price_asc') sortQuery = { price: 1 };
    else if (sort === 'price_desc') sortQuery = { price: -1 };
    else if (sort === 'rating') sortQuery = { rating: -1 };

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [products, totalProducts] = await Promise.all([
      Product.find(filter).sort(sortQuery).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      message: 'Products fetched',
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalProducts,
        totalPages: Math.ceil(totalProducts / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

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

// GET /api/v1/products/:id (Public)
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Produk tidak ditemukan', data: null });
    res.json({ success: true, message: 'Product fetched', data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// POST /api/v1/products
exports.createProduct = async (req, res) => {
  try {
    const store = await Store.findOne({ owner_id: req.user._id });
    if (!store) return res.status(404).json({ success: false, message: 'Store not found', data: null });

    const { name, description, price, category, origin_region } = req.body;
    let sizes = { S: 0, M: 0, L: 0, XL: 0 };
    if (req.body.sizes) {
      try {
        sizes = typeof req.body.sizes === 'string' ? JSON.parse(req.body.sizes) : req.body.sizes;
      } catch (e) {
        console.error('Error parsing sizes:', e);
      }
    }
    
    // Total stock is sum of sizes
    const stock = (Number(sizes.S) || 0) + (Number(sizes.M) || 0) + (Number(sizes.L) || 0) + (Number(sizes.XL) || 0);
    
    let image_urls = [];
    if (req.file) {
      image_urls = [`/uploads/${req.file.filename}`];
    } else {
      image_urls = [`https://source.unsplash.com/random/400x400?batik&sig=${Math.random()}`];
    }

    const product = await Product.create({
      store_id: store._id,
      store_name: store.store_name,
      name,
      description,
      price,
      stock,
      sizes,
      category,
      origin_region,
      image_urls
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
    
    let updateData = { ...req.body };
    if (req.file) {
      updateData.image_urls = [`/uploads/${req.file.filename}`];
    }
    
    if (updateData.sizes) {
      try {
        const sizesObj = typeof updateData.sizes === 'string' ? JSON.parse(updateData.sizes) : updateData.sizes;
        updateData.sizes = sizesObj;
        updateData.stock = (Number(sizesObj.S) || 0) + (Number(sizesObj.M) || 0) + (Number(sizesObj.L) || 0) + (Number(sizesObj.XL) || 0);
      } catch (e) {
        console.error('Error parsing sizes:', e);
      }
    }

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, store_id: store._id },
      updateData,
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
