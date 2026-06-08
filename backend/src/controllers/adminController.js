const User = require('../models/User');
const Store = require('../models/Store');
const Order = require('../models/Order');

// GET /api/v1/admin/dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeStores = await Store.countDocuments({ is_active: true });
    const totalTransactions = await Order.countDocuments();

    const orders = await Order.find();
    const totalGMV = orders.reduce((sum, order) => sum + order.total_price, 0);

    // Compute last 6 months growth data
    const growthData = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
    
    // Simple logic for the current year
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth(); // 0-indexed

    for (let i = 5; i >= 0; i--) {
      let d = new Date(currentYear, currentMonth - i, 1);
      let nextMonth = new Date(currentYear, currentMonth - i + 1, 1);
      
      const usersCount = await User.countDocuments({
        created_at: { $gte: d, $lt: nextMonth }
      });
      const transactionsCount = await Order.countDocuments({
        created_at: { $gte: d, $lt: nextMonth }
      });

      growthData.push({
        month: months[d.getMonth()],
        users: usersCount,
        transactions: transactionsCount
      });
    }

    res.json({
      success: true,
      message: 'Dashboard stats retrieved',
      data: {
        totalUsers,
        activeStores,
        totalTransactions,
        totalGMV,
        growthData
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};
