const express = require('express');
const { createReview, getProductReviews, getAllReviews } = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.get('/reviews/all', getAllReviews); // Must be before /:id/reviews
router.post('/:id/reviews', protect, upload.single('image'), createReview);
router.get('/:id/reviews', getProductReviews);

module.exports = router;
