const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// POST /api/v1/products/:id/reviews
exports.createReview = async (req, res) => {
  try {
    const { rating, comment, order_id } = req.body;
    const productId = req.params.id;

    // Cek: 1 user hanya boleh 1 ulasan per produk (berapapun ordernya)
    const existingReview = await Review.findOne({ product_id: productId, user_id: req.user._id });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'Anda sudah pernah memberikan ulasan untuk produk ini.', data: null });
    }

    // Save uploaded image path (relative) if provided
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const review = await Review.create({
      product_id: productId,
      user_id: req.user._id,
      user_name: req.user.name,
      rating,
      comment,
      order_id,
      image_url
    });

    // Recalculate average rating for the product
    const reviews = await Review.find({ product_id: productId });
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      rating: avgRating,
      reviews_count: reviews.length
    });

    res.status(201).json({ success: true, message: 'Ulasan berhasil ditambahkan', data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// GET /api/v1/products/:id/reviews
exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product_id: req.params.id }).sort('-created_at');
    res.status(200).json({ success: true, message: 'Reviews fetched', data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// GET /api/v1/reviews
exports.getAllReviews = async (req, res) => {
  try {
    // Only get reviews with rating >= 4 to show on homepage
    const reviews = await Review.find({ rating: { $gte: 4 } })
      .sort('-created_at')
      .limit(10);
    res.status(200).json({ success: true, message: 'Latest reviews fetched', data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

