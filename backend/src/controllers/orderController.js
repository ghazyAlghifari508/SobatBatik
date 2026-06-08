const Order = require('../models/Order');
const Store = require('../models/Store');
const Product = require('../models/Product');

// GET /api/v1/orders/store
// Ambil order yang mengandung product dari toko ini
exports.getStoreOrders = async (req, res) => {
  try {
    const store = await Store.findOne({ owner_id: req.user._id });
    if (!store) return res.status(404).json({ success: false, message: 'Store not found', data: null });

    // Find orders that contain an item from this store
    const orders = await Order.find({ 'items.store_id': store._id }).sort({ created_at: -1 });
    
    // Filter items so store only sees their own items
    const filteredOrders = orders.map(order => {
      const orderObj = order.toObject();
      orderObj.items = orderObj.items.filter(i => i.store_id.toString() === store._id.toString());
      return orderObj;
    });

    res.json({ success: true, message: 'Orders fetched', data: filteredOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// POST /api/v1/orders
exports.createOrder = async (req, res) => {
  try {
    const { items, shipping_address, total_price } = req.body;
    
    // Check and deduct stock
    for (const item of items) {
      // CartItem has _id as product id
      const productId = item._id || item.product_id;
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(400).json({ success: false, message: `Product ${item.name} not found`, data: null });
      }

      // Check stock
      if (item.selectedSize && product.sizes && product.sizes[item.selectedSize] !== undefined) {
        if (product.sizes[item.selectedSize] < item.quantity) {
          return res.status(400).json({ success: false, message: `Stock insufficient for ${item.name} Size ${item.selectedSize}`, data: null });
        }
        product.sizes[item.selectedSize] -= item.quantity;
        product.markModified('sizes');
        // Recalculate total stock
        product.stock = product.sizes.S + product.sizes.M + product.sizes.L + product.sizes.XL;
      } else {
        if (product.stock < item.quantity) {
          return res.status(400).json({ success: false, message: `Stock insufficient for ${item.name}`, data: null });
        }
        product.stock -= item.quantity;
      }
      
      // Save product (using markModified if needed, Mongoose handles nested object updates if we assign directly, but sizes is defined in schema so it's fine)
      await product.save();
    }

    const order = await Order.create({
      user_id: req.user._id,
      user_name: req.user.name,
      shipping_address,
      total_price,
      status: 'Menunggu',
      items: items.map(i => ({
        product_id: i._id || i.product_id,
        store_id: i.store_id,
        store_name: i.store_name,
        product_name: i.name,
        quantity: i.quantity,
        price_at_purchase: i.price,
        image_url: i.image_urls?.[0],
        size: i.selectedSize || i.size // frontend sends selectedSize
      }))
    });

    res.status(201).json({ success: true, message: 'Order created', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// GET /api/v1/orders/my
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.user._id }).sort({ created_at: -1 });
    res.json({ success: true, message: 'Orders fetched', data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// PATCH /api/v1/orders/:id/pay
exports.simulatePayment = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user_id: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found', data: null });
    
    if (order.status !== 'Menunggu') {
      return res.status(400).json({ success: false, message: 'Order cannot be paid', data: null });
    }

    order.status = 'Dikemas';
    await order.save();

    res.json({ success: true, message: 'Payment simulated successfully', data: order });
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
