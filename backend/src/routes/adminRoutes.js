const express = require('express');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { getDashboardStats } = require('../controllers/adminController');

const router = express.Router();

// Admin: get dashboard stats
router.get('/dashboard', protect, authorize('admin'), getDashboardStats);

module.exports = router;
