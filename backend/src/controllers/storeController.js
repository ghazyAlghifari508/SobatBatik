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

    // Revenue data 7 days (Actual based on created_at)
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      d.setHours(0, 0, 0, 0);
      return d;
    });

    const revenueData = last7Days.map(date => {
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);

      const dayOrders = orders.filter(o => {
        const orderDate = new Date(o.created_at);
        return orderDate >= date && orderDate < nextDate;
      });

      const dayRevenue = dayOrders.reduce((sum, order) => {
        const storeItems = order.items.filter(i => i.store_id.toString() === store._id.toString());
        return sum + storeItems.reduce((s, i) => s + (i.price_at_purchase * i.quantity), 0);
      }, 0);

      const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      return {
        name: daysOfWeek[date.getDay()],
        revenue: dayRevenue
      };
    });

    // Product sales aggregation
    const productSalesMap = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.store_id.toString() === store._id.toString()) {
          const pid = item.product_id.toString();
          if (!productSalesMap[pid]) {
            productSalesMap[pid] = {
              name: item.product_name,
              sales: 0
            };
          }
          productSalesMap[pid].sales += item.quantity;
        }
      });
    });

    // Also include products with 0 sales
    products.forEach(p => {
      const pid = p._id.toString();
      if (!productSalesMap[pid]) {
        productSalesMap[pid] = {
          name: p.name,
          sales: 0
        };
      }
    });

    const productData = Object.values(productSalesMap)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5)
      .map(p => ({
        name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
        sales: p.sales
      }));

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
