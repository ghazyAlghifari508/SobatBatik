const express = require('express');
const { protect, authorize } = require('../middlewares/authMiddleware');
const {
  getMyApplicationStatus,
  getAllApplications,
  approveApplication,
  rejectApplication,
  deleteApplication
} = require('../controllers/storeAppController');

const router = express.Router();

// User: check own application status
router.get('/application/status', protect, getMyApplicationStatus);

// Admin: list all applications
router.get('/', protect, authorize('admin'), getAllApplications);

// Admin: approve
router.patch('/:id/approve', protect, authorize('admin'), approveApplication);

// Admin: reject
router.patch('/:id/reject', protect, authorize('admin'), rejectApplication);

// Admin: delete history
router.delete('/:id', protect, authorize('admin'), deleteApplication);

module.exports = router;
