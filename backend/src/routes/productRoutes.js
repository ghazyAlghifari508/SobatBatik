const express = require('express');
const { getStoreProducts, createProduct, updateProduct, deleteProduct, toggleProductStatus } = require('../controllers/productController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// Only stores can access these routes
router.use(protect, authorize('store'));

router.get('/store', getStoreProducts);
router.post('/', createProduct);
router.patch('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.patch('/:id/status', toggleProductStatus);

module.exports = router;
