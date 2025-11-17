const express = require('express');
const router = express.Router();
const operatorController = require('../controllers/operator.controller');
const routeController = require('../controllers/route.controller');
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

// Route management (Operator only)
router.post('/routes', authenticate, authorize('operator'), routeController.create);
router.get('/routes', authenticate, authorize('operator'), routeController.getMyRoutes);
router.get('/routes/:id', authenticate, authorize('operator'), routeController.getById);
router.put('/routes/:id', authenticate, authorize('operator'), routeController.update);
router.delete('/routes/:id', authenticate, authorize('operator'), routeController.delete);
router.put('/routes/:id/toggle-active', authenticate, authorize('operator'), routeController.toggleActive);

// Pickup/Dropoff points management
router.post('/routes/:id/pickup-points', authenticate, authorize('operator'), routeController.addPickupPoint);
router.delete('/routes/:id/pickup-points/:pointId', authenticate, authorize('operator'), routeController.removePickupPoint);
router.post('/routes/:id/dropoff-points', authenticate, authorize('operator'), routeController.addDropoffPoint);
router.delete('/routes/:id/dropoff-points/:pointId', authenticate, authorize('operator'), routeController.removeDropoffPoint);

module.exports = router;
