const express = require('express');
const { getStoreOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect, authorize('store'));

router.get('/store', getStoreOrders);
router.patch('/:id/status', updateOrderStatus);

module.exports = router;
