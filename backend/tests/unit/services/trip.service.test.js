// Mock the models FIRST
jest.mock('../../../src/models/Trip');
jest.mock('../../../src/models/Route');
jest.mock('../../../src/models/Bus');
jest.mock('../../../src/models/Employee');
jest.mock('uuid');

// Then require everything
const TripService = require('../../../src/services/trip.service');
const Trip = require('../../../src/models/Trip');
const Route = require('../../../src/models/Route');
const Bus = require('../../../src/models/Bus');
const Employee = require('../../../src/models/Employee');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

describe('TripService', () => {
  const operatorId = new mongoose.Types.ObjectId();
  const routeId = new mongoose.Types.ObjectId();
  const busId = new mongoose.Types.ObjectId();
  const driverId = new mongoose.Types.ObjectId();
  const tripManagerId = new mongoose.Types.ObjectId();
  const tripId = new mongoose.Types.ObjectId();

  const validTripData = {
    routeId,
    busId,
    driverId,
    tripManagerId,
    departureTime: new Date(Date.now() + 86400000), // Tomorrow
    arrivalTime: new Date(Date.now() + 90000000),
    basePrice: 200000,
  };

  const mockRoute = {
    _id: routeId,
    operatorId,
    routeName: 'Hanoi - Haiphong',
    routeCode: 'HN-HP-001',
    isActive: true,
    origin: { city: 'Hanoi' },
    destination: { city: 'Haiphong' },
  };

  const mockBus = {
    _id: busId,
    operatorId,
    busNumber: '29A-12345',
    status: 'active',
    seatLayout: { totalSeats: 40 },
  };

  const mockDriver = {
    _id: driverId,
    operatorId,
    role: 'driver',
    fullName: 'Nguyen Van A',
    status: 'active',
    licenseExpiry: new Date(Date.now() + 31536000000), // 1 year from now
  };

  const mockTripManager = {
    _id: tripManagerId,
    operatorId,
    role: 'trip_manager',
    fullName: 'Tran Thi B',
    status: 'active',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a trip successfully', async () => {
      Route.findOne.mockResolvedValue(mockRoute);
      Bus.findOne.mockResolvedValue(mockBus);
      Employee.findOne
        .mockResolvedValueOnce(mockDriver) // First call for driver
        .mockResolvedValueOnce(mockTripManager); // Second call for trip manager

      const mockCreatedTrip = {
        _id: tripId,
        operatorId,
        ...validTripData,
      };

      Trip.create.mockResolvedValue(mockCreatedTrip);

      const mockPopulatedTrip = {
        ...mockCreatedTrip,
        routeId: mockRoute,
        busId: mockBus,
        driverId: mockDriver,
        tripManagerId: mockTripManager,
      };

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
      };
      // Last populate call resolves with data
      mockQuery.populate
        .mockReturnValueOnce(mockQuery) // First populate (routeId)
        .mockReturnValueOnce(mockQuery) // Second populate (busId)
        .mockReturnValueOnce(mockQuery) // Third populate (driverId)
        .mockResolvedValueOnce(mockPopulatedTrip); // Fourth populate (tripManagerId) - returns final result
      Trip.findById.mockReturnValue(mockQuery);

      const result = await TripService.create(operatorId, validTripData);

      expect(Route.findOne).toHaveBeenCalledWith({ _id: routeId, operatorId });
      expect(Bus.findOne).toHaveBeenCalledWith({ _id: busId, operatorId });
      expect(Employee.findOne).toHaveBeenCalledWith({
        _id: driverId,
        operatorId,
        role: 'driver',
      });
      expect(Employee.findOne).toHaveBeenCalledWith({
        _id: tripManagerId,
        operatorId,
        role: 'trip_manager',
      });
      expect(Trip.create).toHaveBeenCalledWith({
        operatorId,
        ...validTripData,
      });
      expect(result).toEqual(mockPopulatedTrip);
    });

    it('should throw error if route does not exist', async () => {
      Route.findOne.mockResolvedValue(null);

      await expect(TripService.create(operatorId, validTripData)).rejects.toThrow(
        'Tuyến đường không tồn tại hoặc không thuộc nhà xe này'
      );
    });

    it('should throw error if route is not active', async () => {
      Route.findOne.mockResolvedValue({ ...mockRoute, isActive: false });

      await expect(TripService.create(operatorId, validTripData)).rejects.toThrow(
        'Tuyến đường không hoạt động'
      );
    });

    it('should throw error if bus does not exist', async () => {
      Route.findOne.mockResolvedValue(mockRoute);
      Bus.findOne.mockResolvedValue(null);

      await expect(TripService.create(operatorId, validTripData)).rejects.toThrow(
        'Xe không tồn tại hoặc không thuộc nhà xe này'
      );
    });

    it('should throw error if bus is not active', async () => {
      Route.findOne.mockResolvedValue(mockRoute);
      Bus.findOne.mockResolvedValue({ ...mockBus, status: 'maintenance' });

      await expect(TripService.create(operatorId, validTripData)).rejects.toThrow(
        'Xe không ở trạng thái hoạt động'
      );
    });

    it('should throw error if driver does not exist', async () => {
      Route.findOne.mockResolvedValue(mockRoute);
      Bus.findOne.mockResolvedValue(mockBus);
      Employee.findOne.mockResolvedValueOnce(null);

      await expect(TripService.create(operatorId, validTripData)).rejects.toThrow(
        'Tài xế không tồn tại hoặc không thuộc nhà xe này'
      );
    });

    it('should throw error if driver is not active', async () => {
      Route.findOne.mockResolvedValue(mockRoute);
      Bus.findOne.mockResolvedValue(mockBus);
      Employee.findOne.mockResolvedValueOnce({ ...mockDriver, status: 'suspended' });

      await expect(TripService.create(operatorId, validTripData)).rejects.toThrow(
        'Tài xế không ở trạng thái hoạt động'
      );
    });

    it('should throw error if driver license is expired', async () => {
      Route.findOne.mockResolvedValue(mockRoute);
      Bus.findOne.mockResolvedValue(mockBus);
      Employee.findOne.mockResolvedValueOnce({
        ...mockDriver,
        licenseExpiry: new Date(Date.now() - 86400000), // Yesterday
      });

      await expect(TripService.create(operatorId, validTripData)).rejects.toThrow(
        'Giấy phép lái xe của tài xế đã hết hạn'
      );
    });

    it('should throw error if trip manager does not exist', async () => {
      Route.findOne.mockResolvedValue(mockRoute);
      Bus.findOne.mockResolvedValue(mockBus);
      Employee.findOne
        .mockResolvedValueOnce(mockDriver)
        .mockResolvedValueOnce(null);

      await expect(TripService.create(operatorId, validTripData)).rejects.toThrow(
        'Quản lý chuyến không tồn tại hoặc không thuộc nhà xe này'
      );
    });

    it('should throw error if trip manager is not active', async () => {
      Route.findOne.mockResolvedValue(mockRoute);
      Bus.findOne.mockResolvedValue(mockBus);
      Employee.findOne
        .mockResolvedValueOnce(mockDriver)
        .mockResolvedValueOnce({ ...mockTripManager, status: 'terminated' });

      await expect(TripService.create(operatorId, validTripData)).rejects.toThrow(
        'Quản lý chuyến không ở trạng thái hoạt động'
      );
    });
  });

  describe('createRecurring', () => {
    const recurringConfig = {
      startDate: new Date('2025-12-01'),
      endDate: new Date('2025-12-07'),
      daysOfWeek: [1, 3, 5], // Monday, Wednesday, Friday
      timeOfDay: {
        departure: '08:00',
        arrival: '12:00',
      },
    };

    beforeEach(() => {
      Route.findOne.mockResolvedValue(mockRoute);
      Bus.findOne.mockResolvedValue(mockBus);
      Employee.findOne
        .mockResolvedValueOnce(mockDriver)
        .mockResolvedValueOnce(mockTripManager);
      uuidv4.mockReturnValue('test-uuid-1234');
    });

    it('should create recurring trips successfully', async () => {
      const mockTrips = [];
      Trip.create.mockImplementation((data) => {
        const trip = { _id: new mongoose.Types.ObjectId(), ...data };
        mockTrips.push(trip);
        return Promise.resolve(trip);
      });

      const result = await TripService.createRecurring(
        operatorId,
        validTripData,
        recurringConfig
      );

      expect(uuidv4).toHaveBeenCalled();
      expect(Trip.create).toHaveBeenCalled();
      expect(result.length).toBeGreaterThan(0);
      result.forEach((trip) => {
        expect(trip.recurringGroupId).toBe('test-uuid-1234');
        expect(trip.isRecurring).toBe(true);
      });
    });

    it('should throw error if start date is after end date', async () => {
      const invalidConfig = {
        ...recurringConfig,
        startDate: new Date('2025-12-10'),
        endDate: new Date('2025-12-01'),
      };

      await expect(
        TripService.createRecurring(operatorId, validTripData, invalidConfig)
      ).rejects.toThrow('Ngày bắt đầu phải trước ngày kết thúc');
    });

    it('should throw error if no trips can be created', async () => {
      const pastConfig = {
        ...recurringConfig,
        startDate: new Date('2020-01-01'),
        endDate: new Date('2020-01-07'),
      };

      await expect(
        TripService.createRecurring(operatorId, validTripData, pastConfig)
      ).rejects.toThrow('Không tạo được chuyến nào. Kiểm tra lại ngày và giờ.');
    });

    it('should only create trips on specified days of week', async () => {
      const trips = [];
      Trip.create.mockImplementation((data) => {
        const trip = { _id: new mongoose.Types.ObjectId(), ...data };
        trips.push(trip);
        return Promise.resolve(trip);
      });

      await TripService.createRecurring(operatorId, validTripData, recurringConfig);

      trips.forEach((trip) => {
        const dayOfWeek = new Date(trip.departureTime).getDay();
        expect(recurringConfig.daysOfWeek).toContain(dayOfWeek);
      });
    });

    it('should handle arrival time on next day', async () => {
      const nightConfig = {
        ...recurringConfig,
        timeOfDay: {
          departure: '22:00',
          arrival: '02:00', // Next day
        },
      };

      Trip.create.mockResolvedValue({ _id: tripId });

      await TripService.createRecurring(operatorId, validTripData, nightConfig);

      // Verify Trip.create was called with arrival time after departure
      const createCalls = Trip.create.mock.calls;
      createCalls.forEach((call) => {
        const tripData = call[0];
        expect(tripData.arrivalTime > tripData.departureTime).toBe(true);
      });
    });
  });

  describe('getByOperator', () => {
    it('should return trips with pagination', async () => {
      const mockTrips = [
        { _id: tripId, operatorId, ...validTripData },
      ];

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockTrips),
      };

      Trip.find.mockReturnValue(mockQuery);
      Trip.countDocuments.mockResolvedValue(1);

      const result = await TripService.getByOperator(operatorId);

      expect(Trip.find).toHaveBeenCalledWith({ operatorId });
      expect(result).toEqual({
        trips: mockTrips,
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          pages: 1,
        },
      });
    });

    it('should apply status filter', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      };

      Trip.find.mockReturnValue(mockQuery);
      Trip.countDocuments.mockResolvedValue(0);

      await TripService.getByOperator(operatorId, { status: 'scheduled' });

      expect(Trip.find).toHaveBeenCalledWith({
        operatorId,
        status: 'scheduled',
      });
    });

    it('should apply date range filter', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      };

      Trip.find.mockReturnValue(mockQuery);
      Trip.countDocuments.mockResolvedValue(0);

      const fromDate = '2025-12-01';
      const toDate = '2025-12-31';

      await TripService.getByOperator(operatorId, { fromDate, toDate });

      expect(Trip.find).toHaveBeenCalledWith({
        operatorId,
        departureTime: {
          $gte: new Date(fromDate),
          $lte: new Date(toDate),
        },
      });
    });

    it('should apply route and bus filters', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      };

      Trip.find.mockReturnValue(mockQuery);
      Trip.countDocuments.mockResolvedValue(0);

      await TripService.getByOperator(operatorId, { routeId, busId });

      expect(Trip.find).toHaveBeenCalledWith({
        operatorId,
        routeId,
        busId,
      });
    });

    it('should handle custom pagination', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      };

      Trip.find.mockReturnValue(mockQuery);
      Trip.countDocuments.mockResolvedValue(50);

      await TripService.getByOperator(operatorId, {}, { page: 2, limit: 10 });

      expect(mockQuery.skip).toHaveBeenCalledWith(10);
      expect(mockQuery.limit).toHaveBeenCalledWith(10);
    });
  });

  describe('getById', () => {
    it('should return trip by id', async () => {
      const mockTrip = {
        _id: tripId,
        operatorId,
        ...validTripData,
      };

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
      };
      mockQuery.populate
        .mockReturnValueOnce(mockQuery) // First populate (routeId)
        .mockReturnValueOnce(mockQuery) // Second populate (busId)
        .mockReturnValueOnce(mockQuery) // Third populate (driverId)
        .mockReturnValueOnce(mockQuery) // Fourth populate (tripManagerId)
        .mockResolvedValueOnce(mockTrip); // Fifth populate (operatorId) - returns final result
      Trip.findOne.mockReturnValue(mockQuery);

      const result = await TripService.getById(tripId, operatorId);

      expect(Trip.findOne).toHaveBeenCalledWith({ _id: tripId, operatorId });
      expect(result).toEqual(mockTrip);
    });

    it('should throw error if trip not found', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
      };
      mockQuery.populate
        .mockReturnValueOnce(mockQuery)
        .mockReturnValueOnce(mockQuery)
        .mockReturnValueOnce(mockQuery)
        .mockReturnValueOnce(mockQuery)
        .mockResolvedValueOnce(null);
      Trip.findOne.mockReturnValue(mockQuery);

      await expect(TripService.getById(tripId, operatorId)).rejects.toThrow(
        'Không tìm thấy chuyến xe'
      );
    });
  });

  describe('update', () => {
    it('should update trip successfully', async () => {
      const mockTrip = {
        _id: tripId,
        operatorId,
        status: 'scheduled',
        bookedSeats: [],
        ...validTripData,
        save: jest.fn().mockResolvedValue(true),
      };

      Trip.findOne.mockResolvedValue(mockTrip);
      Route.findOne.mockResolvedValue(mockRoute);
      Bus.findOne.mockResolvedValue(mockBus);
      Employee.findOne
        .mockResolvedValueOnce(mockDriver)
        .mockResolvedValueOnce(mockTripManager);

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
      };
      mockQuery.populate
        .mockReturnValueOnce(mockQuery) // First populate (routeId)
        .mockReturnValueOnce(mockQuery) // Second populate (busId)
        .mockReturnValueOnce(mockQuery) // Third populate (driverId)
        .mockResolvedValueOnce({ ...mockTrip, basePrice: 250000 }); // Fourth populate (tripManagerId) - returns final result
      Trip.findById.mockReturnValue(mockQuery);

      const updateData = { basePrice: 250000 };
      const result = await TripService.update(tripId, operatorId, updateData);

      expect(mockTrip.save).toHaveBeenCalled();
      expect(result.basePrice).toBe(250000);
    });

    it('should throw error if trip not found', async () => {
      Trip.findOne.mockResolvedValue(null);

      await expect(
        TripService.update(tripId, operatorId, { basePrice: 250000 })
      ).rejects.toThrow('Không tìm thấy chuyến xe');
    });

    it('should throw error if trip has started', async () => {
      const mockTrip = {
        _id: tripId,
        operatorId,
        status: 'ongoing',
        ...validTripData,
      };

      Trip.findOne.mockResolvedValue(mockTrip);

      await expect(
        TripService.update(tripId, operatorId, { basePrice: 250000 })
      ).rejects.toThrow('Không thể cập nhật chuyến đã bắt đầu hoặc hoàn thành');
    });

    it('should throw error if trip has bookings', async () => {
      const mockTrip = {
        _id: tripId,
        operatorId,
        status: 'scheduled',
        bookedSeats: [{ seatNumber: 'A1' }],
        ...validTripData,
      };

      Trip.findOne.mockResolvedValue(mockTrip);

      await expect(
        TripService.update(tripId, operatorId, { basePrice: 250000 })
      ).rejects.toThrow('Không thể cập nhật chuyến đã có đặt chỗ');
    });
  });

  describe('cancel', () => {
    it('should cancel trip successfully', async () => {
      const mockTrip = {
        _id: tripId,
        operatorId,
        status: 'scheduled',
        bookedSeats: [],
        save: jest.fn().mockResolvedValue(true),
      };

      Trip.findOne.mockResolvedValue(mockTrip);

      const result = await TripService.cancel(tripId, operatorId, 'Maintenance issue');

      expect(mockTrip.status).toBe('cancelled');
      expect(mockTrip.cancelReason).toBe('Maintenance issue');
      expect(mockTrip.save).toHaveBeenCalled();
    });

    it('should throw error if trip not found', async () => {
      Trip.findOne.mockResolvedValue(null);

      await expect(
        TripService.cancel(tripId, operatorId, 'Reason')
      ).rejects.toThrow('Không tìm thấy chuyến xe');
    });

    it('should throw error if trip already cancelled', async () => {
      const mockTrip = {
        _id: tripId,
        operatorId,
        status: 'cancelled',
      };

      Trip.findOne.mockResolvedValue(mockTrip);

      await expect(
        TripService.cancel(tripId, operatorId, 'Reason')
      ).rejects.toThrow('Chuyến xe đã bị hủy');
    });

    it('should throw error if trip is completed', async () => {
      const mockTrip = {
        _id: tripId,
        operatorId,
        status: 'completed',
      };

      Trip.findOne.mockResolvedValue(mockTrip);

      await expect(
        TripService.cancel(tripId, operatorId, 'Reason')
      ).rejects.toThrow('Không thể hủy chuyến đã hoàn thành');
    });

    it('should throw error if trip has bookings', async () => {
      const mockTrip = {
        _id: tripId,
        operatorId,
        status: 'scheduled',
        bookedSeats: [{ seatNumber: 'A1' }],
      };

      Trip.findOne.mockResolvedValue(mockTrip);

      await expect(
        TripService.cancel(tripId, operatorId, 'Reason')
      ).rejects.toThrow('Chuyến có khách đặt. Cần xử lý hoàn tiền trước khi hủy');
    });
  });

  describe('delete', () => {
    it('should delete trip successfully', async () => {
      const mockTrip = {
        _id: tripId,
        operatorId,
        status: 'scheduled',
        bookedSeats: [],
      };

      Trip.findOne.mockResolvedValue(mockTrip);
      Trip.deleteOne.mockResolvedValue({ deletedCount: 1 });

      await TripService.delete(tripId, operatorId);

      expect(Trip.deleteOne).toHaveBeenCalledWith({ _id: tripId });
    });

    it('should throw error if trip not found', async () => {
      Trip.findOne.mockResolvedValue(null);

      await expect(TripService.delete(tripId, operatorId)).rejects.toThrow(
        'Không tìm thấy chuyến xe'
      );
    });

    it('should throw error if trip has bookings', async () => {
      const mockTrip = {
        _id: tripId,
        operatorId,
        status: 'scheduled',
        bookedSeats: [{ seatNumber: 'A1' }],
      };

      Trip.findOne.mockResolvedValue(mockTrip);

      await expect(TripService.delete(tripId, operatorId)).rejects.toThrow(
        'Không thể xóa chuyến đã có đặt chỗ'
      );
    });

    it('should throw error if trip is not scheduled', async () => {
      const mockTrip = {
        _id: tripId,
        operatorId,
        status: 'completed',
        bookedSeats: [],
      };

      Trip.findOne.mockResolvedValue(mockTrip);

      await expect(TripService.delete(tripId, operatorId)).rejects.toThrow(
        'Chỉ có thể xóa chuyến ở trạng thái scheduled'
      );
    });
  });

  describe('getStatistics', () => {
    it('should return trip statistics', async () => {
      Trip.countDocuments.mockResolvedValue(100);

      Trip.aggregate
        .mockResolvedValueOnce([
          { _id: 'scheduled', count: 40 },
          { _id: 'ongoing', count: 10 },
          { _id: 'completed', count: 45 },
          { _id: 'cancelled', count: 5 },
        ])
        .mockResolvedValueOnce([{ _id: null, avgOccupancy: 75.5 }]);

      const result = await TripService.getStatistics(operatorId);

      expect(result).toEqual({
        totalTrips: 100,
        scheduled: 40,
        ongoing: 10,
        completed: 45,
        cancelled: 5,
        averageOccupancyRate: '75.50',
        tripsByStatus: {
          scheduled: 40,
          ongoing: 10,
          completed: 45,
          cancelled: 5,
        },
      });
    });

    it('should handle date range filter', async () => {
      Trip.countDocuments.mockResolvedValue(50);
      Trip.aggregate
        .mockResolvedValueOnce([{ _id: 'scheduled', count: 50 }])
        .mockResolvedValueOnce([{ _id: null, avgOccupancy: 80 }]);

      const fromDate = '2025-12-01';
      const toDate = '2025-12-31';

      await TripService.getStatistics(operatorId, { fromDate, toDate });

      expect(Trip.countDocuments).toHaveBeenCalledWith({
        operatorId: expect.any(mongoose.Types.ObjectId),
        departureTime: {
          $gte: new Date(fromDate),
          $lte: new Date(toDate),
        },
      });
    });

    it('should handle zero occupancy rate', async () => {
      Trip.countDocuments.mockResolvedValue(10);
      Trip.aggregate
        .mockResolvedValueOnce([{ _id: 'scheduled', count: 10 }])
        .mockResolvedValueOnce([]);

      const result = await TripService.getStatistics(operatorId);

      expect(result.averageOccupancyRate).toBe(0);
    });
  });

  describe('searchAvailableTrips', () => {
    it('should search trips by city', async () => {
      const mockTrips = [
        {
          _id: tripId,
          routeId: mockRoute,
          busId: mockBus,
          operatorId: { companyName: 'Test Operator', averageRating: 4.5 },
          status: 'scheduled',
          availableSeats: 30,
        },
      ];

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockTrips),
      };

      Trip.find.mockReturnValue(mockQuery);

      const result = await TripService.searchAvailableTrips({
        fromCity: 'Hanoi',
        toCity: 'Haiphong',
        date: '2025-12-15',
        passengers: 2,
      });

      expect(Trip.find).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'scheduled',
          availableSeats: { $gte: 2 },
        })
      );
      expect(result.length).toBe(1);
      expect(result[0].routeId.origin.city).toContain('Hanoi');
    });

    it('should filter by date range', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([]),
      };

      Trip.find.mockReturnValue(mockQuery);

      const date = '2025-12-15';
      await TripService.searchAvailableTrips({ date, passengers: 1 });

      const callArgs = Trip.find.mock.calls[0][0];
      expect(callArgs.departureTime).toBeDefined();
      expect(callArgs.departureTime.$gte).toBeInstanceOf(Date);
      expect(callArgs.departureTime.$lte).toBeInstanceOf(Date);
    });

    it('should only return scheduled trips with available seats', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([]),
      };

      Trip.find.mockReturnValue(mockQuery);

      await TripService.searchAvailableTrips({ passengers: 1 });

      expect(Trip.find).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'scheduled',
          availableSeats: { $gte: 1 },
          departureTime: { $gt: expect.any(Date) },
        })
      );
    });

    it('should filter by price range', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([]),
      };

      Trip.find.mockReturnValue(mockQuery);

      await TripService.searchAvailableTrips({
        passengers: 1,
        minPrice: 100000,
        maxPrice: 300000,
      });

      expect(Trip.find).toHaveBeenCalledWith(
        expect.objectContaining({
          finalPrice: {
            $gte: 100000,
            $lte: 300000,
          },
        })
      );
    });

    it('should filter by operator', async () => {
      const operatorId = new mongoose.Types.ObjectId();
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([]),
      };

      Trip.find.mockReturnValue(mockQuery);

      await TripService.searchAvailableTrips({
        passengers: 1,
        operatorId: operatorId.toString(),
      });

      expect(Trip.find).toHaveBeenCalledWith(
        expect.objectContaining({
          operatorId: operatorId.toString(),
        })
      );
    });

    it('should filter by bus type', async () => {
      const mockTrips = [
        {
          _id: tripId,
          routeId: mockRoute,
          busId: { ...mockBus, busType: 'limousine' },
          operatorId: { companyName: 'Test', averageRating: 4.5 },
        },
        {
          _id: new mongoose.Types.ObjectId(),
          routeId: mockRoute,
          busId: { ...mockBus, busType: 'seater' },
          operatorId: { companyName: 'Test', averageRating: 4.5 },
        },
      ];

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockTrips),
      };

      Trip.find.mockReturnValue(mockQuery);

      const result = await TripService.searchAvailableTrips({
        passengers: 1,
        busType: 'limousine',
      });

      expect(result.length).toBe(1);
      expect(result[0].busId.busType).toBe('limousine');
    });

    it('should sort by price ascending', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([]),
      };

      Trip.find.mockReturnValue(mockQuery);

      await TripService.searchAvailableTrips({
        passengers: 1,
        sortBy: 'price',
        sortOrder: 'asc',
      });

      expect(mockQuery.sort).toHaveBeenCalledWith({ finalPrice: 1 });
    });

    it('should sort by price descending', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([]),
      };

      Trip.find.mockReturnValue(mockQuery);

      await TripService.searchAvailableTrips({
        passengers: 1,
        sortBy: 'price',
        sortOrder: 'desc',
      });

      expect(mockQuery.sort).toHaveBeenCalledWith({ finalPrice: -1 });
    });

    it('should sort by rating', async () => {
      const mockTrips = [
        {
          _id: new mongoose.Types.ObjectId(),
          routeId: mockRoute,
          busId: mockBus,
          operatorId: { companyName: 'Operator A', averageRating: 4.0 },
        },
        {
          _id: new mongoose.Types.ObjectId(),
          routeId: mockRoute,
          busId: mockBus,
          operatorId: { companyName: 'Operator B', averageRating: 4.8 },
        },
        {
          _id: new mongoose.Types.ObjectId(),
          routeId: mockRoute,
          busId: mockBus,
          operatorId: { companyName: 'Operator C', averageRating: 3.5 },
        },
      ];

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([...mockTrips]),
      };

      Trip.find.mockReturnValue(mockQuery);

      const result = await TripService.searchAvailableTrips({
        passengers: 1,
        sortBy: 'rating',
        sortOrder: 'desc',
      });

      expect(result[0].operatorId.averageRating).toBe(4.8);
      expect(result[1].operatorId.averageRating).toBe(4.0);
      expect(result[2].operatorId.averageRating).toBe(3.5);
    });

    it('should filter by departure time range', async () => {
      const mockTrips = [
        {
          _id: new mongoose.Types.ObjectId(),
          routeId: mockRoute,
          busId: mockBus,
          operatorId: { companyName: 'Test', averageRating: 4.5 },
          departureTime: new Date('2025-12-15T08:30:00'),
        },
        {
          _id: new mongoose.Types.ObjectId(),
          routeId: mockRoute,
          busId: mockBus,
          operatorId: { companyName: 'Test', averageRating: 4.5 },
          departureTime: new Date('2025-12-15T14:00:00'),
        },
        {
          _id: new mongoose.Types.ObjectId(),
          routeId: mockRoute,
          busId: mockBus,
          operatorId: { companyName: 'Test', averageRating: 4.5 },
          departureTime: new Date('2025-12-15T18:30:00'),
        },
      ];

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockTrips),
      };

      Trip.find.mockReturnValue(mockQuery);

      const result = await TripService.searchAvailableTrips({
        passengers: 1,
        departureTimeStart: '08:00',
        departureTimeEnd: '15:00',
      });

      expect(result.length).toBe(2);
      expect(result.some(t => t.departureTime.getHours() === 8)).toBe(true);
      expect(result.some(t => t.departureTime.getHours() === 14)).toBe(true);
      expect(result.some(t => t.departureTime.getHours() === 18)).toBe(false);
    });

    it('should combine multiple filters', async () => {
      const mockTrips = [
        {
          _id: tripId,
          routeId: mockRoute,
          busId: { ...mockBus, busType: 'limousine' },
          operatorId: { companyName: 'Test', averageRating: 4.5 },
          finalPrice: 250000,
          departureTime: new Date('2025-12-15T09:00:00'),
        },
      ];

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockTrips),
      };

      Trip.find.mockReturnValue(mockQuery);

      const result = await TripService.searchAvailableTrips({
        fromCity: 'Hanoi',
        toCity: 'Haiphong',
        passengers: 2,
        minPrice: 200000,
        maxPrice: 300000,
        busType: 'limousine',
        sortBy: 'price',
        sortOrder: 'asc',
      });

      expect(Trip.find).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'scheduled',
          availableSeats: { $gte: 2 },
          finalPrice: {
            $gte: 200000,
            $lte: 300000,
          },
        })
      );
      expect(result.length).toBe(1);
      expect(result[0].busId.busType).toBe('limousine');
    });
  });

  describe('getPublicTripDetail', () => {
    it('should return enhanced public trip details with comprehensive information', async () => {
      const mockTrip = {
        _id: tripId,
        routeId: {
          ...mockRoute,
          distance: 120,
          estimatedDuration: 180,
          pickupPoints: [{ name: 'Point A', address: 'Address A' }],
          dropoffPoints: [{ name: 'Point B', address: 'Address B' }],
        },
        busId: {
          ...mockBus,
          amenities: ['wifi', 'ac', 'toilet'],
        },
        operatorId: {
          _id: operatorId,
          companyName: 'Test Operator',
          phone: '0123456789',
          email: 'test@example.com',
          averageRating: 4.5,
          totalReviews: 100,
        },
        driverId: mockDriver,
        tripManagerId: mockTripManager,
        status: 'scheduled',
        departureTime: new Date('2025-12-15T08:00:00'),
        arrivalTime: new Date('2025-12-15T11:00:00'),
        basePrice: 250000,
        discount: 10,
        finalPrice: 225000,
        totalSeats: 40,
        availableSeats: 30,
        bookedSeats: [
          { seatNumber: 'A1', customerId: 'customer1' },
          { seatNumber: 'A2', customerId: 'customer2' },
        ],
        policies: { cancellation: '24h before departure' },
        cancellationPolicy: { refund: '80% before 24h' },
        notes: 'Test notes',
      };

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockTrip),
      };

      Trip.findOne.mockReturnValue(mockQuery);

      const result = await TripService.getPublicTripDetail(tripId);

      expect(Trip.findOne).toHaveBeenCalledWith({
        _id: tripId,
        status: 'scheduled',
      });

      // Verify structure
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('duration');
      expect(result).toHaveProperty('pricing');
      expect(result).toHaveProperty('seats');
      expect(result).toHaveProperty('route');
      expect(result).toHaveProperty('bus');
      expect(result).toHaveProperty('operator');

      // Verify duration calculation
      expect(result.duration.hours).toBe(3);
      expect(result.duration.minutes).toBe(0);
      expect(result.duration.formatted).toBe('3h 0m');

      // Verify pricing
      expect(result.pricing.basePrice).toBe(250000);
      expect(result.pricing.finalPrice).toBe(225000);

      // Verify seats
      expect(result.seats.total).toBe(40);
      expect(result.seats.available).toBe(30);
      expect(result.seats.booked).toBe(10);
      expect(result.seats.bookedSeatNumbers).toEqual(['A1', 'A2']);
      expect(result.seats.occupancyRate).toBe(25);

      // Verify no sensitive data
      expect(result.driverId).toBeUndefined();
      expect(result.tripManagerId).toBeUndefined();

      // Verify operator info includes rating
      expect(result.operator.rating.average).toBe(4.5);
      expect(result.operator.rating.total).toBe(100);

      // Verify route details
      expect(result.route.pickupPoints).toBeDefined();
      expect(result.route.dropoffPoints).toBeDefined();

      // Verify bus amenities
      expect(result.bus.amenities).toContain('wifi');
      expect(result.bus.seatLayout).toBeDefined();
    });

    it('should throw error if trip not found', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(null),
      };

      Trip.findOne.mockReturnValue(mockQuery);

      await expect(TripService.getPublicTripDetail(tripId)).rejects.toThrow(
        'Không tìm thấy chuyến xe hoặc chuyến không khả dụng'
      );
    });

    it('should handle trips with no booked seats', async () => {
      const mockTrip = {
        _id: tripId,
        routeId: mockRoute,
        busId: mockBus,
        operatorId: {
          _id: operatorId,
          companyName: 'Test Operator',
          averageRating: 4.5,
          totalReviews: 100,
        },
        status: 'scheduled',
        departureTime: new Date('2025-12-15T08:00:00'),
        arrivalTime: new Date('2025-12-15T11:00:00'),
        basePrice: 250000,
        discount: 0,
        finalPrice: 250000,
        totalSeats: 40,
        availableSeats: 40,
        bookedSeats: [],
      };

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockTrip),
      };

      Trip.findOne.mockReturnValue(mockQuery);

      const result = await TripService.getPublicTripDetail(tripId);

      expect(result.seats.bookedSeatNumbers).toEqual([]);
      expect(result.seats.occupancyRate).toBe(0);
    });
  });
});
