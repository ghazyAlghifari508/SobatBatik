const Order = require('../models/Order');
const Store = require('../models/Store');

// GET /api/v1/orders/store
// Ambil order yang mengandung product dari toko ini
exports.getStoreOrders = async (req, res) => {
  try {
    const store = await Store.findOne({ owner_id: req.user._id });
    if (!store) return res.status(404).json({ success: false, message: 'Store not found', data: null });

    // Find orders that contain an item from this store
    const orders = await Order.find({ 'items.store_id': store._id }).sort({ created_at: -1 });
    
    res.json({ success: true, message: 'Orders fetched', data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// PATCH /api/v1/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const store = await Store.findOne({ owner_id: req.user._id });
    if (!store) return res.status(404).json({ success: false, message: 'Store not found', data: null });

    const { status } = req.body;
    const order = await Order.findOne({ _id: req.params.id, 'items.store_id': store._id });
    
    if (!order) return res.status(404).json({ success: false, message: 'Order not found', data: null });

    order.status = status;
    await order.save();

    res.json({ success: true, message: 'Order status updated', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};
