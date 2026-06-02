const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  store_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  store_name: { type: String, required: true }, // Denormalized for easier rendering
  product_name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price_at_purchase: { type: Number, required: true, min: 0 }
});

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  user_name: { type: String, required: true },
  shipping_address: { type: String, required: true },
  total_price: { type: Number, required: true, min: 0 },
  status: { 
    type: String, 
    required: true, 
    enum: ['Menunggu', 'Dikemas', 'Dikirim', 'Selesai'],
    default: 'Menunggu'
  },
  items: [orderItemSchema]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Order', orderSchema);
