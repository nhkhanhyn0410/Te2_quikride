const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

/**
 * Public booking routes
 */

// Hold seats temporarily
router.post('/hold-seats', bookingController.holdSeats);

// Confirm booking
router.post('/:bookingId/confirm', bookingController.confirmBooking);

// Extend hold duration
router.post('/:bookingId/extend', bookingController.extendHold);

// Release hold
router.post('/:bookingId/release', bookingController.releaseHold);

// Get booking by code (for guests)
router.get('/code/:bookingCode', bookingController.getBookingByCode);

// Get available seats for a trip
router.get('/trips/:tripId/available-seats', bookingController.getAvailableSeats);

/**
 * Protected customer routes
 */

// Get my bookings (requires authentication)
router.get(
  '/my-bookings',
  authenticate,
  authorize('customer'),
  bookingController.getMyBookings
);

// Get booking details
router.get('/:bookingId', bookingController.getBookingById);

// Cancel booking
router.post(
  '/:bookingId/cancel',
  authenticate,
  bookingController.cancelBooking
);

module.exports = router;
