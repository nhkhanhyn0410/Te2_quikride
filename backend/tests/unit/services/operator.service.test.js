const OperatorService = require('../../../src/services/operator.service');
const BusOperator = require('../../../src/models/BusOperator');
const AuthService = require('../../../src/services/auth.service');

// Mock dependencies
jest.mock('../../../src/models/BusOperator');
jest.mock('../../../src/services/auth.service');

describe('OperatorService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const mockOperatorData = {
      companyName: 'Test Bus Company',
      email: 'test@buscompany.com',
      phone: '0901234567',
      password: 'Password123',
      businessLicense: 'BL123456',
      taxCode: 'TAX123456',
      address: {
        street: '123 Test Street',
        city: 'Ho Chi Minh',
        country: 'Vietnam',
      },
      bankInfo: {
        bankName: 'Test Bank',
        accountNumber: '123456789',
        accountHolder: 'Test Company',
      },
      description: 'Test bus company',
      website: 'https://testbus.com',
    };

    it('should register a new operator successfully', async () => {
      // Mock no existing operator
      BusOperator.findByEmail = jest.fn().mockResolvedValue(null);
      BusOperator.findByCompanyName = jest.fn().mockResolvedValue(null);

      // Mock operator creation
      const mockOperator = {
        _id: '123',
        ...mockOperatorData,
        email: mockOperatorData.email.toLowerCase(),
        verificationStatus: 'pending',
        toObject: jest.fn().mockReturnValue({
          _id: '123',
          ...mockOperatorData,
          email: mockOperatorData.email.toLowerCase(),
        }),
      };

      BusOperator.create = jest.fn().mockResolvedValue(mockOperator);

      // Mock token generation
      AuthService.generateAccessToken = jest.fn().mockReturnValue('access-token');
      AuthService.generateRefreshToken = jest.fn().mockReturnValue('refresh-token');

      const result = await OperatorService.register(mockOperatorData);

      expect(BusOperator.findByEmail).toHaveBeenCalledWith(mockOperatorData.email);
      expect(BusOperator.findByCompanyName).toHaveBeenCalledWith(mockOperatorData.companyName);
      expect(BusOperator.create).toHaveBeenCalled();
      expect(result.operator).toBeDefined();
      expect(result.operator.password).toBeUndefined();
      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
    });

    it('should throw error if email already exists', async () => {
      const existingOperator = { email: mockOperatorData.email };
      BusOperator.findByEmail = jest.fn().mockResolvedValue(existingOperator);

      await expect(OperatorService.register(mockOperatorData)).rejects.toThrow(
        'Email đã được sử dụng'
      );
    });

    it('should throw error if company name already exists', async () => {
      BusOperator.findByEmail = jest.fn().mockResolvedValue(null);
      BusOperator.findByCompanyName = jest.fn().mockResolvedValue({
        companyName: mockOperatorData.companyName,
      });

      await expect(OperatorService.register(mockOperatorData)).rejects.toThrow(
        'Tên công ty đã được sử dụng'
      );
    });
  });

  describe('login', () => {
    const mockEmail = 'test@buscompany.com';
    const mockPassword = 'Password123';

    it('should login successfully with valid credentials', async () => {
      const mockOperator = {
        _id: '123',
        email: mockEmail,
        companyName: 'Test Company',
        isSuspended: false,
        isActive: true,
        comparePassword: jest.fn().mockResolvedValue(true),
        toObject: jest.fn().mockReturnValue({
          _id: '123',
          email: mockEmail,
          companyName: 'Test Company',
        }),
      };

      BusOperator.findByEmail = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockOperator),
      });

      AuthService.generateAccessToken = jest.fn().mockReturnValue('access-token');
      AuthService.generateRefreshToken = jest.fn().mockReturnValue('refresh-token');

      const result = await OperatorService.login(mockEmail, mockPassword);

      expect(BusOperator.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(mockOperator.comparePassword).toHaveBeenCalledWith(mockPassword);
      expect(result.operator).toBeDefined();
      expect(result.operator.password).toBeUndefined();
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should throw error if operator not found', async () => {
      BusOperator.findByEmail = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await expect(OperatorService.login(mockEmail, mockPassword)).rejects.toThrow(
        'Email hoặc mật khẩu không đúng'
      );
    });

    it('should throw error if operator is suspended', async () => {
      const mockOperator = {
        isSuspended: true,
        suspensionReason: 'Violation of terms',
        isActive: true,
      };

      BusOperator.findByEmail = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockOperator),
      });

      await expect(OperatorService.login(mockEmail, mockPassword)).rejects.toThrow(
        'Tài khoản đã bị tạm ngưng'
      );
    });

    it('should throw error if operator is inactive', async () => {
      const mockOperator = {
        isSuspended: false,
        isActive: false,
      };

      BusOperator.findByEmail = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockOperator),
      });

      await expect(OperatorService.login(mockEmail, mockPassword)).rejects.toThrow(
        'Tài khoản không hoạt động'
      );
    });

    it('should throw error if password is incorrect', async () => {
      const mockOperator = {
        isSuspended: false,
        isActive: true,
        comparePassword: jest.fn().mockResolvedValue(false),
      };

      BusOperator.findByEmail = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockOperator),
      });

      await expect(OperatorService.login(mockEmail, mockPassword)).rejects.toThrow(
        'Email hoặc mật khẩu không đúng'
      );
    });
  });

  describe('approve', () => {
    it('should approve operator successfully', async () => {
      const mockOperator = {
        _id: '123',
        verificationStatus: 'pending',
        approve: jest.fn().mockResolvedValue(true),
      };

      BusOperator.findById = jest.fn().mockResolvedValue(mockOperator);

      await OperatorService.approve('123', 'admin-id');

      expect(BusOperator.findById).toHaveBeenCalledWith('123');
      expect(mockOperator.approve).toHaveBeenCalledWith('admin-id');
    });

    it('should throw error if operator not found', async () => {
      BusOperator.findById = jest.fn().mockResolvedValue(null);

      await expect(OperatorService.approve('123', 'admin-id')).rejects.toThrow(
        'Nhà xe không tồn tại'
      );
    });

    it('should throw error if operator already approved', async () => {
      const mockOperator = {
        verificationStatus: 'approved',
      };

      BusOperator.findById = jest.fn().mockResolvedValue(mockOperator);

      await expect(OperatorService.approve('123', 'admin-id')).rejects.toThrow(
        'Nhà xe đã được duyệt'
      );
    });
  });

  describe('reject', () => {
    it('should reject operator successfully', async () => {
      const mockOperator = {
        _id: '123',
        verificationStatus: 'pending',
        reject: jest.fn().mockResolvedValue(true),
      };

      BusOperator.findById = jest.fn().mockResolvedValue(mockOperator);

      await OperatorService.reject('123', 'admin-id', 'Invalid documents');

      expect(BusOperator.findById).toHaveBeenCalledWith('123');
      expect(mockOperator.reject).toHaveBeenCalledWith('admin-id', 'Invalid documents');
    });

    it('should throw error if no reason provided', async () => {
      const mockOperator = { _id: '123' };
      BusOperator.findById = jest.fn().mockResolvedValue(mockOperator);

      await expect(OperatorService.reject('123', 'admin-id', '')).rejects.toThrow(
        'Vui lòng cung cấp lý do từ chối'
      );
    });
  });

  describe('suspend', () => {
    it('should suspend operator successfully', async () => {
      const mockOperator = {
        _id: '123',
        isSuspended: false,
        suspend: jest.fn().mockResolvedValue(true),
      };

      BusOperator.findById = jest.fn().mockResolvedValue(mockOperator);

      await OperatorService.suspend('123', 'Violation of terms');

      expect(mockOperator.suspend).toHaveBeenCalledWith('Violation of terms');
    });

    it('should throw error if operator already suspended', async () => {
      const mockOperator = {
        isSuspended: true,
      };

      BusOperator.findById = jest.fn().mockResolvedValue(mockOperator);

      await expect(OperatorService.suspend('123', 'reason')).rejects.toThrow(
        'Nhà xe đã bị tạm ngưng'
      );
    });
  });

  describe('resume', () => {
    it('should resume operator successfully', async () => {
      const mockOperator = {
        _id: '123',
        isSuspended: true,
        resume: jest.fn().mockResolvedValue(true),
      };

      BusOperator.findById = jest.fn().mockResolvedValue(mockOperator);

      await OperatorService.resume('123');

      expect(mockOperator.resume).toHaveBeenCalled();
    });

    it('should throw error if operator not suspended', async () => {
      const mockOperator = {
        isSuspended: false,
      };

      BusOperator.findById = jest.fn().mockResolvedValue(mockOperator);

      await expect(OperatorService.resume('123')).rejects.toThrow(
        'Nhà xe không bị tạm ngưng'
      );
    });
  });

  describe('getAll', () => {
    it('should get all operators with filters', async () => {
      const mockOperators = [
        { _id: '1', companyName: 'Company 1' },
        { _id: '2', companyName: 'Company 2' },
      ];

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockOperators),
      };

      BusOperator.find = jest.fn().mockReturnValue(mockQuery);
      BusOperator.countDocuments = jest.fn().mockResolvedValue(2);

      const result = await OperatorService.getAll(
        { verificationStatus: 'pending' },
        { page: 1, limit: 10 }
      );

      expect(BusOperator.find).toHaveBeenCalledWith({ verificationStatus: 'pending' });
      expect(result.operators).toEqual(mockOperators);
      expect(result.pagination.total).toBe(2);
    });
  });
});
