const Store = require('../models/Store');
const Product = require('../models/Product');
const Order = require('../models/Order');

// GET /api/v1/store/dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const store = await Store.findOne({ owner_id: req.user._id });
    if (!store) return res.status(404).json({ success: false, message: 'Store not found', data: null });

    const products = await Product.find({ store_id: store._id });
    const orders = await Order.find({ 'items.store_id': store._id });

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => {
      const storeItems = order.items.filter(i => i.store_id.toString() === store._id.toString());
      return sum + storeItems.reduce((s, i) => s + (i.price_at_purchase * i.quantity), 0);
    }, 0);

    const activeProducts = products.filter(p => p.is_active).length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const activeOrders = orders.filter(o => o.status === 'Menunggu' || o.status === 'Dikemas').length;

    // Revenue data 7 days (Mock for now, using real totalRevenue)
    const revenueData = [
      { name: 'Senin', revenue: totalRevenue * 0.1 },
      { name: 'Selasa', revenue: totalRevenue * 0.15 },
      { name: 'Rabu', revenue: totalRevenue * 0.2 },
      { name: 'Kamis', revenue: totalRevenue * 0.1 },
      { name: 'Jumat', revenue: totalRevenue * 0.25 },
      { name: 'Sabtu', revenue: totalRevenue * 0.15 },
      { name: 'Minggu', revenue: totalRevenue * 0.05 },
    ];

    // Product sales mock based on real products
    const productData = products.map(p => ({
      name: p.name.substring(0, 15) + '...',
      sales: Math.floor(Math.random() * 50) + 10
    })).slice(0, 5);

    res.json({
      success: true,
      message: 'Dashboard stats fetched',
      data: {
        totalRevenue,
        activeOrders,
        activeProducts,
        totalStock,
        revenueData,
        productData
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};
