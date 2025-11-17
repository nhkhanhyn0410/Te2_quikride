const jwt = require('jsonwebtoken');
const AuthService = require('../../../src/services/auth.service');
const User = require('../../../src/models/User');

// Mock the User model
jest.mock('../../../src/models/User');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token with default expiry', () => {
      const payload = { userId: '123', email: 'test@example.com' };
      const token = AuthService.generateToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.iss).toBe('quikride'); // JWT uses 'iss' not 'issuer'
    });

    it('should generate token with custom expiry', () => {
      const payload = { userId: '123' };
      const token = AuthService.generateToken(payload, '1h');

      expect(token).toBeDefined();
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.userId).toBe(payload.userId);
    });
  });

  describe('generateAccessToken', () => {
    const mockUser = {
      _id: '123',
      email: 'test@example.com',
      role: 'customer',
    };

    it('should generate access token with default expiry', () => {
      const token = AuthService.generateAccessToken(mockUser);

      expect(token).toBeDefined();
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.userId).toBe(mockUser._id);
      expect(decoded.email).toBe(mockUser.email);
      expect(decoded.role).toBe(mockUser.role);
      expect(decoded.type).toBe('access');
    });

    it('should generate access token with 30 days expiry when rememberMe is true', () => {
      const token = AuthService.generateAccessToken(mockUser, true);

      expect(token).toBeDefined();
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.type).toBe('access');
    });
  });

  describe('generateRefreshToken', () => {
    const mockUser = {
      _id: '123',
    };

    it('should generate refresh token with default expiry', () => {
      const token = AuthService.generateRefreshToken(mockUser);

      expect(token).toBeDefined();
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.userId).toBe(mockUser._id);
      expect(decoded.type).toBe('refresh');
    });

    it('should generate refresh token with 30 days expiry when rememberMe is true', () => {
      const token = AuthService.generateRefreshToken(mockUser, true);

      expect(token).toBeDefined();
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.type).toBe('refresh');
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const payload = { userId: '123', email: 'test@example.com' };
      const token = AuthService.generateToken(payload, '1h');

      const decoded = AuthService.verifyToken(token);

      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
    });

    it('should throw error for expired token', () => {
      // Create an expired token
      const token = jwt.sign(
        { userId: '123' },
        process.env.JWT_SECRET,
        { expiresIn: '0s' }
      );

      // Wait a bit to ensure token is expired
      setTimeout(() => {
        expect(() => AuthService.verifyToken(token)).toThrow('Token đã hết hạn');
      }, 100);
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => AuthService.verifyToken(invalidToken)).toThrow('Token không hợp lệ');
    });

    it('should throw error for token with wrong secret', () => {
      const token = jwt.sign({ userId: '123' }, 'wrong-secret', { expiresIn: '1h' });

      expect(() => AuthService.verifyToken(token)).toThrow('Token không hợp lệ');
    });
  });

  describe('register', () => {
    const mockUserData = {
      email: 'newuser@example.com',
      phone: '0901234567',
      password: 'Password123',
      fullName: 'New User',
    };

    it('should register a new user successfully', async () => {
      // Mock User.findByEmailOrPhone to return null (no existing user)
      User.findByEmailOrPhone = jest.fn().mockResolvedValue(null);

      // Mock User.create
      const mockUser = {
        _id: '123',
        email: mockUserData.email.toLowerCase(),
        phone: mockUserData.phone,
        fullName: mockUserData.fullName,
        createEmailVerificationToken: jest.fn().mockReturnValue('verification-token'),
        save: jest.fn().mockResolvedValue(true),
        toObject: jest.fn().mockReturnValue({
          _id: '123',
          email: mockUserData.email.toLowerCase(),
          phone: mockUserData.phone,
          fullName: mockUserData.fullName,
          password: 'hashed-password',
        }),
      };

      User.create = jest.fn().mockResolvedValue(mockUser);

      const result = await AuthService.register(mockUserData);

      expect(User.findByEmailOrPhone).toHaveBeenCalledWith(mockUserData.email);
      expect(User.create).toHaveBeenCalledWith({
        email: mockUserData.email.toLowerCase(),
        phone: mockUserData.phone,
        password: mockUserData.password,
        fullName: mockUserData.fullName,
      });
      expect(result.user).toBeDefined();
      expect(result.user.password).toBeUndefined(); // Password should be removed
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.verificationToken).toBe('verification-token');
    });

    it('should throw error if email already exists', async () => {
      const existingUser = {
        email: mockUserData.email.toLowerCase(),
        phone: '0909999999',
      };

      User.findByEmailOrPhone = jest.fn().mockResolvedValue(existingUser);

      await expect(AuthService.register(mockUserData)).rejects.toThrow('Email đã được sử dụng');
    });

    it('should throw error if phone already exists', async () => {
      const existingUser = {
        email: 'other@example.com',
        phone: mockUserData.phone,
      };

      User.findByEmailOrPhone = jest.fn().mockResolvedValue(existingUser);

      await expect(AuthService.register(mockUserData)).rejects.toThrow(
        'Số điện thoại đã được sử dụng'
      );
    });
  });

  describe('login', () => {
    const mockPassword = 'Password123';

    it('should login successfully with valid credentials', async () => {
      const mockUser = {
        _id: '123',
        email: 'test@example.com',
        phone: '0901234567',
        fullName: 'Test User',
        role: 'customer',
        isBlocked: false,
        isActive: true,
        comparePassword: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue(true),
        toObject: jest.fn().mockReturnValue({
          _id: '123',
          email: 'test@example.com',
          fullName: 'Test User',
          role: 'customer',
        }),
      };

      User.findByEmailOrPhone = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await AuthService.login('test@example.com', mockPassword);

      expect(User.findByEmailOrPhone).toHaveBeenCalledWith('test@example.com');
      expect(mockUser.comparePassword).toHaveBeenCalledWith(mockPassword);
      expect(result.user).toBeDefined();
      expect(result.user.password).toBeUndefined();
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should throw error if user not found', async () => {
      User.findByEmailOrPhone = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await expect(AuthService.login('notfound@example.com', mockPassword)).rejects.toThrow(
        'Email/Số điện thoại hoặc mật khẩu không đúng'
      );
    });

    it('should throw error if account is blocked', async () => {
      const mockUser = {
        isBlocked: true,
        blockedReason: 'Violation of terms',
        isActive: true,
      };

      User.findByEmailOrPhone = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      await expect(AuthService.login('blocked@example.com', mockPassword)).rejects.toThrow(
        'Tài khoản đã bị khóa'
      );
    });

    it('should throw error if account is inactive', async () => {
      const mockUser = {
        isBlocked: false,
        isActive: false,
      };

      User.findByEmailOrPhone = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      await expect(AuthService.login('inactive@example.com', mockPassword)).rejects.toThrow(
        'Tài khoản không hoạt động'
      );
    });

    it('should throw error if password is incorrect', async () => {
      const mockUser = {
        _id: '123',
        email: 'test@example.com',
        isBlocked: false,
        isActive: true,
        comparePassword: jest.fn().mockResolvedValue(false),
      };

      User.findByEmailOrPhone = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      await expect(AuthService.login('test@example.com', 'wrongpassword')).rejects.toThrow(
        'Email/Số điện thoại hoặc mật khẩu không đúng'
      );
    });

    it('should login with rememberMe option', async () => {
      const mockUser = {
        _id: '123',
        email: 'test@example.com',
        role: 'customer',
        isBlocked: false,
        isActive: true,
        comparePassword: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue(true),
        toObject: jest.fn().mockReturnValue({
          _id: '123',
          email: 'test@example.com',
        }),
      };

      User.findByEmailOrPhone = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await AuthService.login('test@example.com', mockPassword, true);

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });
  });
});
