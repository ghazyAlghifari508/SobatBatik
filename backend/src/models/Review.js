const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  user_name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  image_url: { type: String, default: null } // optional proof photo
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// 1 user hanya boleh 1 ulasan per produk — enforce di DB level
reviewSchema.index({ product_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
