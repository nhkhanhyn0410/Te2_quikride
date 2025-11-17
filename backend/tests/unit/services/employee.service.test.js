// Mock the models FIRST
jest.mock('../../../src/models/Employee');
jest.mock('../../../src/models/BusOperator');

// Then require everything
const EmployeeService = require('../../../src/services/employee.service');
const Employee = require('../../../src/models/Employee');
const BusOperator = require('../../../src/models/BusOperator');

describe('EmployeeService', () => {
  const mockOperatorId = '507f1f77bcf86cd799439011';
  const mockEmployeeId = '507f1f77bcf86cd799439012';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new driver employee', async () => {
      const employeeData = {
        employeeCode: 'DRV001',
        fullName: 'Nguyễn Văn A',
        phone: '0901234567',
        password: 'password123',
        role: 'driver',
        licenseNumber: 'ABC123456',
        licenseClass: 'D',
        licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      };

      BusOperator.findById.mockResolvedValue({ _id: mockOperatorId });
      Employee.findOne.mockResolvedValue(null); // No existing employee
      Employee.create.mockResolvedValue({ _id: mockEmployeeId, ...employeeData });
      Employee.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue({ _id: mockEmployeeId, ...employeeData }),
      });

      const result = await EmployeeService.create(mockOperatorId, employeeData);

      expect(BusOperator.findById).toHaveBeenCalledWith(mockOperatorId);
      expect(Employee.findOne).toHaveBeenCalledWith({
        operatorId: mockOperatorId,
        employeeCode: 'DRV001',
      });
      expect(Employee.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should create a new trip_manager employee', async () => {
      const employeeData = {
        employeeCode: 'TM001',
        fullName: 'Trần Thị B',
        phone: '0909876543',
        password: 'password123',
        role: 'trip_manager',
      };

      BusOperator.findById.mockResolvedValue({ _id: mockOperatorId });
      Employee.findOne.mockResolvedValue(null);
      Employee.create.mockResolvedValue({ _id: mockEmployeeId, ...employeeData });
      Employee.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue({ _id: mockEmployeeId, ...employeeData }),
      });

      const result = await EmployeeService.create(mockOperatorId, employeeData);

      expect(result).toBeDefined();
    });

    it('should throw error if operator does not exist', async () => {
      BusOperator.findById.mockResolvedValue(null);

      await expect(
        EmployeeService.create(mockOperatorId, {}),
      ).rejects.toThrow('Nhà xe không tồn tại');
    });

    it('should throw error if driver missing license number', async () => {
      const employeeData = {
        employeeCode: 'DRV001',
        fullName: 'Nguyễn Văn A',
        phone: '0901234567',
        password: 'password123',
        role: 'driver',
        // Missing licenseNumber
        licenseClass: 'D',
        licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      };

      BusOperator.findById.mockResolvedValue({ _id: mockOperatorId });

      await expect(
        EmployeeService.create(mockOperatorId, employeeData),
      ).rejects.toThrow('Số giấy phép lái xe là bắt buộc cho tài xế');
    });

    it('should throw error if driver missing license class', async () => {
      const employeeData = {
        employeeCode: 'DRV001',
        fullName: 'Nguyễn Văn A',
        phone: '0901234567',
        password: 'password123',
        role: 'driver',
        licenseNumber: 'ABC123456',
        // Missing licenseClass
        licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      };

      BusOperator.findById.mockResolvedValue({ _id: mockOperatorId });

      await expect(
        EmployeeService.create(mockOperatorId, employeeData),
      ).rejects.toThrow('Hạng giấy phép là bắt buộc cho tài xế');
    });

    it('should throw error if driver missing license expiry', async () => {
      const employeeData = {
        employeeCode: 'DRV001',
        fullName: 'Nguyễn Văn A',
        phone: '0901234567',
        password: 'password123',
        role: 'driver',
        licenseNumber: 'ABC123456',
        licenseClass: 'D',
        // Missing licenseExpiry
      };

      BusOperator.findById.mockResolvedValue({ _id: mockOperatorId });

      await expect(
        EmployeeService.create(mockOperatorId, employeeData),
      ).rejects.toThrow('Ngày hết hạn giấy phép là bắt buộc cho tài xế');
    });

    it('should throw error if driver license is expired', async () => {
      const employeeData = {
        employeeCode: 'DRV001',
        fullName: 'Nguyễn Văn A',
        phone: '0901234567',
        password: 'password123',
        role: 'driver',
        licenseNumber: 'ABC123456',
        licenseClass: 'D',
        licenseExpiry: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      };

      BusOperator.findById.mockResolvedValue({ _id: mockOperatorId });

      await expect(
        EmployeeService.create(mockOperatorId, employeeData),
      ).rejects.toThrow('Giấy phép lái xe đã hết hạn');
    });

    it('should throw error if employee code already exists', async () => {
      const employeeData = {
        employeeCode: 'DRV001',
        fullName: 'Nguyễn Văn A',
        phone: '0901234567',
        password: 'password123',
        role: 'driver',
        licenseNumber: 'ABC123456',
        licenseClass: 'D',
        licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      };

      BusOperator.findById.mockResolvedValue({ _id: mockOperatorId });
      Employee.findOne.mockResolvedValue({ _id: mockEmployeeId }); // Existing employee

      await expect(
        EmployeeService.create(mockOperatorId, employeeData),
      ).rejects.toThrow('Mã nhân viên đã tồn tại');
    });
  });

  describe('getByOperator', () => {
    it('should get employees with pagination', async () => {
      const mockEmployees = [
        { _id: '1', fullName: 'Employee 1', role: 'driver' },
        { _id: '2', fullName: 'Employee 2', role: 'trip_manager' },
      ];

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockEmployees),
      };

      Employee.find.mockReturnValue(mockQuery);
      Employee.countDocuments.mockResolvedValue(2);

      const result = await EmployeeService.getByOperator(mockOperatorId);

      expect(result.employees).toEqual(mockEmployees);
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.page).toBe(1);
    });

    it('should filter by role', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      };

      Employee.find.mockReturnValue(mockQuery);
      Employee.countDocuments.mockResolvedValue(0);

      await EmployeeService.getByOperator(mockOperatorId, { role: 'driver' });

      expect(Employee.find).toHaveBeenCalledWith({
        operatorId: mockOperatorId,
        role: 'driver',
      });
    });

    it('should filter by status', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      };

      Employee.find.mockReturnValue(mockQuery);
      Employee.countDocuments.mockResolvedValue(0);

      await EmployeeService.getByOperator(mockOperatorId, { status: 'active' });

      expect(Employee.find).toHaveBeenCalledWith({
        operatorId: mockOperatorId,
        status: 'active',
      });
    });

    it('should search by name, code, or phone', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      };

      Employee.find.mockReturnValue(mockQuery);
      Employee.countDocuments.mockResolvedValue(0);

      await EmployeeService.getByOperator(mockOperatorId, { search: 'Nguyen' });

      expect(Employee.find).toHaveBeenCalledWith({
        operatorId: mockOperatorId,
        $or: [
          { fullName: expect.any(RegExp) },
          { employeeCode: expect.any(RegExp) },
          { phone: expect.any(RegExp) },
        ],
      });
    });
  });

  describe('getById', () => {
    it('should get employee by id', async () => {
      const mockEmployee = {
        _id: mockEmployeeId,
        fullName: 'Employee 1',
      };

      const mockQuery = {
        select: jest.fn().mockResolvedValue(mockEmployee),
      };

      Employee.findOne.mockReturnValue(mockQuery);

      const result = await EmployeeService.getById(
        mockEmployeeId,
        mockOperatorId,
      );

      expect(result).toEqual(mockEmployee);
      expect(Employee.findOne).toHaveBeenCalledWith({
        _id: mockEmployeeId,
        operatorId: mockOperatorId,
      });
    });

    it('should throw error if employee not found', async () => {
      const mockQuery = {
        select: jest.fn().mockResolvedValue(null),
      };

      Employee.findOne.mockReturnValue(mockQuery);

      await expect(
        EmployeeService.getById(mockEmployeeId, mockOperatorId),
      ).rejects.toThrow('Không tìm thấy nhân viên');
    });
  });

  describe('update', () => {
    it('should update employee', async () => {
      const mockEmployee = {
        _id: mockEmployeeId,
        fullName: 'Old Name',
        role: 'driver',
        licenseNumber: 'ABC123',
        licenseClass: 'D',
        licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        save: jest.fn().mockResolvedValue(true),
      };

      const updateData = { fullName: 'New Name' };

      Employee.findOne.mockResolvedValue(mockEmployee);
      Employee.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue({ ...mockEmployee, ...updateData }),
      });

      const result = await EmployeeService.update(
        mockEmployeeId,
        mockOperatorId,
        updateData,
      );

      expect(mockEmployee.save).toHaveBeenCalled();
      expect(result.fullName).toBe('New Name');
    });

    it('should prevent changing operatorId', async () => {
      const mockEmployee = {
        _id: mockEmployeeId,
        operatorId: mockOperatorId,
        role: 'driver',
        save: jest.fn().mockResolvedValue(true),
      };

      Employee.findOne.mockResolvedValue(mockEmployee);
      Employee.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockEmployee),
      });

      await EmployeeService.update(mockEmployeeId, mockOperatorId, {
        operatorId: 'newOperatorId',
      });

      expect(mockEmployee.operatorId).toBe(mockOperatorId);
    });

    it('should prevent changing employeeCode', async () => {
      const mockEmployee = {
        _id: mockEmployeeId,
        employeeCode: 'EMP001',
        role: 'driver',
        save: jest.fn().mockResolvedValue(true),
      };

      Employee.findOne.mockResolvedValue(mockEmployee);
      Employee.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockEmployee),
      });

      await EmployeeService.update(mockEmployeeId, mockOperatorId, {
        employeeCode: 'EMP002',
      });

      expect(mockEmployee.employeeCode).toBe('EMP001');
    });

    it('should validate driver fields when changing to driver role', async () => {
      const mockEmployee = {
        _id: mockEmployeeId,
        role: 'trip_manager',
        save: jest.fn(),
      };

      Employee.findOne.mockResolvedValue(mockEmployee);

      await expect(
        EmployeeService.update(mockEmployeeId, mockOperatorId, { role: 'driver' }),
      ).rejects.toThrow('Tài xế phải có đầy đủ thông tin giấy phép lái xe');
    });

    it('should reject expired license when updating driver', async () => {
      const mockEmployee = {
        _id: mockEmployeeId,
        role: 'driver',
        licenseNumber: 'ABC123',
        licenseClass: 'D',
        licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        save: jest.fn().mockResolvedValue(true),
      };

      Employee.findOne.mockResolvedValue(mockEmployee);
      Employee.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockEmployee),
      });

      await expect(
        EmployeeService.update(mockEmployeeId, mockOperatorId, {
          licenseExpiry: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        }),
      ).rejects.toThrow('Giấy phép lái xe đã hết hạn');
    });

    it('should throw error if employee not found', async () => {
      Employee.findOne.mockResolvedValue(null);

      await expect(
        EmployeeService.update(mockEmployeeId, mockOperatorId, {}),
      ).rejects.toThrow('Không tìm thấy nhân viên');
    });
  });

  describe('delete', () => {
    it('should soft delete employee', async () => {
      const mockEmployee = {
        _id: mockEmployeeId,
        status: 'active',
        save: jest.fn().mockResolvedValue(true),
      };

      Employee.findOne.mockResolvedValue(mockEmployee);

      await EmployeeService.delete(mockEmployeeId, mockOperatorId);

      expect(mockEmployee.status).toBe('terminated');
      expect(mockEmployee.terminationDate).toBeDefined();
      expect(mockEmployee.save).toHaveBeenCalled();
    });

    it('should throw error if employee not found', async () => {
      Employee.findOne.mockResolvedValue(null);

      await expect(
        EmployeeService.delete(mockEmployeeId, mockOperatorId),
      ).rejects.toThrow('Không tìm thấy nhân viên');
    });
  });

  describe('changeStatus', () => {
    it('should change employee status', async () => {
      const mockEmployee = {
        _id: mockEmployeeId,
        status: 'active',
        save: jest.fn().mockResolvedValue(true),
      };

      Employee.findOne.mockResolvedValue(mockEmployee);
      Employee.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue({ ...mockEmployee, status: 'on_leave' }),
      });

      const result = await EmployeeService.changeStatus(
        mockEmployeeId,
        mockOperatorId,
        'on_leave',
      );

      expect(mockEmployee.save).toHaveBeenCalled();
      expect(result.status).toBe('on_leave');
    });

    it('should set termination date when status is terminated', async () => {
      const mockEmployee = {
        _id: mockEmployeeId,
        status: 'active',
        save: jest.fn().mockResolvedValue(true),
      };

      Employee.findOne.mockResolvedValue(mockEmployee);
      Employee.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockEmployee),
      });

      await EmployeeService.changeStatus(
        mockEmployeeId,
        mockOperatorId,
        'terminated',
      );

      expect(mockEmployee.terminationDate).toBeDefined();
    });

    it('should reject invalid status', async () => {
      const mockEmployee = { _id: mockEmployeeId };

      Employee.findOne.mockResolvedValue(mockEmployee);

      await expect(
        EmployeeService.changeStatus(mockEmployeeId, mockOperatorId, 'invalid'),
      ).rejects.toThrow('Trạng thái không hợp lệ');
    });

    it('should throw error if employee not found', async () => {
      Employee.findOne.mockResolvedValue(null);

      await expect(
        EmployeeService.changeStatus(mockEmployeeId, mockOperatorId, 'active'),
      ).rejects.toThrow('Không tìm thấy nhân viên');
    });
  });

  describe('getStatistics', () => {
    it('should return employee statistics', async () => {
      Employee.countDocuments
        .mockResolvedValueOnce(10) // For totalEmployees
        .mockResolvedValueOnce(2);  // For driversWithExpiringLicense
      Employee.aggregate
        .mockResolvedValueOnce([
          { _id: 'driver', count: 6 },
          { _id: 'trip_manager', count: 4 },
        ])
        .mockResolvedValueOnce([
          { _id: 'active', count: 8 },
          { _id: 'on_leave', count: 2 },
        ]);

      const result = await EmployeeService.getStatistics(mockOperatorId);

      expect(result.totalEmployees).toBe(10);
      expect(result.totalDrivers).toBe(6);
      expect(result.totalTripManagers).toBe(4);
      expect(result.activeEmployees).toBe(8);
      expect(result.driversWithExpiringLicense).toBe(2);
    });
  });

  describe('getAvailableForTrips', () => {
    it('should get available drivers', async () => {
      const mockDrivers = [
        { _id: '1', fullName: 'Driver 1', role: 'driver', status: 'active' },
        { _id: '2', fullName: 'Driver 2', role: 'driver', status: 'active' },
      ];

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockDrivers),
      };

      Employee.find.mockReturnValue(mockQuery);

      const result = await EmployeeService.getAvailableForTrips(
        mockOperatorId,
        'driver',
      );

      expect(result).toEqual(mockDrivers);
      expect(Employee.find).toHaveBeenCalledWith({
        operatorId: mockOperatorId,
        role: 'driver',
        status: 'active',
        licenseExpiry: { $gt: expect.any(Date) },
      });
    });

    it('should get available trip managers', async () => {
      const mockManagers = [
        { _id: '1', fullName: 'Manager 1', role: 'trip_manager', status: 'active' },
      ];

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockManagers),
      };

      Employee.find.mockReturnValue(mockQuery);

      const result = await EmployeeService.getAvailableForTrips(
        mockOperatorId,
        'trip_manager',
      );

      expect(result).toEqual(mockManagers);
    });

    it('should throw error for invalid role', async () => {
      await expect(
        EmployeeService.getAvailableForTrips(mockOperatorId, 'invalid'),
      ).rejects.toThrow('Role không hợp lệ');
    });
  });

  describe('authenticate', () => {
    it('should authenticate employee with valid credentials', async () => {
      const mockEmployee = {
        _id: mockEmployeeId,
        employeeCode: 'EMP001',
        status: 'active',
        comparePassword: jest.fn().mockResolvedValue(true),
      };

      const mockQuery = {
        select: jest.fn().mockResolvedValue(mockEmployee),
      };

      Employee.findOne
        .mockReturnValueOnce(mockQuery)
        .mockReturnValueOnce({ select: jest.fn().mockResolvedValue(mockEmployee) });
      Employee.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockEmployee),
      });

      const result = await EmployeeService.authenticate(
        'emp001',
        'password123',
        mockOperatorId,
      );

      expect(result).toBeDefined();
      expect(Employee.findOne).toHaveBeenCalledWith({
        employeeCode: 'EMP001',
        operatorId: mockOperatorId,
      });
    });

    it('should throw error if employee not found', async () => {
      const mockQuery = {
        select: jest.fn().mockResolvedValue(null),
      };

      Employee.findOne.mockReturnValue(mockQuery);

      await expect(
        EmployeeService.authenticate('emp001', 'password123', mockOperatorId),
      ).rejects.toThrow('Thông tin đăng nhập không chính xác');
    });

    it('should throw error if employee is terminated', async () => {
      const mockEmployee = {
        _id: mockEmployeeId,
        status: 'terminated',
      };

      const mockQuery = {
        select: jest.fn().mockResolvedValue(mockEmployee),
      };

      Employee.findOne.mockReturnValue(mockQuery);

      await expect(
        EmployeeService.authenticate('emp001', 'password123', mockOperatorId),
      ).rejects.toThrow('Tài khoản đã bị chấm dứt');
    });

    it('should throw error if employee is suspended', async () => {
      const mockEmployee = {
        _id: mockEmployeeId,
        status: 'suspended',
      };

      const mockQuery = {
        select: jest.fn().mockResolvedValue(mockEmployee),
      };

      Employee.findOne.mockReturnValue(mockQuery);

      await expect(
        EmployeeService.authenticate('emp001', 'password123', mockOperatorId),
      ).rejects.toThrow('Tài khoản đã bị tạm ngưng');
    });

    it('should throw error if password is incorrect', async () => {
      const mockEmployee = {
        _id: mockEmployeeId,
        status: 'active',
        comparePassword: jest.fn().mockResolvedValue(false),
      };

      const mockQuery = {
        select: jest.fn().mockResolvedValue(mockEmployee),
      };

      Employee.findOne.mockReturnValue(mockQuery);

      await expect(
        EmployeeService.authenticate('emp001', 'wrongpassword', mockOperatorId),
      ).rejects.toThrow('Thông tin đăng nhập không chính xác');
    });
  });

  describe('changePassword', () => {
    it('should change employee password', async () => {
      const mockEmployee = {
        _id: mockEmployeeId,
        comparePassword: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue(true),
      };

      const mockQuery = {
        select: jest.fn().mockResolvedValue(mockEmployee),
      };

      Employee.findById.mockReturnValue(mockQuery);

      await EmployeeService.changePassword(
        mockEmployeeId,
        'currentPassword',
        'newPassword',
      );

      expect(mockEmployee.save).toHaveBeenCalled();
    });

    it('should throw error if employee not found', async () => {
      const mockQuery = {
        select: jest.fn().mockResolvedValue(null),
      };

      Employee.findById.mockReturnValue(mockQuery);

      await expect(
        EmployeeService.changePassword(mockEmployeeId, 'old', 'new'),
      ).rejects.toThrow('Không tìm thấy nhân viên');
    });

    it('should throw error if current password is incorrect', async () => {
      const mockEmployee = {
        _id: mockEmployeeId,
        comparePassword: jest.fn().mockResolvedValue(false),
      };

      const mockQuery = {
        select: jest.fn().mockResolvedValue(mockEmployee),
      };

      Employee.findById.mockReturnValue(mockQuery);

      await expect(
        EmployeeService.changePassword(mockEmployeeId, 'wrongPassword', 'new'),
      ).rejects.toThrow('Mật khẩu hiện tại không chính xác');
    });
  });

  describe('resetPassword', () => {
    it('should reset employee password', async () => {
      const mockEmployee = {
        _id: mockEmployeeId,
        save: jest.fn().mockResolvedValue(true),
      };

      Employee.findOne.mockResolvedValue(mockEmployee);

      await EmployeeService.resetPassword(
        mockEmployeeId,
        mockOperatorId,
        'newPassword',
      );

      expect(mockEmployee.password).toBe('newPassword');
      expect(mockEmployee.save).toHaveBeenCalled();
    });

    it('should throw error if employee not found', async () => {
      Employee.findOne.mockResolvedValue(null);

      await expect(
        EmployeeService.resetPassword(mockEmployeeId, mockOperatorId, 'new'),
      ).rejects.toThrow('Không tìm thấy nhân viên');
    });
  });
});
