const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

/**
 * Admin Routes
 * /api/v1/admin
 */

// All routes require admin authentication
router.use(authenticate);
router.use(authorize('admin'));

// Operator management routes
router.get('/operators', adminController.getAllOperators);
router.get('/operators/:id', adminController.getOperatorById);
router.put('/operators/:id/approve', adminController.approveOperator);
router.put('/operators/:id/reject', adminController.rejectOperator);
router.put('/operators/:id/suspend', adminController.suspendOperator);
router.put('/operators/:id/resume', adminController.resumeOperator);

// User management routes (UC-22)
router.get('/users/statistics', adminController.getUserStatistics);
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id/block', adminController.blockUser);
router.put('/users/:id/unblock', adminController.unblockUser);
router.post('/users/:id/reset-password', adminController.resetUserPassword);

module.exports = router;
