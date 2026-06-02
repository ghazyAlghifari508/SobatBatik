const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  store_name: { type: String, required: true },
  description: { type: String },
  address: { type: String, required: true },
  is_active: { type: Boolean, default: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

module.exports = mongoose.model('Store', storeSchema);
