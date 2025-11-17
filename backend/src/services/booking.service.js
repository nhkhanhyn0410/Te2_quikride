const Booking = require('../models/Booking');
const Trip = require('../models/Trip');
const SeatService = require('./seat.service');

/**
 * Booking Service
 * Business logic cho booking operations
 */
class BookingService {
  /**
   * Hold seats - Lock ghế tạm thời (15 phút)
   * @param {Object} data - Booking data
   * @param {String} userId - User ID (or session ID for guest)
   * @returns {Promise<Object>} - { booking, expiresAt }
   */
  static async holdSeats(data, userId) {
    const { tripId, seats, contactEmail, contactPhone, passengers, pickupPoint, dropoffPoint } = data;

    try {
      // 1. Validate trip exists and is available
      const trip = await Trip.findById(tripId)
        .populate('routeId')
        .populate('busId')
        .populate('operatorId');

      if (!trip) {
        throw new Error('Không tìm thấy chuyến xe');
      }

      if (trip.status !== 'scheduled') {
        throw new Error('Chuyến xe không còn mở đặt vé');
      }

      if (new Date(trip.departureTime) <= new Date()) {
        throw new Error('Chuyến xe đã khởi hành hoặc sắp khởi hành');
      }

      // 2. Validate seats
      if (!seats || seats.length === 0) {
        throw new Error('Phải chọn ít nhất 1 ghế');
      }

      if (seats.length > 6) {
        throw new Error('Chỉ được chọn tối đa 6 ghế');
      }

      // 3. Validate passengers match seats
      if (passengers.length !== seats.length) {
        throw new Error('Số lượng hành khách phải bằng số ghế đã chọn');
      }

      // 4. Check seat availability and lock
      const seatCheck = await SeatService.batchCheckSeats(tripId, seats);

      if (seatCheck.booked.length > 0) {
        throw new Error(`Ghế đã được đặt: ${seatCheck.booked.join(', ')}`);
      }

      if (seatCheck.locked.length > 0) {
        throw new Error(`Ghế đang được người khác chọn: ${seatCheck.locked.join(', ')}`);
      }

      // Lock seats in Redis
      await SeatService.lockSeats(tripId, seats, userId);

      // 5. Create pending booking
      const booking = new Booking({
        userId: data.userId || null, // Null for guest
        tripId,
        operatorId: trip.operatorId._id,
        contactEmail,
        contactPhone,
        seats,
        passengers,
        pickupPoint,
        dropoffPoint,
        basePrice: trip.finalPrice,
        totalSeats: seats.length,
        subtotal: trip.finalPrice * seats.length,
        discount: 0, // Will apply voucher later
        total: trip.finalPrice * seats.length,
        status: 'pending',
      });

      await booking.save();

      return {
        booking,
        expiresAt: booking.seatHoldExpiry,
        timeRemaining: booking.timeRemaining,
      };
    } catch (error) {
      // If error, unlock seats
      if (tripId && seats && userId) {
        try {
          await SeatService.unlockSeats(tripId, seats, userId);
        } catch (unlockError) {
          console.error('Error unlocking seats after hold failure:', unlockError);
        }
      }

      throw error;
    }
  }

  /**
   * Extend seat hold time (thêm 15 phút)
   * @param {String} bookingId - Booking ID
   * @param {String} userId - User ID
   * @returns {Promise<Object>}
   */
  static async extendSeatHold(bookingId, userId) {
    try {
      const booking = await Booking.findById(bookingId);

      if (!booking) {
        throw new Error('Không tìm thấy booking');
      }

      if (booking.status !== 'pending') {
        throw new Error('Chỉ có thể gia hạn booking đang pending');
      }

      if (booking.isExpired) {
        throw new Error('Booking đã hết hạn');
      }

      // Extend lock in Redis
      await SeatService.extendSeatLock(booking.tripId.toString(), booking.seats, userId);

      // Update booking expiry
      booking.seatHoldExpiry = new Date(Date.now() + 15 * 60 * 1000);
      await booking.save();

      return {
        booking,
        expiresAt: booking.seatHoldExpiry,
        timeRemaining: booking.timeRemaining,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Release seat hold (hủy booking pending)
   * @param {String} bookingId - Booking ID
   * @param {String} userId - User ID
   * @returns {Promise<void>}
   */
  static async releaseSeatHold(bookingId, userId) {
    try {
      const booking = await Booking.findById(bookingId);

      if (!booking) {
        throw new Error('Không tìm thấy booking');
      }

      if (booking.status !== 'pending') {
        throw new Error('Chỉ có thể hủy booking đang pending');
      }

      // Unlock seats in Redis
      await SeatService.unlockSeats(booking.tripId.toString(), booking.seats, userId);

      // Delete pending booking
      await booking.deleteOne();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Confirm booking after payment success
   * @param {String} bookingId - Booking ID
   * @param {String} paymentId - Payment ID
   * @returns {Promise<Booking>}
   */
  static async confirmBooking(bookingId, paymentId) {
    try {
      const booking = await Booking.findById(bookingId).populate('tripId');

      if (!booking) {
        throw new Error('Không tìm thấy booking');
      }

      if (booking.status !== 'pending') {
        throw new Error('Booking đã được xác nhận hoặc đã hủy');
      }

      if (booking.isExpired) {
        throw new Error('Booking đã hết hạn');
      }

      // Confirm booking
      booking.status = 'confirmed';
      booking.paymentId = paymentId;

      // Calculate loyalty points (1 point per 10,000 VND)
      if (booking.userId) {
        booking.pointsEarned = Math.floor(booking.total / 10000);
      }

      await booking.save();

      // Confirm seats in Redis (remove locks)
      const userId = booking.userId ? booking.userId.toString() : `guest-${booking.contactEmail}`;
      await SeatService.confirmSeats(booking.tripId._id.toString(), booking.seats, userId);

      return booking;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get seat status for a trip (real-time)
   * @param {String} tripId - Trip ID
   * @returns {Promise<Object>}
   */
  static async getTripSeatStatus(tripId) {
    try {
      const seatStatus = await SeatService.getTripSeatStatus(tripId);
      const availableCount = await SeatService.getTripAvailableSeatCount(tripId);

      return {
        seatStatus,
        availableCount,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user's bookings
   * @param {String} userId - User ID
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>}
   */
  static async getUserBookings(userId, filters = {}) {
    try {
      return await Booking.findByUser(userId, filters);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get booking by code (for guest lookup)
   * @param {String} bookingCode - Booking code
   * @param {String} email - Contact email
   * @param {String} phone - Contact phone
   * @returns {Promise<Booking>}
   */
  static async getBookingByCode(bookingCode, email, phone) {
    try {
      const booking = await Booking.findByCodeAndContact(bookingCode, email, phone);

      if (!booking) {
        throw new Error('Không tìm thấy booking với thông tin đã cung cấp');
      }

      return booking;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cancel booking
   * @param {String} bookingId - Booking ID
   * @param {String} reason - Cancellation reason
   * @param {Object} cancelledBy - User or Operator
   * @returns {Promise<Booking>}
   */
  static async cancelBooking(bookingId, reason, cancelledBy) {
    try {
      const booking = await Booking.findById(bookingId);

      if (!booking) {
        throw new Error('Không tìm thấy booking');
      }

      await booking.cancelBooking(reason, cancelledBy);

      return booking;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Apply voucher to booking
   * @param {String} bookingId - Booking ID
   * @param {String} voucherCode - Voucher code
   * @returns {Promise<Booking>}
   */
  static async applyVoucher(bookingId, voucherCode) {
    try {
      // TODO: Implement voucher validation and application
      // For now, just return the booking
      const booking = await Booking.findById(bookingId);

      if (!booking) {
        throw new Error('Không tìm thấy booking');
      }

      if (booking.status !== 'pending') {
        throw new Error('Chỉ có thể áp dụng voucher cho booking đang pending');
      }

      // Placeholder for voucher logic
      // Will implement in Phase 5

      return booking;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = BookingService;
