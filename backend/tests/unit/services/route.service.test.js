const RouteService = require('../../../src/services/route.service');
const Route = require('../../../src/models/Route');
const BusOperator = require('../../../src/models/BusOperator');

// Mock dependencies
jest.mock('../../../src/models/Route');
jest.mock('../../../src/models/BusOperator');

describe('RouteService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockOperatorId = 'operator123';
  const mockRouteData = {
    routeCode: 'HN-DN-001',
    routeName: 'Hà Nội - Đà Nẵng',
    origin: {
      city: 'Hà Nội',
      province: 'Hà Nội',
      station: 'Bến xe Mỹ Đình',
      coordinates: { lat: 21.0285, lng: 105.8542 },
    },
    destination: {
      city: 'Đà Nẵng',
      province: 'Đà Nẵng',
      station: 'Bến xe Đà Nẵng',
      coordinates: { lat: 16.0544, lng: 108.2022 },
    },
    distance: 760,
    estimatedDuration: 720,
    pickupPoints: [
      { name: 'Bến xe Mỹ Đình', address: '123 Street' },
    ],
    dropoffPoints: [
      { name: 'Bến xe Đà Nẵng', address: '456 Street' },
    ],
  };

  describe('create', () => {
    it('should create route successfully for approved operator', async () => {
      const mockOperator = {
        _id: mockOperatorId,
        verificationStatus: 'approved',
        isSuspended: false,
      };

      BusOperator.findById = jest.fn().mockResolvedValue(mockOperator);
      Route.findByRouteCode = jest.fn().mockResolvedValue(null);

      const mockRoute = {
        _id: 'route123',
        ...mockRouteData,
        operatorId: mockOperatorId,
      };

      Route.create = jest.fn().mockResolvedValue(mockRoute);

      const result = await RouteService.create(mockOperatorId, mockRouteData);

      expect(BusOperator.findById).toHaveBeenCalledWith(mockOperatorId);
      expect(Route.findByRouteCode).toHaveBeenCalledWith(mockRouteData.routeCode);
      expect(Route.create).toHaveBeenCalledWith({
        ...mockRouteData,
        operatorId: mockOperatorId,
      });
      expect(result).toEqual(mockRoute);
    });

    it('should throw error if operator not found', async () => {
      BusOperator.findById = jest.fn().mockResolvedValue(null);

      await expect(RouteService.create(mockOperatorId, mockRouteData)).rejects.toThrow(
        'Nhà xe không tồn tại'
      );
    });

    it('should throw error if operator not approved', async () => {
      const mockOperator = {
        _id: mockOperatorId,
        verificationStatus: 'pending',
        isSuspended: false,
      };

      BusOperator.findById = jest.fn().mockResolvedValue(mockOperator);

      await expect(RouteService.create(mockOperatorId, mockRouteData)).rejects.toThrow(
        'Nhà xe chưa được duyệt'
      );
    });

    it('should throw error if operator is suspended', async () => {
      const mockOperator = {
        _id: mockOperatorId,
        verificationStatus: 'approved',
        isSuspended: true,
      };

      BusOperator.findById = jest.fn().mockResolvedValue(mockOperator);

      await expect(RouteService.create(mockOperatorId, mockRouteData)).rejects.toThrow(
        'Nhà xe đang bị tạm ngưng'
      );
    });

    it('should throw error if route code already exists', async () => {
      const mockOperator = {
        verificationStatus: 'approved',
        isSuspended: false,
      };

      BusOperator.findById = jest.fn().mockResolvedValue(mockOperator);
      Route.findByRouteCode = jest.fn().mockResolvedValue({ routeCode: 'HN-DN-001' });

      await expect(RouteService.create(mockOperatorId, mockRouteData)).rejects.toThrow(
        'Mã tuyến đường đã tồn tại'
      );
    });
  });

  describe('getByOperator', () => {
    it('should get routes for operator with filters', async () => {
      const mockRoutes = [
        { _id: '1', routeName: 'Route 1' },
        { _id: '2', routeName: 'Route 2' },
      ];

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockRoutes),
      };

      Route.find = jest.fn().mockReturnValue(mockQuery);
      Route.countDocuments = jest.fn().mockResolvedValue(2);

      const result = await RouteService.getByOperator(
        mockOperatorId,
        { isActive: true },
        { page: 1, limit: 10 }
      );

      expect(Route.find).toHaveBeenCalledWith({
        operatorId: mockOperatorId,
        isActive: true,
      });
      expect(result.routes).toEqual(mockRoutes);
      expect(result.pagination.total).toBe(2);
    });

    it('should search routes by text', async () => {
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      };

      Route.find = jest.fn().mockReturnValue(mockQuery);
      Route.countDocuments = jest.fn().mockResolvedValue(0);

      await RouteService.getByOperator(
        mockOperatorId,
        { search: 'Hà Nội' },
        {}
      );

      expect(Route.find).toHaveBeenCalledWith(
        expect.objectContaining({
          operatorId: mockOperatorId,
          $or: expect.arrayContaining([
            { routeName: { $regex: 'Hà Nội', $options: 'i' } },
          ]),
        })
      );
    });
  });

  describe('getById', () => {
    it('should get route by ID', async () => {
      const mockRoute = {
        _id: 'route123',
        operatorId: { _id: mockOperatorId },
      };

      const mockQuery = {
        populate: jest.fn().mockResolvedValue(mockRoute),
      };

      Route.findById = jest.fn().mockReturnValue(mockQuery);

      const result = await RouteService.getById('route123');

      expect(Route.findById).toHaveBeenCalledWith('route123');
      expect(result).toEqual(mockRoute);
    });

    it('should throw error if route not found', async () => {
      const mockQuery = {
        populate: jest.fn().mockResolvedValue(null),
      };

      Route.findById = jest.fn().mockReturnValue(mockQuery);

      await expect(RouteService.getById('route123')).rejects.toThrow(
        'Tuyến đường không tồn tại'
      );
    });

    it('should check ownership when operatorId provided', async () => {
      const mockRoute = {
        _id: 'route123',
        operatorId: { _id: 'other-operator' },
      };

      const mockQuery = {
        populate: jest.fn().mockResolvedValue(mockRoute),
      };

      Route.findById = jest.fn().mockReturnValue(mockQuery);

      await expect(RouteService.getById('route123', mockOperatorId)).rejects.toThrow(
        'Bạn không có quyền truy cập tuyến đường này'
      );
    });
  });

  describe('update', () => {
    it('should update route successfully', async () => {
      const mockRoute = {
        _id: 'route123',
        operatorId: mockOperatorId,
        routeCode: 'HN-DN-001',
        save: jest.fn().mockResolvedValue(true),
      };

      Route.findById = jest.fn().mockResolvedValue(mockRoute);

      const updateData = {
        distance: 800,
        estimatedDuration: 750,
      };

      const result = await RouteService.update('route123', mockOperatorId, updateData);

      expect(mockRoute.save).toHaveBeenCalled();
      expect(mockRoute.distance).toBe(800);
    });

    it('should throw error if not owner', async () => {
      const mockRoute = {
        operatorId: 'other-operator',
      };

      Route.findById = jest.fn().mockResolvedValue(mockRoute);

      await expect(
        RouteService.update('route123', mockOperatorId, {})
      ).rejects.toThrow('Bạn không có quyền cập nhật tuyến đường này');
    });

    it('should check route code duplicates when changing', async () => {
      const mockRoute = {
        operatorId: mockOperatorId,
        routeCode: 'HN-DN-001',
      };

      Route.findById = jest.fn().mockResolvedValue(mockRoute);
      Route.findByRouteCode = jest.fn().mockResolvedValue({ routeCode: 'HN-DN-002' });

      await expect(
        RouteService.update('route123', mockOperatorId, { routeCode: 'HN-DN-002' })
      ).rejects.toThrow('Mã tuyến đường đã tồn tại');
    });
  });

  describe('delete', () => {
    it('should deactivate route on delete', async () => {
      const mockRoute = {
        _id: 'route123',
        operatorId: mockOperatorId,
        deactivate: jest.fn().mockResolvedValue(true),
      };

      Route.findById = jest.fn().mockResolvedValue(mockRoute);

      await RouteService.delete('route123', mockOperatorId);

      expect(mockRoute.deactivate).toHaveBeenCalled();
    });

    it('should throw error if not owner', async () => {
      const mockRoute = {
        operatorId: 'other-operator',
      };

      Route.findById = jest.fn().mockResolvedValue(mockRoute);

      await expect(RouteService.delete('route123', mockOperatorId)).rejects.toThrow(
        'Bạn không có quyền xóa tuyến đường này'
      );
    });
  });

  describe('toggleActive', () => {
    it('should activate route', async () => {
      const mockRoute = {
        operatorId: mockOperatorId,
        activate: jest.fn().mockResolvedValue(true),
      };

      Route.findById = jest.fn().mockResolvedValue(mockRoute);

      await RouteService.toggleActive('route123', mockOperatorId, true);

      expect(mockRoute.activate).toHaveBeenCalled();
    });

    it('should deactivate route', async () => {
      const mockRoute = {
        operatorId: mockOperatorId,
        deactivate: jest.fn().mockResolvedValue(true),
      };

      Route.findById = jest.fn().mockResolvedValue(mockRoute);

      await RouteService.toggleActive('route123', mockOperatorId, false);

      expect(mockRoute.deactivate).toHaveBeenCalled();
    });
  });

  describe('search', () => {
    it('should search routes by cities', async () => {
      const mockRoutes = [{ _id: '1', routeName: 'Route 1' }];

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockRoutes),
      };

      Route.find = jest.fn().mockReturnValue(mockQuery);
      Route.countDocuments = jest.fn().mockResolvedValue(1);

      const result = await RouteService.search(
        { originCity: 'Hà Nội', destinationCity: 'Đà Nẵng' },
        {}
      );

      expect(Route.find).toHaveBeenCalledWith(
        expect.objectContaining({
          isActive: true,
          'origin.city': { $regex: 'Hà Nội', $options: 'i' },
          'destination.city': { $regex: 'Đà Nẵng', $options: 'i' },
        })
      );
      expect(result.routes).toEqual(mockRoutes);
    });
  });

  describe('addPickupPoint', () => {
    it('should add pickup point successfully', async () => {
      const mockRoute = {
        operatorId: mockOperatorId,
        addPickupPoint: jest.fn().mockResolvedValue(true),
      };

      Route.findById = jest.fn().mockResolvedValue(mockRoute);

      const point = { name: 'New Point', address: '123 Street' };
      await RouteService.addPickupPoint('route123', mockOperatorId, point);

      expect(mockRoute.addPickupPoint).toHaveBeenCalledWith(point);
    });
  });

  describe('addDropoffPoint', () => {
    it('should add dropoff point successfully', async () => {
      const mockRoute = {
        operatorId: mockOperatorId,
        addDropoffPoint: jest.fn().mockResolvedValue(true),
      };

      Route.findById = jest.fn().mockResolvedValue(mockRoute);

      const point = { name: 'New Point', address: '123 Street' };
      await RouteService.addDropoffPoint('route123', mockOperatorId, point);

      expect(mockRoute.addDropoffPoint).toHaveBeenCalledWith(point);
    });
  });
});
