const express = require('express');
const router = express.Router();
const operatorController = require('../controllers/operator.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

/**
 * Operator Routes
 * /api/v1/operators
 */

// Public routes
router.post('/register', operatorController.register);
router.post('/login', operatorController.login);
router.get('/', operatorController.getAll);
router.get('/:id', operatorController.getById);

// Protected routes (Operator only)
router.get('/me/profile', authenticate, authorize('operator'), operatorController.getMe);
router.put('/me/profile', authenticate, authorize('operator'), operatorController.updateMe);

module.exports = router;
