const express = require('express');
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { uploadAvatar, handleUploadError } = require('../middleware/upload.middleware');
const {
  validateUpdateProfile,
  validateChangePassword,
} = require('../middleware/validate.middleware');

const router = express.Router();

/**
 * User Routes
 * Base path: /api/v1/users
 * All routes require authentication
 */

// Apply authentication to all routes
router.use(authenticate);

// Profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', validateUpdateProfile, userController.updateProfile);

// Avatar routes
router.post('/avatar', uploadAvatar, handleUploadError, userController.uploadAvatar);
router.delete('/avatar', userController.deleteAvatar);

// Password management
router.put('/change-password', validateChangePassword, userController.changePassword);

// Saved passengers routes
router.post('/saved-passengers', userController.addSavedPassenger);
router.delete('/saved-passengers/:passengerId', userController.removeSavedPassenger);

// Loyalty points routes
router.get('/points-history', userController.getPointsHistory);

module.exports = router;
