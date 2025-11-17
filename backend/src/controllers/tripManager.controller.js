const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

/**
 * Trip Manager Controller
 * Handles trip manager/driver authentication and trip management
 * UC-18: Trip Manager Login
 */
class TripManagerController {
  /**
   * UC-18: Trip Manager Login
   * POST /api/trip-manager/login
   */
  static async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { username, password } = req.body;

      // For now, use a simple hardcoded trip manager account
      // In production, this would query a TripManager model
      const tripManagers = [
        {
          id: 'tm_001',
          username: 'manager1',
          password: await bcrypt.hash('manager123', 10), // manager123
          name: 'Nguyen Van Manager',
          role: 'trip_manager',
          operatorId: null, // Can be assigned to specific operator
        },
        {
          id: 'tm_002',
          username: 'driver1',
          password: await bcrypt.hash('driver123', 10), // driver123
          name: 'Tran Van Driver',
          role: 'driver',
          operatorId: null,
        },
      ];

      // Find trip manager
      const tripManager = tripManagers.find((tm) => tm.username === username);

      if (!tripManager) {
        return res.status(401).json({
          success: false,
          message: 'Tên đăng nhập hoặc mật khẩu không đúng',
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, tripManager.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Tên đăng nhập hoặc mật khẩu không đúng',
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: tripManager.id,
          username: tripManager.username,
          role: tripManager.role,
          type: 'trip_manager',
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '8h' } // 8 hour shift
      );

      res.json({
        success: true,
        message: 'Đăng nhập thành công',
        data: {
          token,
          tripManager: {
            id: tripManager.id,
            name: tripManager.name,
            username: tripManager.username,
            role: tripManager.role,
          },
        },
      });
    } catch (error) {
      console.error('Trip manager login error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi đăng nhập',
      });
    }
  }

  /**
   * Get current trip manager info
   * GET /api/trip-manager/me
   */
  static async getMe(req, res) {
    try {
      // Trip manager info from auth middleware
      const tripManager = {
        id: req.tripManager.id,
        username: req.tripManager.username,
        role: req.tripManager.role,
        name: req.tripManager.name || 'Trip Manager',
      };

      res.json({
        success: true,
        data: { tripManager },
      });
    } catch (error) {
      console.error('Get trip manager error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi lấy thông tin',
      });
    }
  }

  /**
   * Get assigned trips for trip manager
   * GET /api/trip-manager/trips
   */
  static async getAssignedTrips(req, res) {
    try {
      const Trip = require('../models/Trip');
      const { status, date } = req.query;

      const query = {};

      // Filter by status
      if (status) {
        query.status = status;
      } else {
        // Default to scheduled and in-progress trips
        query.status = { $in: ['scheduled', 'in-progress'] };
      }

      // Filter by date
      if (date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        query.departureTime = {
          $gte: startOfDay,
          $lte: endOfDay,
        };
      } else {
        // Default to today and future trips
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        query.departureTime = { $gte: now };
      }

      // In production, filter by assigned trip manager
      // query.tripManagerId = req.tripManager.id;

      const trips = await Trip.find(query)
        .populate('routeId', 'routeName origin destination')
        .populate('busId', 'busNumber busType licensePlate')
        .populate('operatorId', 'companyName phone')
        .sort({ departureTime: 1 })
        .limit(50);

      // Calculate statistics for each trip
      const tripsWithStats = trips.map((trip) => ({
        _id: trip._id,
        routeName: trip.routeId.routeName,
        origin: trip.routeId.origin,
        destination: trip.routeId.destination,
        departureTime: trip.departureTime,
        arrivalTime: trip.arrivalTime,
        status: trip.status,
        bus: {
          busNumber: trip.busId.busNumber,
          busType: trip.busId.busType,
          licensePlate: trip.busId.licensePlate,
        },
        operator: {
          companyName: trip.operatorId.companyName,
          phone: trip.operatorId.phone,
        },
        capacity: trip.busId.capacity,
        availableSeats: trip.availableSeats,
        bookedSeatsCount: trip.bookedSeats.length,
        occupancyRate: ((trip.bookedSeats.length / trip.busId.capacity) * 100).toFixed(1),
      }));

      res.json({
        success: true,
        data: {
          trips: tripsWithStats,
          total: tripsWithStats.length,
        },
      });
    } catch (error) {
      console.error('Get assigned trips error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi lấy danh sách chuyến',
      });
    }
  }

  /**
   * Get trip details with passenger list
   * GET /api/trip-manager/trips/:tripId
   */
  static async getTripDetails(req, res) {
    try {
      const { tripId } = req.params;
      const Trip = require('../models/Trip');
      const Ticket = require('../models/Ticket');

      const trip = await Trip.findById(tripId)
        .populate('routeId')
        .populate('busId')
        .populate('operatorId', 'companyName phone email');

      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy chuyến xe',
        });
      }

      // Get all tickets for this trip
      const tickets = await Ticket.find({
        tripId: tripId,
        status: { $in: ['valid', 'used'] },
      })
        .populate('bookingId', 'bookingCode contactInfo')
        .sort({ 'passengers.seatNumber': 1 });

      // Format passenger list
      const passengers = [];
      tickets.forEach((ticket) => {
        ticket.passengers.forEach((passenger) => {
          passengers.push({
            ticketId: ticket._id,
            ticketCode: ticket.ticketCode,
            bookingCode: ticket.bookingId.bookingCode,
            seatNumber: passenger.seatNumber,
            fullName: passenger.fullName,
            phone: passenger.phone,
            email: passenger.email,
            isUsed: ticket.isUsed,
            usedAt: ticket.usedAt,
            status: ticket.status,
            contactInfo: ticket.bookingId.contactInfo,
          });
        });
      });

      // Calculate stats
      const stats = {
        totalPassengers: passengers.length,
        boarded: passengers.filter((p) => p.isUsed).length,
        notBoarded: passengers.filter((p) => !p.isUsed && p.status === 'valid').length,
        occupancyRate: ((passengers.length / trip.busId.capacity) * 100).toFixed(1),
      };

      res.json({
        success: true,
        data: {
          trip: {
            _id: trip._id,
            routeName: trip.routeId.routeName,
            origin: trip.routeId.origin,
            destination: trip.routeId.destination,
            departureTime: trip.departureTime,
            arrivalTime: trip.arrivalTime,
            status: trip.status,
            bus: {
              busNumber: trip.busId.busNumber,
              busType: trip.busId.busType,
              licensePlate: trip.busId.licensePlate,
              capacity: trip.busId.capacity,
            },
            operator: trip.operatorId,
          },
          passengers,
          stats,
        },
      });
    } catch (error) {
      console.error('Get trip details error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi lấy chi tiết chuyến',
      });
    }
  }

  /**
   * Start trip (mark as in-progress)
   * POST /api/trip-manager/trips/:tripId/start
   */
  static async startTrip(req, res) {
    try {
      const { tripId } = req.params;
      const Trip = require('../models/Trip');

      const trip = await Trip.findById(tripId);

      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy chuyến xe',
        });
      }

      if (trip.status !== 'scheduled') {
        return res.status(400).json({
          success: false,
          message: 'Chỉ có thể bắt đầu chuyến xe đang ở trạng thái scheduled',
        });
      }

      trip.status = 'in-progress';
      trip.actualDepartureTime = new Date();
      await trip.save();

      res.json({
        success: true,
        message: 'Đã bắt đầu chuyến xe',
        data: { trip },
      });
    } catch (error) {
      console.error('Start trip error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi bắt đầu chuyến',
      });
    }
  }

  /**
   * Complete trip
   * POST /api/trip-manager/trips/:tripId/complete
   */
  static async completeTrip(req, res) {
    try {
      const { tripId } = req.params;
      const Trip = require('../models/Trip');

      const trip = await Trip.findById(tripId);

      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy chuyến xe',
        });
      }

      if (trip.status !== 'in-progress') {
        return res.status(400).json({
          success: false,
          message: 'Chỉ có thể hoàn thành chuyến xe đang trong hành trình',
        });
      }

      trip.status = 'completed';
      trip.actualArrivalTime = new Date();
      await trip.save();

      res.json({
        success: true,
        message: 'Đã hoàn thành chuyến xe',
        data: { trip },
      });
    } catch (error) {
      console.error('Complete trip error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi hoàn thành chuyến',
      });
    }
  }
}

module.exports = TripManagerController;
