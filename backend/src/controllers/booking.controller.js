const BookingService = require('../services/booking.service');
const SeatService = require('../services/seat.service');
const Booking = require('../models/Booking');

/**
 * Booking Controller
 * Handle booking-related HTTP requests
 */

/**
 * @route   POST /api/bookings/hold-seats
 * @desc    Hold seats temporarily (15 minutes)
 * @access  Public (Guest or Authenticated User)
 */
exports.holdSeats = async (req, res, next) => {
  try {
    const { tripId, seats, contactEmail, contactPhone, passengers, pickupPoint, dropoffPoint } = req.body;

    // Get userId from auth or create guest session ID
    const userId = req.user ? req.user._id.toString() : `guest-${contactEmail}`;

    const result = await BookingService.holdSeats(
      {
        tripId,
        seats,
        contactEmail,
        contactPhone,
        passengers,
        pickupPoint,
        dropoffPoint,
        userId: req.user ? req.user._id : null,
      },
      userId,
    );

    res.status(201).json({
      success: true,
      message: 'Ghế đã được giữ thành công',
      data: {
        booking: result.booking,
        expiresAt: result.expiresAt,
        timeRemaining: result.timeRemaining,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/bookings/:bookingId/extend
 * @desc    Extend seat hold time (add 15 more minutes)
 * @access  Public (Guest or Authenticated User)
 */
exports.extendSeatHold = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user ? req.user._id.toString() : `guest-${req.body.email}`;

    const result = await BookingService.extendSeatHold(bookingId, userId);

    res.status(200).json({
      success: true,
      message: 'Thời gian giữ ghế đã được gia hạn',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/bookings/:bookingId/release
 * @desc    Release seat hold (cancel pending booking)
 * @access  Public (Guest or Authenticated User)
 */
exports.releaseSeatHold = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user ? req.user._id.toString() : `guest-${req.body.email}`;

    await BookingService.releaseSeatHold(bookingId, userId);

    res.status(200).json({
      success: true,
      message: 'Đã hủy giữ ghế',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/bookings/:bookingId/confirm
 * @desc    Confirm booking after payment success
 * @access  Private (Payment gateway callback or authenticated user)
 */
exports.confirmBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { paymentId } = req.body;

    const booking = await BookingService.confirmBooking(bookingId, paymentId);

    res.status(200).json({
      success: true,
      message: 'Booking đã được xác nhận',
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/trips/:tripId/seat-status
 * @desc    Get real-time seat status for a trip
 * @access  Public
 */
exports.getTripSeatStatus = async (req, res, next) => {
  try {
    const { tripId } = req.params;

    const result = await BookingService.getTripSeatStatus(tripId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/bookings
 * @desc    Get user's bookings
 * @access  Private (Authenticated User)
 */
exports.getUserBookings = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { status } = req.query;

    const bookings = await BookingService.getUserBookings(userId, { status });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: { bookings },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/bookings/lookup
 * @desc    Lookup booking by code (for guest)
 * @access  Public
 */
exports.lookupBooking = async (req, res, next) => {
  try {
    const { bookingCode, email, phone } = req.body;

    const booking = await BookingService.getBookingByCode(bookingCode, email, phone);

    res.status(200).json({
      success: true,
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/bookings/:bookingId
 * @desc    Get booking details
 * @access  Private or Public (with verification)
 */
exports.getBookingDetails = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
      .populate('tripId')
      .populate('operatorId', 'companyName logo phone email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy booking',
      });
    }

    // If authenticated user, check ownership
    if (req.user && booking.userId && booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xem booking này',
      });
    }

    res.status(200).json({
      success: true,
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/bookings/:bookingId/cancel
 * @desc    Cancel booking
 * @access  Private (Authenticated User)
 */
exports.cancelBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;

    const booking = await BookingService.cancelBooking(bookingId, reason, req.user);

    res.status(200).json({
      success: true,
      message: 'Booking đã được hủy',
      data: {
        booking,
        refundAmount: booking.refundAmount,
        refundStatus: booking.refundStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/bookings/:bookingId/apply-voucher
 * @desc    Apply voucher to booking
 * @access  Public
 */
exports.applyVoucher = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { voucherCode } = req.body;

    const booking = await BookingService.applyVoucher(bookingId, voucherCode);

    res.status(200).json({
      success: true,
      message: 'Voucher đã được áp dụng',
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/trips/:tripId/available-seats
 * @desc    Get list of available seats for a trip
 * @access  Public
 */
exports.getAvailableSeats = async (req, res, next) => {
  try {
    const { tripId } = req.params;

    const availableSeats = await SeatService.getAvailableSeats(tripId);

    res.status(200).json({
      success: true,
      count: availableSeats.length,
      data: { availableSeats },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/bookings/batch-check-seats
 * @desc    Check availability of multiple seats
 * @access  Public
 */
exports.batchCheckSeats = async (req, res, next) => {
  try {
    const { tripId, seats } = req.body;

    const result = await SeatService.batchCheckSeats(tripId, seats);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
