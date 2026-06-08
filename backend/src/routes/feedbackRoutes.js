const express = require('express');
const { protect, authorize } = require('../middlewares/authMiddleware');
const {
  submitFeedback,
  getAllFeedback,
  markAsRead,
  deleteFeedback
} = require('../controllers/feedbackController');

const router = express.Router();

// Public: submit feedback (no auth needed)
router.post('/', submitFeedback);

// Admin: list all feedback
router.get('/', protect, authorize('admin'), getAllFeedback);

// Admin: mark as read
router.patch('/:id/read', protect, authorize('admin'), markAsRead);

// Admin: delete feedback
router.delete('/:id', protect, authorize('admin'), deleteFeedback);

module.exports = router;
