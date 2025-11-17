const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { protect, optionalAuth } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { body, param, query } = require('express-validator');

/**
 * Validation Rules
 */

// Hold seats validation
const holdSeatsValidation = [
  body('tripId').notEmpty().withMessage('Trip ID là bắt buộc').isMongoId().withMessage('Trip ID không hợp lệ'),

  body('seats').isArray({ min: 1, max: 6 }).withMessage('Phải chọn từ 1-6 ghế'),

  body('seats.*').notEmpty().withMessage('Số ghế không được rỗng').isString(),

  body('contactEmail')
    .notEmpty()
    .withMessage('Email liên hệ là bắt buộc')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),

  body('contactPhone')
    .notEmpty()
    .withMessage('Số điện thoại là bắt buộc')
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Số điện thoại không hợp lệ'),

  body('passengers')
    .isArray({ min: 1 })
    .withMessage('Thông tin hành khách là bắt buộc')
    .custom((passengers, { req }) => {
      if (passengers.length !== req.body.seats.length) {
        throw new Error('Số lượng hành khách phải bằng số ghế đã chọn');
      }
      return true;
    }),

  body('passengers.*.seatNumber').notEmpty().withMessage('Số ghế của hành khách là bắt buộc'),

  body('passengers.*.fullName')
    .notEmpty()
    .withMessage('Tên hành khách là bắt buộc')
    .isLength({ min: 2, max: 100 })
    .withMessage('Tên hành khách phải từ 2-100 ký tự'),

  body('passengers.*.phone')
    .notEmpty()
    .withMessage('Số điện thoại hành khách là bắt buộc')
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Số điện thoại không hợp lệ'),

  body('passengers.*.idCard')
    .optional()
    .matches(/^[0-9]{9,12}$/)
    .withMessage('Số CMND/CCCD không hợp lệ'),

  body('pickupPoint').notEmpty().withMessage('Điểm đón là bắt buộc'),

  body('pickupPoint.name').notEmpty().withMessage('Tên điểm đón là bắt buộc'),

  body('dropoffPoint').notEmpty().withMessage('Điểm trả là bắt buộc'),

  body('dropoffPoint.name').notEmpty().withMessage('Tên điểm trả là bắt buộc'),
];

// Booking lookup validation
const lookupBookingValidation = [
  body('bookingCode').notEmpty().withMessage('Mã booking là bắt buộc').isString().toUpperCase(),

  body('email').notEmpty().withMessage('Email là bắt buộc').isEmail().withMessage('Email không hợp lệ').normalizeEmail(),

  body('phone')
    .notEmpty()
    .withMessage('Số điện thoại là bắt buộc')
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Số điện thoại không hợp lệ'),
];

// Cancel booking validation
const cancelBookingValidation = [
  param('bookingId').notEmpty().withMessage('Booking ID là bắt buộc').isMongoId().withMessage('Booking ID không hợp lệ'),

  body('reason').optional().isLength({ max: 500 }).withMessage('Lý do hủy không quá 500 ký tự'),
];

// Apply voucher validation
const applyVoucherValidation = [
  param('bookingId').notEmpty().withMessage('Booking ID là bắt buộc').isMongoId().withMessage('Booking ID không hợp lệ'),

  body('voucherCode').notEmpty().withMessage('Mã voucher là bắt buộc').isString().toUpperCase(),
];

// Batch check seats validation
const batchCheckSeatsValidation = [
  body('tripId').notEmpty().withMessage('Trip ID là bắt buộc').isMongoId().withMessage('Trip ID không hợp lệ'),

  body('seats').isArray({ min: 1 }).withMessage('Danh sách ghế không được rỗng'),

  body('seats.*').notEmpty().withMessage('Số ghế không được rỗng').isString(),
];

/**
 * Routes
 */

// POST /api/bookings/hold-seats - Hold seats temporarily
router.post('/hold-seats', optionalAuth, validate(holdSeatsValidation), bookingController.holdSeats);

// POST /api/bookings/:bookingId/extend - Extend seat hold
router.post('/:bookingId/extend', optionalAuth, bookingController.extendSeatHold);

// DELETE /api/bookings/:bookingId/release - Release seat hold
router.delete('/:bookingId/release', optionalAuth, bookingController.releaseSeatHold);

// POST /api/bookings/:bookingId/confirm - Confirm booking after payment
router.post('/:bookingId/confirm', bookingController.confirmBooking);

// POST /api/bookings/lookup - Lookup booking by code (guest)
router.post('/lookup', validate(lookupBookingValidation), bookingController.lookupBooking);

// GET /api/bookings - Get user's bookings
router.get('/', protect, bookingController.getUserBookings);

// GET /api/bookings/:bookingId - Get booking details
router.get('/:bookingId', optionalAuth, bookingController.getBookingDetails);

// POST /api/bookings/:bookingId/cancel - Cancel booking
router.post('/:bookingId/cancel', protect, validate(cancelBookingValidation), bookingController.cancelBooking);

// POST /api/bookings/:bookingId/apply-voucher - Apply voucher
router.post('/:bookingId/apply-voucher', validate(applyVoucherValidation), bookingController.applyVoucher);

// POST /api/bookings/batch-check-seats - Batch check seat availability
router.post('/batch-check-seats', validate(batchCheckSeatsValidation), bookingController.batchCheckSeats);

// GET /api/trips/:tripId/seat-status - Get real-time seat status
router.get('/trips/:tripId/seat-status', bookingController.getTripSeatStatus);

// GET /api/trips/:tripId/available-seats - Get available seats
router.get('/trips/:tripId/available-seats', bookingController.getAvailableSeats);

module.exports = router;
