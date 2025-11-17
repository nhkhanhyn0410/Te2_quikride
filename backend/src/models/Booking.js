const mongoose = require('mongoose');

/**
 * Booking Schema
 * Quản lý đặt vé
 */
const BookingSchema = new mongoose.Schema(
  {
    // References
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // Optional - null for guest bookings
      index: true,
    },

    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: [true, 'Trip là bắt buộc'],
      index: true,
    },

    operatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BusOperator',
      required: [true, 'Operator là bắt buộc'],
      index: true,
    },

    // Booking Code
    bookingCode: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
      index: true,
    },

    // Contact Info (for guests and confirmation)
    contactEmail: {
      type: String,
      required: [true, 'Email liên hệ là bắt buộc'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ'],
    },

    contactPhone: {
      type: String,
      required: [true, 'Số điện thoại liên hệ là bắt buộc'],
      trim: true,
      match: [/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'],
    },

    // Seats
    seats: {
      type: [String],
      required: [true, 'Phải chọn ít nhất 1 ghế'],
      validate: {
        validator: function (seats) {
          return seats.length > 0 && seats.length <= 6;
        },
        message: 'Phải chọn từ 1-6 ghế',
      },
    },

    // Passengers (Embedded)
    passengers: [
      {
        seatNumber: {
          type: String,
          required: true,
        },
        fullName: {
          type: String,
          required: [true, 'Tên hành khách là bắt buộc'],
          trim: true,
        },
        phone: {
          type: String,
          required: [true, 'Số điện thoại hành khách là bắt buộc'],
          match: [/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'],
        },
        idCard: {
          type: String,
          trim: true,
          match: [/^[0-9]{9,12}$/, 'Số CMND/CCCD không hợp lệ'],
        },
      },
    ],

    // Pickup & Dropoff Points
    pickupPoint: {
      name: {
        type: String,
        required: true,
      },
      address: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },

    dropoffPoint: {
      name: {
        type: String,
        required: true,
      },
      address: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },

    // Pricing
    basePrice: {
      type: Number,
      required: true,
      min: [0, 'Giá không thể âm'],
    },

    totalSeats: {
      type: Number,
      required: true,
      min: [1, 'Phải có ít nhất 1 ghế'],
    },

    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Tổng tiền không thể âm'],
    },

    discount: {
      type: Number,
      default: 0,
      min: [0, 'Giảm giá không thể âm'],
    },

    total: {
      type: Number,
      required: true,
      min: [0, 'Tổng tiền không thể âm'],
    },

    // Voucher
    voucherCode: {
      type: String,
      uppercase: true,
    },

    voucherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Voucher',
    },

    // Status
    status: {
      type: String,
      enum: {
        values: ['pending', 'confirmed', 'cancelled', 'completed'],
        message: 'Trạng thái không hợp lệ',
      },
      default: 'pending',
      index: true,
    },

    // Seat Hold (for pending bookings)
    // Ghế sẽ bị lock trong 15 phút
    seatHoldExpiry: {
      type: Date,
      required: function () {
        return this.status === 'pending';
      },
      index: true,
    },

    // Cancellation
    cancelledAt: Date,

    cancelReason: {
      type: String,
      maxlength: [500, 'Lý do hủy không quá 500 ký tự'],
    },

    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'cancelledByModel',
    },

    cancelledByModel: {
      type: String,
      enum: ['User', 'BusOperator'],
    },

    refundAmount: {
      type: Number,
      default: 0,
      min: [0, 'Số tiền hoàn không thể âm'],
    },

    refundStatus: {
      type: String,
      enum: ['none', 'pending', 'completed', 'failed'],
      default: 'none',
    },

    // Loyalty Points
    pointsEarned: {
      type: Number,
      default: 0,
      min: [0, 'Điểm thưởng không thể âm'],
    },

    // Payment Reference
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },

    // Notes
    notes: {
      type: String,
      maxlength: [1000, 'Ghi chú không quá 1000 ký tự'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

/**
 * Indexes
 */
// Unique booking code
BookingSchema.index({ bookingCode: 1 }, { unique: true });

// User bookings with status
BookingSchema.index({ userId: 1, status: 1 });

// Trip bookings
BookingSchema.index({ tripId: 1, status: 1 });

// Guest lookup by contact info
BookingSchema.index({ contactEmail: 1, contactPhone: 1 });

// Recent bookings
BookingSchema.index({ createdAt: -1 });

// TTL index for expired seat holds
// Automatically delete pending bookings after seatHoldExpiry
BookingSchema.index(
  { seatHoldExpiry: 1 },
  {
    expireAfterSeconds: 0,
    partialFilterExpression: { status: 'pending' },
  },
);

/**
 * Pre-save Middleware
 */
BookingSchema.pre('save', async function (next) {
  try {
    // Generate booking code if new
    if (this.isNew && !this.bookingCode) {
      this.bookingCode = await this.constructor.generateBookingCode();
    }

    // Calculate subtotal and total
    if (this.isModified('basePrice') || this.isModified('totalSeats') || this.isModified('discount')) {
      this.subtotal = this.basePrice * this.totalSeats;
      this.total = this.subtotal - this.discount;
    }

    // Set seat hold expiry for pending bookings (15 minutes)
    if (this.isNew && this.status === 'pending') {
      this.seatHoldExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    }

    // Clear seat hold expiry when confirmed
    if (this.isModified('status') && this.status === 'confirmed') {
      this.seatHoldExpiry = undefined;
    }

    // Set cancellation timestamp
    if (this.isModified('status') && this.status === 'cancelled' && !this.cancelledAt) {
      this.cancelledAt = new Date();
    }

    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Post-save Middleware
 * Update trip's booked seats when booking status changes
 */
BookingSchema.post('save', async function (doc) {
  try {
    const Trip = mongoose.model('Trip');
    const trip = await Trip.findById(doc.tripId);

    if (!trip) return;

    // When booking is confirmed, add seats to trip's bookedSeats
    if (doc.status === 'confirmed') {
      const newSeats = doc.seats.filter((seat) => !trip.bookedSeats.includes(seat));
      if (newSeats.length > 0) {
        trip.bookedSeats.push(...newSeats);
        await trip.save();
      }
    }

    // When booking is cancelled, remove seats from trip's bookedSeats
    if (doc.status === 'cancelled') {
      trip.bookedSeats = trip.bookedSeats.filter((seat) => !doc.seats.includes(seat));
      await trip.save();
    }
  } catch (error) {
    console.error('Error updating trip booked seats:', error);
  }
});

/**
 * Virtual: Is expired
 */
BookingSchema.virtual('isExpired').get(function () {
  return this.status === 'pending' && this.seatHoldExpiry && new Date() > this.seatHoldExpiry;
});

/**
 * Virtual: Time remaining (in minutes)
 */
BookingSchema.virtual('timeRemaining').get(function () {
  if (this.status === 'pending' && this.seatHoldExpiry) {
    const diff = this.seatHoldExpiry - new Date();
    return Math.max(0, Math.round(diff / (1000 * 60)));
  }
  return 0;
});

/**
 * Virtual: Can be cancelled
 */
BookingSchema.virtual('canBeCancelled').get(function () {
  return this.status === 'confirmed' || this.status === 'pending';
});

/**
 * Instance Methods
 */

/**
 * Confirm booking after successful payment
 * @returns {Promise<Booking>}
 */
BookingSchema.methods.confirmBooking = async function () {
  if (this.status !== 'pending') {
    throw new Error('Chỉ có thể xác nhận booking đang pending');
  }

  if (this.isExpired) {
    throw new Error('Booking đã hết hạn');
  }

  this.status = 'confirmed';
  return await this.save();
};

/**
 * Cancel booking with refund calculation
 * @param {String} reason - Cancellation reason
 * @param {Object} cancelledBy - User or Operator who cancelled
 * @returns {Promise<Booking>}
 */
BookingSchema.methods.cancelBooking = async function (reason, cancelledBy) {
  if (!this.canBeCancelled) {
    throw new Error('Không thể hủy booking này');
  }

  const Trip = mongoose.model('Trip');
  const trip = await Trip.findById(this.tripId);

  if (!trip) {
    throw new Error('Không tìm thấy chuyến xe');
  }

  // Calculate refund based on cancellation policy
  const hoursUntilDeparture = (trip.departureTime - new Date()) / (1000 * 60 * 60);
  let refundPercentage = 0;

  if (hoursUntilDeparture >= 24) {
    refundPercentage = 0.9; // 90% refund
  } else if (hoursUntilDeparture >= 12) {
    refundPercentage = 0.7; // 70% refund
  } else if (hoursUntilDeparture >= 6) {
    refundPercentage = 0.5; // 50% refund
  } else {
    refundPercentage = 0; // No refund
  }

  this.status = 'cancelled';
  this.cancelReason = reason;
  this.cancelledBy = cancelledBy._id;
  this.cancelledByModel = cancelledBy.constructor.modelName;
  this.refundAmount = Math.round(this.total * refundPercentage);
  this.refundStatus = this.refundAmount > 0 ? 'pending' : 'none';

  return await this.save();
};

/**
 * Static Methods
 */

/**
 * Generate unique booking code
 * Format: QR-YYYYMMDD-XXXX (e.g., QR-20240115-A1B2)
 * @returns {Promise<String>}
 */
BookingSchema.statics.generateBookingCode = async function () {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');

  // Generate random 4-character code
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  const bookingCode = `QR-${dateStr}-${code}`;

  // Check if exists
  const exists = await this.findOne({ bookingCode });
  if (exists) {
    // Recursively try again
    return await this.generateBookingCode();
  }

  return bookingCode;
};

/**
 * Find bookings by user with filters
 * @param {ObjectId} userId
 * @param {Object} filters
 * @returns {Promise<Array>}
 */
BookingSchema.statics.findByUser = function (userId, filters = {}) {
  const query = { userId };

  if (filters.status) {
    query.status = filters.status;
  }

  return this.find(query)
    .populate('tripId')
    .populate('operatorId', 'companyName logo')
    .sort({ createdAt: -1 });
};

/**
 * Find booking by code (for guest lookup)
 * @param {String} bookingCode
 * @param {String} email
 * @param {String} phone
 * @returns {Promise<Booking>}
 */
BookingSchema.statics.findByCodeAndContact = function (bookingCode, email, phone) {
  return this.findOne({
    bookingCode: bookingCode.toUpperCase(),
    contactEmail: email.toLowerCase(),
    contactPhone: phone,
  })
    .populate('tripId')
    .populate('operatorId', 'companyName logo phone email');
};

/**
 * Clean up expired pending bookings
 * (Backup to TTL index)
 * @returns {Promise<Number>}
 */
BookingSchema.statics.cleanupExpiredBookings = async function () {
  const result = await this.deleteMany({
    status: 'pending',
    seatHoldExpiry: { $lt: new Date() },
  });

  return result.deletedCount;
};

module.exports = mongoose.model('Booking', BookingSchema);
