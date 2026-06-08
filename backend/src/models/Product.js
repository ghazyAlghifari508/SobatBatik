const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  store_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  store_name: { type: String, required: true }, // Denormalized for faster reads
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  sizes: {
    S: { type: Number, default: 0, min: 0 },
    M: { type: Number, default: 0, min: 0 },
    L: { type: Number, default: 0, min: 0 },
    XL: { type: Number, default: 0, min: 0 }
  },
  stock: { type: Number, required: true, min: 0 }, // Will be sum of sizes
  rating: { type: Number, default: 0 },
  reviews_count: { type: Number, default: 0 },
  category: { type: String, required: true },
  origin_region: { type: String, required: true },
  image_urls: [{ type: String }],
  is_active: { type: Boolean, default: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// Indexes for search/filter performance
productSchema.index({ is_active: 1, stock: 1, created_at: -1 });
productSchema.index({ is_active: 1, stock: 1, price: 1 });
productSchema.index({ is_active: 1, stock: 1, rating: -1 });
productSchema.index({ category: 1 });
productSchema.index({ origin_region: 1 });
productSchema.index({ name: 'text', description: 'text', store_name: 'text', origin_region: 'text' });

module.exports = mongoose.model('Product', productSchema);
