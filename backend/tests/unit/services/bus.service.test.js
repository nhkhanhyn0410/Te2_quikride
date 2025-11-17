const BusService = require('../../../src/services/bus.service');
const Bus = require('../../../src/models/Bus');
const BusOperator = require('../../../src/models/BusOperator');

// Mock dependencies
jest.mock('../../../src/models/Bus');
jest.mock('../../../src/models/BusOperator');

describe('BusService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockOperatorId = 'operator123';
  const mockBusData = {
    busNumber: '29A-12345',
    busType: 'sleeper',
    seatLayout: {
      floors: 1,
      rows: 10,
      columns: 4,
      layout: [
        ['A1', 'A2', 'A3', 'A4'],
        ['B1', 'B2', 'B3', 'B4'],
        ['C1', 'C2', 'C3', 'C4'],
        ['D1', 'D2', 'D3', 'D4'],
        ['E1', 'E2', 'E3', 'E4'],
        ['F1', 'F2', 'F3', 'F4'],
        ['G1', 'G2', 'G3', 'G4'],
        ['H1', 'H2', 'H3', 'H4'],
        ['I1', 'I2', 'I3', 'I4'],
        ['J1', 'J2', 'J3', 'J4'],
      ],
      totalSeats: 40,
    },
    amenities: ['wifi', 'ac', 'toilet'],
    status: 'active',
  };

  describe('create', () => {
    it('should create bus successfully for approved operator', async () => {
      const mockOperator = {
        _id: mockOperatorId,
        verificationStatus: 'approved',
        isSuspended: false,
      };

      BusOperator.findById = jest.fn().mockResolvedValue(mockOperator);
      Bus.findByBusNumber = jest.fn().mockResolvedValue(null);

      const mockBus = {
        _id: 'bus123',
        ...mockBusData,
        operatorId: mockOperatorId,
      };

      Bus.create = jest.fn().mockResolvedValue(mockBus);

      const result = await BusService.create(mockOperatorId, mockBusData);

      expect(BusOperator.findById).toHaveBeenCalledWith(mockOperatorId);
      expect(Bus.findByBusNumber).toHaveBeenCalledWith(mockBusData.busNumber);
      expect(Bus.create).toHaveBeenCalledWith({
        ...mockBusData,
        operatorId: mockOperatorId,
      });
      expect(result).toEqual(mockBus);
    });

    it('should throw error if operator not found', async () => {
      BusOperator.findById = jest.fn().mockResolvedValue(null);

      await expect(BusService.create(mockOperatorId, mockBusData)).rejects.toThrow(
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

      await expect(BusService.create(mockOperatorId, mockBusData)).rejects.toThrow(
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

      await expect(BusService.create(mockOperatorId, mockBusData)).rejects.toThrow(
        'Nhà xe đang bị tạm ngưng'
      );
    });

    it('should throw error if bus number already exists', async () => {
      const mockOperator = {
        verificationStatus: 'approved',
        isSuspended: false,
      };

      BusOperator.findById = jest.fn().mockResolvedValue(mockOperator);
      Bus.findByBusNumber = jest.fn().mockResolvedValue({ busNumber: '29A-12345' });

      await expect(BusService.create(mockOperatorId, mockBusData)).rejects.toThrow(
        'Biển số xe đã tồn tại'
      );
    });

    it('should throw error if seat layout rows do not match', async () => {
      const mockOperator = {
        verificationStatus: 'approved',
        isSuspended: false,
      };

      BusOperator.findById = jest.fn().mockResolvedValue(mockOperator);
      Bus.findByBusNumber = jest.fn().mockResolvedValue(null);

      const invalidBusData = {
        ...mockBusData,
        seatLayout: {
          floors: 1,
          rows: 5, // Declared 5 rows but layout has 10
          columns: 4,
          layout: mockBusData.seatLayout.layout,
        },
      };

      await expect(BusService.create(mockOperatorId, invalidBusData)).rejects.toThrow(
        /Số hàng trong sơ đồ.*không khớp/
      );
    });

    it('should throw error if seat layout columns do not match', async () => {
      const mockOperator = {
        verificationStatus: 'approved',
        isSuspended: false,
      };

      BusOperator.findById = jest.fn().mockResolvedValue(mockOperator);
      Bus.findByBusNumber = jest.fn().mockResolvedValue(null);

      const invalidBusData = {
        ...mockBusData,
        seatLayout: {
          floors: 1,
          rows: 10,
          columns: 3, // Declared 3 columns but layout has 4
          layout: mockBusData.seatLayout.layout,
        },
      };

      await expect(BusService.create(mockOperatorId, invalidBusData)).rejects.toThrow(
        /Số cột.*không khớp/
      );
    });

    it('should throw error if double_decker bus does not have 2 floors', async () => {
      const mockOperator = {
        verificationStatus: 'approved',
        isSuspended: false,
      };

      BusOperator.findById = jest.fn().mockResolvedValue(mockOperator);
      Bus.findByBusNumber = jest.fn().mockResolvedValue(null);

      const invalidBusData = {
        ...mockBusData,
        busType: 'double_decker',
        seatLayout: {
          ...mockBusData.seatLayout,
          floors: 1, // Should be 2 for double_decker
        },
      };

      await expect(BusService.create(mockOperatorId, invalidBusData)).rejects.toThrow(
        'Xe 2 tầng phải có 2 tầng ghế'
      );
    });
  });

  describe('getByOperator', () => {
    it('should get buses for operator with filters', async () => {
      const mockBuses = [
        { _id: '1', busNumber: '29A-12345' },
        { _id: '2', busNumber: '29A-67890' },
      ];

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockBuses),
      };

      Bus.find = jest.fn().mockReturnValue(mockQuery);
      Bus.countDocuments = jest.fn().mockResolvedValue(2);

      const result = await BusService.getByOperator(
        mockOperatorId,
        { status: 'active' },
        { page: 1, limit: 10 }
      );

      expect(Bus.find).toHaveBeenCalledWith({
        operatorId: mockOperatorId,
        status: 'active',
      });
      expect(result.buses).toEqual(mockBuses);
      expect(result.pagination.total).toBe(2);
    });

    it('should filter by bus type', async () => {
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      };

      Bus.find = jest.fn().mockReturnValue(mockQuery);
      Bus.countDocuments = jest.fn().mockResolvedValue(0);

      await BusService.getByOperator(
        mockOperatorId,
        { busType: 'sleeper' },
        {}
      );

      expect(Bus.find).toHaveBeenCalledWith({
        operatorId: mockOperatorId,
        busType: 'sleeper',
      });
    });

    it('should search buses by bus number', async () => {
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      };

      Bus.find = jest.fn().mockReturnValue(mockQuery);
      Bus.countDocuments = jest.fn().mockResolvedValue(0);

      await BusService.getByOperator(
        mockOperatorId,
        { search: '29A' },
        {}
      );

      expect(Bus.find).toHaveBeenCalledWith(
        expect.objectContaining({
          operatorId: mockOperatorId,
          $or: expect.arrayContaining([
            { busNumber: { $regex: '29A', $options: 'i' } },
          ]),
        })
      );
    });
  });

  describe('getById', () => {
    it('should get bus by ID', async () => {
      const mockBus = {
        _id: 'bus123',
        operatorId: { _id: mockOperatorId },
      };

      const mockQuery = {
        populate: jest.fn().mockResolvedValue(mockBus),
      };

      Bus.findById = jest.fn().mockReturnValue(mockQuery);

      const result = await BusService.getById('bus123');

      expect(Bus.findById).toHaveBeenCalledWith('bus123');
      expect(result).toEqual(mockBus);
    });

    it('should throw error if bus not found', async () => {
      const mockQuery = {
        populate: jest.fn().mockResolvedValue(null),
      };

      Bus.findById = jest.fn().mockReturnValue(mockQuery);

      await expect(BusService.getById('bus123')).rejects.toThrow(
        'Xe không tồn tại'
      );
    });

    it('should check ownership when operatorId provided', async () => {
      const mockBus = {
        _id: 'bus123',
        operatorId: { _id: 'other-operator' },
      };

      const mockQuery = {
        populate: jest.fn().mockResolvedValue(mockBus),
      };

      Bus.findById = jest.fn().mockReturnValue(mockQuery);

      await expect(BusService.getById('bus123', mockOperatorId)).rejects.toThrow(
        'Bạn không có quyền truy cập xe này'
      );
    });
  });

  describe('update', () => {
    it('should update bus successfully', async () => {
      const mockBus = {
        _id: 'bus123',
        operatorId: mockOperatorId,
        busNumber: '29A-12345',
        busType: 'sleeper',
        seatLayout: mockBusData.seatLayout,
        save: jest.fn().mockResolvedValue(true),
      };

      Bus.findById = jest.fn().mockResolvedValue(mockBus);

      const updateData = {
        amenities: ['wifi', 'ac', 'toilet', 'tv'],
      };

      const result = await BusService.update('bus123', mockOperatorId, updateData);

      expect(mockBus.save).toHaveBeenCalled();
      expect(mockBus.amenities).toEqual(['wifi', 'ac', 'toilet', 'tv']);
    });

    it('should throw error if not owner', async () => {
      const mockBus = {
        operatorId: 'other-operator',
      };

      Bus.findById = jest.fn().mockResolvedValue(mockBus);

      await expect(
        BusService.update('bus123', mockOperatorId, {})
      ).rejects.toThrow('Bạn không có quyền cập nhật xe này');
    });

    it('should check bus number duplicates when changing', async () => {
      const mockBus = {
        operatorId: mockOperatorId,
        busNumber: '29A-12345',
        seatLayout: mockBusData.seatLayout,
        busType: 'sleeper',
      };

      Bus.findById = jest.fn().mockResolvedValue(mockBus);
      Bus.findByBusNumber = jest.fn().mockResolvedValue({ busNumber: '29A-67890' });

      await expect(
        BusService.update('bus123', mockOperatorId, { busNumber: '29A-67890' })
      ).rejects.toThrow('Biển số xe đã tồn tại');
    });
  });

  describe('delete', () => {
    it('should retire bus on delete', async () => {
      const mockBus = {
        _id: 'bus123',
        operatorId: mockOperatorId,
        retire: jest.fn().mockResolvedValue(true),
      };

      Bus.findById = jest.fn().mockResolvedValue(mockBus);

      await BusService.delete('bus123', mockOperatorId);

      expect(mockBus.retire).toHaveBeenCalled();
    });

    it('should throw error if not owner', async () => {
      const mockBus = {
        operatorId: 'other-operator',
      };

      Bus.findById = jest.fn().mockResolvedValue(mockBus);

      await expect(BusService.delete('bus123', mockOperatorId)).rejects.toThrow(
        'Bạn không có quyền xóa xe này'
      );
    });
  });

  describe('changeStatus', () => {
    it('should change bus status to maintenance', async () => {
      const mockBus = {
        operatorId: mockOperatorId,
        status: 'active',
        save: jest.fn().mockResolvedValue(true),
      };

      Bus.findById = jest.fn().mockResolvedValue(mockBus);

      await BusService.changeStatus('bus123', mockOperatorId, 'maintenance');

      expect(mockBus.status).toBe('maintenance');
      expect(mockBus.save).toHaveBeenCalled();
    });

    it('should throw error for invalid status', async () => {
      const mockBus = {
        operatorId: mockOperatorId,
      };

      Bus.findById = jest.fn().mockResolvedValue(mockBus);

      await expect(
        BusService.changeStatus('bus123', mockOperatorId, 'invalid-status')
      ).rejects.toThrow('Trạng thái không hợp lệ');
    });
  });

  describe('getStatistics', () => {
    it('should get bus statistics for operator', async () => {
      Bus.countDocuments = jest
        .fn()
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(7)  // active
        .mockResolvedValueOnce(2)  // maintenance
        .mockResolvedValueOnce(1); // retired

      Bus.aggregate = jest
        .fn()
        .mockResolvedValueOnce([
          { _id: 'sleeper', count: 5 },
          { _id: 'seater', count: 3 },
          { _id: 'limousine', count: 2 },
        ])
        .mockResolvedValueOnce([
          { _id: null, totalSeats: 280 },
        ]);

      const result = await BusService.getStatistics(mockOperatorId);

      expect(result.totalBuses).toBe(10);
      expect(result.activeBuses).toBe(7);
      expect(result.maintenanceBuses).toBe(2);
      expect(result.retiredBuses).toBe(1);
      expect(result.busesByType).toEqual({
        sleeper: 5,
        seater: 3,
        limousine: 2,
      });
      expect(result.totalSeatCapacity).toBe(280);
    });
  });

  describe('search', () => {
    it('should search buses by bus type', async () => {
      const mockBuses = [{ _id: '1', busType: 'sleeper' }];

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockBuses),
      };

      Bus.find = jest.fn().mockReturnValue(mockQuery);
      Bus.countDocuments = jest.fn().mockResolvedValue(1);

      const result = await BusService.search(
        { busType: 'sleeper' },
        {}
      );

      expect(Bus.find).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'active',
          busType: 'sleeper',
        })
      );
      expect(result.buses).toEqual(mockBuses);
    });

    it('should filter by seat capacity', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      };

      Bus.find = jest.fn().mockReturnValue(mockQuery);
      Bus.countDocuments = jest.fn().mockResolvedValue(0);

      await BusService.search(
        { minSeats: 30, maxSeats: 50 },
        {}
      );

      expect(Bus.find).toHaveBeenCalledWith(
        expect.objectContaining({
          'seatLayout.totalSeats': { $gte: 30, $lte: 50 },
        })
      );
    });

    it('should filter by amenities', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      };

      Bus.find = jest.fn().mockReturnValue(mockQuery);
      Bus.countDocuments = jest.fn().mockResolvedValue(0);

      await BusService.search(
        { amenities: ['wifi', 'ac'] },
        {}
      );

      expect(Bus.find).toHaveBeenCalledWith(
        expect.objectContaining({
          amenities: { $all: ['wifi', 'ac'] },
        })
      );
    });
  });
});
