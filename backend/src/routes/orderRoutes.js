const express = require('express');
const { getStoreOrders, updateOrderStatus, createOrder, getMyOrders, simulatePayment } = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', createOrder);
router.get('/my', getMyOrders);
router.patch('/:id/pay', simulatePayment);

router.get('/store', authorize('store'), getStoreOrders);
router.patch('/:id/status', authorize('store'), updateOrderStatus);

module.exports = router;
