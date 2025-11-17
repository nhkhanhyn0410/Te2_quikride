const express = require('express');
const router = express.Router();
const TripManagerController = require('../controllers/tripManager.controller');
const TicketController = require('../controllers/ticket.controller');
const { body, param } = require('express-validator');
const { protectTripManager, authorizeTripManager } = require('../middleware/tripManagerAuth.middleware');

/**
 * Trip Manager Routes
 * Base path: /api/trip-manager or /api/v1/trip-manager
 * For trip managers and drivers to manage trips and verify tickets
 */

// Validation middleware
const validateLogin = [
  body('username')
    .notEmpty()
    .withMessage('Tên đăng nhập là bắt buộc')
    .trim(),
  body('password')
    .notEmpty()
    .withMessage('Mật khẩu là bắt buộc')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
];

const validateTripId = [
  param('tripId').isMongoId().withMessage('Trip ID không hợp lệ'),
];

const validateVerifyQR = [
  body('qrCodeData').notEmpty().withMessage('Dữ liệu QR code là bắt buộc'),
];

/**
 * Public routes (no authentication)
 */

// UC-18: Trip Manager Login
// POST /api/trip-manager/login
router.post('/login', validateLogin, TripManagerController.login);

/**
 * Protected routes (authentication required)
 */

// Get current trip manager info
// GET /api/trip-manager/me
router.get('/me', protectTripManager, TripManagerController.getMe);

// Get assigned trips
// GET /api/trip-manager/trips
router.get('/trips', protectTripManager, TripManagerController.getAssignedTrips);

// Get trip details with passengers
// GET /api/trip-manager/trips/:tripId
router.get(
  '/trips/:tripId',
  protectTripManager,
  validateTripId,
  TripManagerController.getTripDetails
);

// Start trip
// POST /api/trip-manager/trips/:tripId/start
router.post(
  '/trips/:tripId/start',
  protectTripManager,
  authorizeTripManager('trip_manager', 'driver'),
  validateTripId,
  TripManagerController.startTrip
);

// Complete trip
// POST /api/trip-manager/trips/:tripId/complete
router.post(
  '/trips/:tripId/complete',
  protectTripManager,
  authorizeTripManager('trip_manager', 'driver'),
  validateTripId,
  TripManagerController.completeTrip
);

/**
 * Ticket Verification Routes
 * These routes are for trip managers to verify tickets on their trips
 */

// UC-20: Get trip passengers
// GET /api/trip-manager/trips/:tripId/passengers
router.get(
  '/trips/:tripId/passengers',
  protectTripManager,
  validateTripId,
  TicketController.getTripPassengers
);

// UC-19: Verify ticket QR code
// POST /api/trip-manager/trips/:tripId/verify-ticket
router.post(
  '/trips/:tripId/verify-ticket',
  protectTripManager,
  authorizeTripManager('trip_manager', 'driver'),
  validateTripId,
  validateVerifyQR,
  TicketController.verifyTicketQR
);

module.exports = router;
