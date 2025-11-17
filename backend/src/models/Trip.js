const mongoose = require('mongoose');

/**
 * Trip Schema
 * Quản lý lịch trình chuyến xe
 */
const TripSchema = new mongoose.Schema(
  {
    // References
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      required: [true, 'Route là bắt buộc'],
      index: true,
    },

    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      required: [true, 'Bus là bắt buộc'],
      index: true,
    },

    operatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BusOperator',
      required: [true, 'Operator là bắt buộc'],
      index: true,
    },

    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Tài xế là bắt buộc'],
      validate: {
        validator: async function (v) {
          if (!v) return false;
          const Employee = mongoose.model('Employee');
          const driver = await Employee.findById(v);
          return driver && driver.role === 'driver' && driver.status === 'active';
        },
        message: 'Tài xế không hợp lệ hoặc không hoạt động',
      },
    },

    tripManagerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Quản lý chuyến là bắt buộc'],
      validate: {
        validator: async function (v) {
          if (!v) return false;
          const Employee = mongoose.model('Employee');
          const manager = await Employee.findById(v);
          return manager && manager.role === 'trip_manager' && manager.status === 'active';
        },
        message: 'Quản lý chuyến không hợp lệ hoặc không hoạt động',
      },
    },

    // Trip Details
    departureTime: {
      type: Date,
      required: [true, 'Giờ khởi hành là bắt buộc'],
      index: true,
      validate: {
        validator: function (v) {
          // Departure must be in the future (for new trips)
          if (this.isNew) {
            return v > new Date();
          }
          return true;
        },
        message: 'Giờ khởi hành phải trong tương lai',
      },
    },

    arrivalTime: {
      type: Date,
      required: [true, 'Giờ đến là bắt buộc'],
      validate: {
        validator: function (v) {
          return v > this.departureTime;
        },
        message: 'Giờ đến phải sau giờ khởi hành',
      },
    },

    // Pricing
    basePrice: {
      type: Number,
      required: [true, 'Giá vé là bắt buộc'],
      min: [0, 'Giá vé không thể âm'],
    },

    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount không thể âm'],
      max: [100, 'Discount không thể vượt quá 100%'],
    },

    finalPrice: {
      type: Number,
      required: true,
    },

    // Seat Availability
    totalSeats: {
      type: Number,
      required: true,
      min: [1, 'Phải có ít nhất 1 ghế'],
    },

    availableSeats: {
      type: Number,
      required: true,
      min: [0, 'Available seats không thể âm'],
    },

    bookedSeats: {
      type: [String],
      default: [],
      validate: {
        validator: function (seats) {
          // Check no duplicate seats
          return seats.length === new Set(seats).size;
        },
        message: 'Có ghế bị trùng lặp',
      },
    },

    // Status
    status: {
      type: String,
      enum: {
        values: ['scheduled', 'ongoing', 'completed', 'cancelled'],
        message: 'Trạng thái không hợp lệ',
      },
      default: 'scheduled',
      index: true,
    },

    // Cancellation
    cancelledAt: {
      type: Date,
    },

    cancelReason: {
      type: String,
      maxlength: [500, 'Lý do hủy không quá 500 ký tự'],
    },

    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BusOperator',
    },

    // Recurring Trip Info (optional)
    isRecurring: {
      type: Boolean,
      default: false,
    },

    recurringGroupId: {
      type: String,
      index: true,
      sparse: true,
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
// Query trips by operator and date range
TripSchema.index({ operatorId: 1, departureTime: 1 });

// Query trips by route and date
TripSchema.index({ routeId: 1, departureTime: 1 });

// Query trips by status
TripSchema.index({ operatorId: 1, status: 1 });

// Search available trips
TripSchema.index({ status: 1, departureTime: 1, availableSeats: 1 });

// Price-based search (for filtering by price range)
TripSchema.index({ status: 1, finalPrice: 1, departureTime: 1 });

// Bus-based search (for filtering by bus type)
TripSchema.index({ busId: 1, status: 1, departureTime: 1 });

// Recurring trips
TripSchema.index({ recurringGroupId: 1 });

/**
 * Pre-save Middleware
 */
TripSchema.pre('save', async function (next) {
  try {
    // Calculate final price
    if (this.isModified('basePrice') || this.isModified('discount')) {
      this.finalPrice = this.basePrice * (1 - this.discount / 100);
    }

    // Set totalSeats from bus if not set
    if (this.isNew && !this.totalSeats) {
      const Bus = mongoose.model('Bus');
      const bus = await Bus.findById(this.busId);
      if (bus && bus.seatLayout) {
        this.totalSeats = bus.seatLayout.totalSeats;
        this.availableSeats = this.totalSeats;
      }
    }

    // Update available seats based on booked seats
    if (this.isModified('bookedSeats')) {
      this.availableSeats = this.totalSeats - this.bookedSeats.length;
    }

    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Virtual: Duration in minutes
 */
TripSchema.virtual('duration').get(function () {
  if (this.departureTime && this.arrivalTime) {
    return Math.round((this.arrivalTime - this.departureTime) / (1000 * 60));
  }
  return null;
});

/**
 * Virtual: Occupancy rate
 */
TripSchema.virtual('occupancyRate').get(function () {
  if (this.totalSeats > 0) {
    return ((this.bookedSeats.length / this.totalSeats) * 100).toFixed(2);
  }
  return 0;
});

/**
 * Virtual: Is full
 */
TripSchema.virtual('isFull').get(function () {
  return this.availableSeats === 0;
});

/**
 * Virtual: Can be booked
 */
TripSchema.virtual('canBeBooked').get(function () {
  return (
    this.status === 'scheduled' &&
    this.availableSeats > 0 &&
    new Date(this.departureTime) > new Date()
  );
});

/**
 * Instance Methods
 */

/**
 * Book seats for this trip
 * @param {Array<String>} seats - Seat numbers to book
 * @returns {Promise<void>}
 */
TripSchema.methods.bookSeats = async function (seats) {
  // Check if seats are available
  const unavailableSeats = seats.filter((seat) => this.bookedSeats.includes(seat));
  if (unavailableSeats.length > 0) {
    throw new Error(`Ghế đã được đặt: ${unavailableSeats.join(', ')}`);
  }

  // Check if enough seats available
  if (seats.length > this.availableSeats) {
    throw new Error('Không đủ ghế trống');
  }

  // Add seats to booked list
  this.bookedSeats.push(...seats);
  await this.save();
};

/**
 * Cancel booking for specific seats
 * @param {Array<String>} seats - Seat numbers to cancel
 * @returns {Promise<void>}
 */
TripSchema.methods.cancelSeats = async function (seats) {
  this.bookedSeats = this.bookedSeats.filter((seat) => !seats.includes(seat));
  await this.save();
};

/**
 * Check if trip can be cancelled
 * @returns {Boolean}
 */
TripSchema.methods.canBeCancelled = function () {
  return (
    this.status === 'scheduled' &&
    new Date(this.departureTime) > new Date() &&
    this.bookedSeats.length === 0
  );
};

/**
 * Static Methods
 */

/**
 * Find trips by operator with filters
 * @param {ObjectId} operatorId
 * @param {Object} filters
 * @returns {Promise<Array>}
 */
TripSchema.statics.findByOperator = function (operatorId, filters = {}) {
  const query = { operatorId };

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.routeId) {
    query.routeId = filters.routeId;
  }

  if (filters.fromDate && filters.toDate) {
    query.departureTime = {
      $gte: new Date(filters.fromDate),
      $lte: new Date(filters.toDate),
    };
  } else if (filters.fromDate) {
    query.departureTime = { $gte: new Date(filters.fromDate) };
  } else if (filters.toDate) {
    query.departureTime = { $lte: new Date(filters.toDate) };
  }

  return this.find(query)
    .populate('routeId', 'routeName routeCode origin destination')
    .populate('busId', 'busNumber busType seatLayout')
    .populate('driverId', 'fullName phone employeeCode')
    .populate('tripManagerId', 'fullName phone employeeCode')
    .sort({ departureTime: 1 });
};

/**
 * Search available trips for customers
 * @param {Object} criteria - Search criteria
 * @returns {Promise<Array>}
 */
TripSchema.statics.searchAvailableTrips = function (criteria) {
  const query = {
    status: 'scheduled',
    availableSeats: { $gt: 0 },
    departureTime: { $gt: new Date() },
  };

  if (criteria.fromCity && criteria.toCity) {
    // Will need to join with Route to filter by cities
    // For now, filter after populate
  }

  if (criteria.date) {
    const startOfDay = new Date(criteria.date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(criteria.date);
    endOfDay.setHours(23, 59, 59, 999);

    query.departureTime = {
      $gte: startOfDay,
      $lte: endOfDay,
    };
  }

  return this.find(query)
    .populate('routeId')
    .populate('busId')
    .populate('operatorId', 'companyName averageRating')
    .sort({ departureTime: 1 });
};

module.exports = mongoose.model('Trip', TripSchema);
