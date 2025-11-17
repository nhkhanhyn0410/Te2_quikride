const Trip = require('../models/Trip');
const Route = require('../models/Route');
const Bus = require('../models/Bus');
const Employee = require('../models/Employee');
const { v4: uuidv4 } = require('uuid');

/**
 * Trip Service
 * Business logic cho quản lý lịch trình chuyến xe
 */
class TripService {
  /**
   * Tạo chuyến xe mới
   * @param {ObjectId} operatorId
   * @param {Object} tripData
   * @returns {Promise<Trip>}
   */
  static async create(operatorId, tripData) {
    // Validate references
    await this.validateReferences(operatorId, tripData);

    // Create trip
    const trip = await Trip.create({
      operatorId,
      ...tripData,
    });

    return await Trip.findById(trip._id)
      .populate('routeId', 'routeName routeCode origin destination')
      .populate('busId', 'busNumber busType seatLayout')
      .populate('driverId', 'fullName employeeCode')
      .populate('tripManagerId', 'fullName employeeCode');
  }

  /**
   * Tạo chuyến xe định kỳ (recurring)
   * @param {ObjectId} operatorId
   * @param {Object} tripData - Base trip data
   * @param {Object} recurringConfig - { startDate, endDate, daysOfWeek, timeOfDay }
   * @returns {Promise<Array<Trip>>}
   */
  static async createRecurring(operatorId, tripData, recurringConfig) {
    const { startDate, endDate, daysOfWeek, timeOfDay } = recurringConfig;

    // Validate date range
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      throw new Error('Ngày bắt đầu phải trước ngày kết thúc');
    }

    // Validate references once
    await this.validateReferences(operatorId, tripData);

    // Generate group ID for recurring trips
    const recurringGroupId = uuidv4();

    const trips = [];
    const currentDate = new Date(start);

    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday

      // Check if this day is in the daysOfWeek array
      if (daysOfWeek.includes(dayOfWeek)) {
        // Create departure and arrival times for this date
        const [departureHour, departureMinute] = timeOfDay.departure.split(':');
        const departureTime = new Date(currentDate);
        departureTime.setHours(parseInt(departureHour), parseInt(departureMinute), 0, 0);

        const [arrivalHour, arrivalMinute] = timeOfDay.arrival.split(':');
        const arrivalTime = new Date(currentDate);
        arrivalTime.setHours(parseInt(arrivalHour), parseInt(arrivalMinute), 0, 0);

        // If arrival is next day
        if (arrivalTime <= departureTime) {
          arrivalTime.setDate(arrivalTime.getDate() + 1);
        }

        // Only create trips in the future
        if (departureTime > new Date()) {
          const trip = await Trip.create({
            operatorId,
            ...tripData,
            departureTime,
            arrivalTime,
            isRecurring: true,
            recurringGroupId,
          });

          trips.push(trip);
        }
      }

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (trips.length === 0) {
      throw new Error('Không tạo được chuyến nào. Kiểm tra lại ngày và giờ.');
    }

    return trips;
  }

  /**
   * Validate all references (route, bus, employees)
   * @param {ObjectId} operatorId
   * @param {Object} tripData
   */
  static async validateReferences(operatorId, tripData) {
    const { routeId, busId, driverId, tripManagerId } = tripData;

    // Verify route exists and belongs to operator
    const route = await Route.findOne({ _id: routeId, operatorId });
    if (!route) {
      throw new Error('Tuyến đường không tồn tại hoặc không thuộc nhà xe này');
    }

    if (!route.isActive) {
      throw new Error('Tuyến đường không hoạt động');
    }

    // Verify bus exists and belongs to operator
    const bus = await Bus.findOne({ _id: busId, operatorId });
    if (!bus) {
      throw new Error('Xe không tồn tại hoặc không thuộc nhà xe này');
    }

    if (bus.status !== 'active') {
      throw new Error('Xe không ở trạng thái hoạt động');
    }

    // Verify driver
    const driver = await Employee.findOne({
      _id: driverId,
      operatorId,
      role: 'driver',
    });

    if (!driver) {
      throw new Error('Tài xế không tồn tại hoặc không thuộc nhà xe này');
    }

    if (driver.status !== 'active') {
      throw new Error('Tài xế không ở trạng thái hoạt động');
    }

    // Check driver license expiry
    if (driver.licenseExpiry && new Date(driver.licenseExpiry) <= new Date()) {
      throw new Error('Giấy phép lái xe của tài xế đã hết hạn');
    }

    // Verify trip manager
    const tripManager = await Employee.findOne({
      _id: tripManagerId,
      operatorId,
      role: 'trip_manager',
    });

    if (!tripManager) {
      throw new Error('Quản lý chuyến không tồn tại hoặc không thuộc nhà xe này');
    }

    if (tripManager.status !== 'active') {
      throw new Error('Quản lý chuyến không ở trạng thái hoạt động');
    }
  }

  /**
   * Lấy danh sách chuyến của operator
   * @param {ObjectId} operatorId
   * @param {Object} filters
   * @param {Object} options - pagination
   * @returns {Promise<Object>}
   */
  static async getByOperator(operatorId, filters = {}, options = {}) {
    const {
      page = 1,
      limit = 20,
      sortBy = 'departureTime',
      sortOrder = 'asc',
    } = options;

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const query = { operatorId };

    // Apply filters
    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.routeId) {
      query.routeId = filters.routeId;
    }

    if (filters.busId) {
      query.busId = filters.busId;
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

    if (filters.recurringGroupId) {
      query.recurringGroupId = filters.recurringGroupId;
    }

    const [trips, total] = await Promise.all([
      Trip.find(query)
        .populate('routeId', 'routeName routeCode origin destination')
        .populate('busId', 'busNumber busType seatLayout')
        .populate('driverId', 'fullName phone employeeCode')
        .populate('tripManagerId', 'fullName phone employeeCode')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Trip.countDocuments(query),
    ]);

    return {
      trips,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Lấy chi tiết chuyến
   * @param {ObjectId} tripId
   * @param {ObjectId} operatorId - For authorization
   * @returns {Promise<Trip>}
   */
  static async getById(tripId, operatorId) {
    const trip = await Trip.findOne({ _id: tripId, operatorId })
      .populate('routeId')
      .populate('busId')
      .populate('driverId')
      .populate('tripManagerId')
      .populate('operatorId', 'companyName phone email');

    if (!trip) {
      throw new Error('Không tìm thấy chuyến xe');
    }

    return trip;
  }

  /**
   * Cập nhật chuyến
   * @param {ObjectId} tripId
   * @param {ObjectId} operatorId
   * @param {Object} updateData
   * @returns {Promise<Trip>}
   */
  static async update(tripId, operatorId, updateData) {
    const trip = await Trip.findOne({ _id: tripId, operatorId });

    if (!trip) {
      throw new Error('Không tìm thấy chuyến xe');
    }

    // Cannot update if trip has started or completed
    if (['ongoing', 'completed'].includes(trip.status)) {
      throw new Error('Không thể cập nhật chuyến đã bắt đầu hoặc hoàn thành');
    }

    // Cannot update if there are bookings
    if (trip.bookedSeats.length > 0) {
      throw new Error('Không thể cập nhật chuyến đã có đặt chỗ');
    }

    // Validate references if they're being changed
    if (
      updateData.routeId ||
      updateData.busId ||
      updateData.driverId ||
      updateData.tripManagerId
    ) {
      await this.validateReferences(operatorId, {
        routeId: updateData.routeId || trip.routeId,
        busId: updateData.busId || trip.busId,
        driverId: updateData.driverId || trip.driverId,
        tripManagerId: updateData.tripManagerId || trip.tripManagerId,
      });
    }

    // Update fields
    Object.assign(trip, updateData);
    await trip.save();

    return await Trip.findById(trip._id)
      .populate('routeId', 'routeName routeCode origin destination')
      .populate('busId', 'busNumber busType seatLayout')
      .populate('driverId', 'fullName employeeCode')
      .populate('tripManagerId', 'fullName employeeCode');
  }

  /**
   * Hủy chuyến
   * @param {ObjectId} tripId
   * @param {ObjectId} operatorId
   * @param {String} cancelReason
   * @returns {Promise<Trip>}
   */
  static async cancel(tripId, operatorId, cancelReason) {
    const trip = await Trip.findOne({ _id: tripId, operatorId });

    if (!trip) {
      throw new Error('Không tìm thấy chuyến xe');
    }

    if (trip.status === 'cancelled') {
      throw new Error('Chuyến xe đã bị hủy');
    }

    if (trip.status === 'completed') {
      throw new Error('Không thể hủy chuyến đã hoàn thành');
    }

    // Check if trip has bookings
    if (trip.bookedSeats.length > 0) {
      throw new Error(
        'Chuyến có khách đặt. Cần xử lý hoàn tiền trước khi hủy'
      );
    }

    trip.status = 'cancelled';
    trip.cancelledAt = new Date();
    trip.cancelReason = cancelReason;
    trip.cancelledBy = operatorId;

    await trip.save();

    return trip;
  }

  /**
   * Xóa chuyến (hard delete - chỉ cho phép nếu chưa có booking)
   * @param {ObjectId} tripId
   * @param {ObjectId} operatorId
   * @returns {Promise<void>}
   */
  static async delete(tripId, operatorId) {
    const trip = await Trip.findOne({ _id: tripId, operatorId });

    if (!trip) {
      throw new Error('Không tìm thấy chuyến xe');
    }

    if (trip.bookedSeats.length > 0) {
      throw new Error('Không thể xóa chuyến đã có đặt chỗ');
    }

    if (trip.status !== 'scheduled') {
      throw new Error('Chỉ có thể xóa chuyến ở trạng thái scheduled');
    }

    await Trip.deleteOne({ _id: tripId });
  }

  /**
   * Lấy thống kê chuyến
   * @param {ObjectId} operatorId
   * @param {Object} dateRange - { fromDate, toDate }
   * @returns {Promise<Object>}
   */
  static async getStatistics(operatorId, dateRange = {}) {
    const mongoose = require('mongoose');

    let operatorObjectId;
    try {
      operatorObjectId = new mongoose.Types.ObjectId(operatorId);
    } catch (error) {
      operatorObjectId = operatorId;
    }

    const query = { operatorId: operatorObjectId };

    if (dateRange.fromDate && dateRange.toDate) {
      query.departureTime = {
        $gte: new Date(dateRange.fromDate),
        $lte: new Date(dateRange.toDate),
      };
    }

    const [totalTrips, tripsByStatus, avgOccupancy] = await Promise.all([
      Trip.countDocuments(query),

      Trip.aggregate([
        { $match: query },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),

      Trip.aggregate([
        { $match: { ...query, status: { $ne: 'cancelled' } } },
        {
          $group: {
            _id: null,
            avgOccupancy: {
              $avg: {
                $multiply: [
                  {
                    $divide: [
                      { $size: '$bookedSeats' },
                      '$totalSeats',
                    ],
                  },
                  100,
                ],
              },
            },
          },
        },
      ]),
    ]);

    const statusStats = {};
    tripsByStatus.forEach((item) => {
      statusStats[item._id] = item.count;
    });

    return {
      totalTrips,
      scheduled: statusStats.scheduled || 0,
      ongoing: statusStats.ongoing || 0,
      completed: statusStats.completed || 0,
      cancelled: statusStats.cancelled || 0,
      averageOccupancyRate: avgOccupancy[0]?.avgOccupancy?.toFixed(2) || 0,
      tripsByStatus: statusStats,
    };
  }

  /**
   * Search available trips (for customers)
   * @param {Object} searchCriteria
   * @returns {Promise<Array>}
   */
  static async searchAvailableTrips(searchCriteria) {
    const { fromCity, toCity, date, passengers = 1 } = searchCriteria;

    // Build query
    const query = {
      status: 'scheduled',
      availableSeats: { $gte: passengers },
      departureTime: { $gt: new Date() },
    };

    // Date filter
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query.departureTime = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }

    let trips = await Trip.find(query)
      .populate('routeId')
      .populate('busId', 'busNumber busType seatLayout amenities')
      .populate('operatorId', 'companyName averageRating')
      .sort({ departureTime: 1 })
      .lean();

    // Filter by cities (after populate)
    if (fromCity && toCity) {
      trips = trips.filter(
        (trip) =>
          trip.routeId &&
          trip.routeId.origin.city.toLowerCase().includes(fromCity.toLowerCase()) &&
          trip.routeId.destination.city.toLowerCase().includes(toCity.toLowerCase())
      );
    } else if (fromCity) {
      trips = trips.filter(
        (trip) =>
          trip.routeId &&
          trip.routeId.origin.city.toLowerCase().includes(fromCity.toLowerCase())
      );
    } else if (toCity) {
      trips = trips.filter(
        (trip) =>
          trip.routeId &&
          trip.routeId.destination.city.toLowerCase().includes(toCity.toLowerCase())
      );
    }

    return trips;
  }

  /**
   * Get trip detail for customers (public)
   * @param {ObjectId} tripId
   * @returns {Promise<Trip>}
   */
  static async getPublicTripDetail(tripId) {
    const trip = await Trip.findOne({
      _id: tripId,
      status: 'scheduled',
    })
      .populate('routeId')
      .populate('busId')
      .populate('operatorId', 'companyName phone email averageRating totalReviews')
      .lean();

    if (!trip) {
      throw new Error('Không tìm thấy chuyến xe hoặc chuyến không khả dụng');
    }

    // Don't return sensitive employee info to public
    delete trip.driverId;
    delete trip.tripManagerId;

    return trip;
  }
}

module.exports = TripService;
