const express = require('express');
const { getAllProducts, getProductById, getStoreProducts, createProduct, updateProduct, deleteProduct, toggleProductStatus } = require('../controllers/productController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

// Public routes
router.get('/', getAllProducts);

// Must be defined before /:id to prevent "store" from being parsed as an ObjectId
router.get('/store', protect, authorize('store'), getStoreProducts);

router.get('/:id', getProductById);

// Only stores can access these routes
router.use(protect, authorize('store'));

router.post('/', upload.single('image'), createProduct);
router.patch('/:id', upload.single('image'), updateProduct);
router.delete('/:id', deleteProduct);
router.patch('/:id/status', toggleProductStatus);

module.exports = router;
