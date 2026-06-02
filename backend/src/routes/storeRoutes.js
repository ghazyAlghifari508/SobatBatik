const express = require('express');
const { getDashboardStats } = require('../controllers/storeController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect, authorize('store'));

router.get('/dashboard', getDashboardStats);

module.exports = router;
