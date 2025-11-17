const {
  authenticate,
  authorize,
  optionalAuth,
  requireEmailVerified,
  requirePhoneVerified,
} = require('../../../src/middleware/auth.middleware');
const AuthService = require('../../../src/services/auth.service');
const User = require('../../../src/models/User');

// Mock dependencies
jest.mock('../../../src/services/auth.service');
jest.mock('../../../src/models/User');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock request, response, next
    req = {
      headers: {},
      user: null,
      userId: null,
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    next = jest.fn();
  });

  describe('authenticate', () => {
    it('should authenticate user with valid token', async () => {
      const mockToken = 'valid-jwt-token';
      const mockDecoded = {
        userId: '123',
        email: 'test@example.com',
        role: 'customer',
        type: 'access',
      };
      const mockUser = {
        _id: '123',
        email: 'test@example.com',
        role: 'customer',
        isBlocked: false,
        isActive: true,
        lastLogin: new Date(),
        save: jest.fn().mockResolvedValue(true),
      };

      req.headers.authorization = `Bearer ${mockToken}`;
      AuthService.verifyToken = jest.fn().mockReturnValue(mockDecoded);
      User.findById = jest.fn().mockResolvedValue(mockUser);

      await authenticate(req, res, next);

      expect(AuthService.verifyToken).toHaveBeenCalledWith(mockToken);
      expect(User.findById).toHaveBeenCalledWith(mockDecoded.userId);
      expect(req.user).toEqual(mockUser);
      expect(req.userId).toBe(mockUser._id);
      expect(next).toHaveBeenCalled();
    });

    it('should return 401 if no token provided', async () => {
      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Vui lòng đăng nhập để truy cập',
        code: 'NO_TOKEN',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', async () => {
      const mockToken = 'invalid-token';
      req.headers.authorization = `Bearer ${mockToken}`;

      AuthService.verifyToken = jest.fn().mockImplementation(() => {
        throw new Error('Token không hợp lệ');
      });

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Token không hợp lệ',
        code: 'INVALID_TOKEN',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token type is not access', async () => {
      const mockToken = 'refresh-token';
      const mockDecoded = {
        userId: '123',
        type: 'refresh', // Wrong type
      };

      req.headers.authorization = `Bearer ${mockToken}`;
      AuthService.verifyToken = jest.fn().mockReturnValue(mockDecoded);

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Token không hợp lệ',
        code: 'INVALID_TOKEN_TYPE',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if user not found', async () => {
      const mockToken = 'valid-token';
      const mockDecoded = {
        userId: '123',
        type: 'access',
      };

      req.headers.authorization = `Bearer ${mockToken}`;
      AuthService.verifyToken = jest.fn().mockReturnValue(mockDecoded);
      User.findById = jest.fn().mockResolvedValue(null);

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'User không tồn tại',
        code: 'USER_NOT_FOUND',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if user is blocked', async () => {
      const mockToken = 'valid-token';
      const mockDecoded = {
        userId: '123',
        type: 'access',
      };
      const mockUser = {
        _id: '123',
        isBlocked: true,
        blockedReason: 'Spam',
        isActive: true,
      };

      req.headers.authorization = `Bearer ${mockToken}`;
      AuthService.verifyToken = jest.fn().mockReturnValue(mockDecoded);
      User.findById = jest.fn().mockResolvedValue(mockUser);

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Tài khoản đã bị khóa. Lý do: Spam',
        code: 'ACCOUNT_BLOCKED',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if user is inactive', async () => {
      const mockToken = 'valid-token';
      const mockDecoded = {
        userId: '123',
        type: 'access',
      };
      const mockUser = {
        _id: '123',
        isBlocked: false,
        isActive: false,
      };

      req.headers.authorization = `Bearer ${mockToken}`;
      AuthService.verifyToken = jest.fn().mockReturnValue(mockDecoded);
      User.findById = jest.fn().mockResolvedValue(mockUser);

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Tài khoản không hoạt động',
        code: 'ACCOUNT_INACTIVE',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should update lastLogin on successful authentication', async () => {
      const mockToken = 'valid-token';
      const mockDecoded = {
        userId: '123',
        type: 'access',
      };
      const mockUser = {
        _id: '123',
        isBlocked: false,
        isActive: true,
        lastLogin: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
        save: jest.fn().mockResolvedValue(true),
      };

      req.headers.authorization = `Bearer ${mockToken}`;
      AuthService.verifyToken = jest.fn().mockReturnValue(mockDecoded);
      User.findById = jest.fn().mockResolvedValue(mockUser);

      await authenticate(req, res, next);

      expect(mockUser.save).toHaveBeenCalled();
      expect(mockUser.lastLogin).toBeDefined();
    });
  });

  describe('authorize', () => {
    it('should allow access if user has required role', () => {
      req.user = {
        _id: '123',
        role: 'admin',
      };

      const middleware = authorize('admin', 'customer');
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should deny access if user does not have required role', () => {
      req.user = {
        _id: '123',
        role: 'customer',
      };

      const middleware = authorize('admin');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Bạn không có quyền truy cập tài nguyên này',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if user is not authenticated', () => {
      req.user = null;

      const middleware = authorize('admin');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Vui lòng đăng nhập để truy cập',
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('optionalAuth', () => {
    it('should set user if valid token is provided', async () => {
      const mockToken = 'valid-token';
      const mockDecoded = {
        userId: '123',
        type: 'access',
      };
      const mockUser = {
        _id: '123',
        email: 'test@example.com',
        isBlocked: false,
        isActive: true,
      };

      req.headers.authorization = `Bearer ${mockToken}`;
      AuthService.verifyToken = jest.fn().mockReturnValue(mockDecoded);
      User.findById = jest.fn().mockResolvedValue(mockUser);

      await optionalAuth(req, res, next);

      expect(req.user).toEqual(mockUser);
      expect(req.userId).toBe(mockUser._id);
      expect(next).toHaveBeenCalled();
    });

    it('should continue as guest if no token is provided', async () => {
      await optionalAuth(req, res, next);

      expect(req.user).toBeNull();
      expect(next).toHaveBeenCalled();
    });

    it('should continue as guest if token is invalid', async () => {
      const mockToken = 'invalid-token';
      req.headers.authorization = `Bearer ${mockToken}`;

      AuthService.verifyToken = jest.fn().mockImplementation(() => {
        throw new Error('Token không hợp lệ');
      });

      await optionalAuth(req, res, next);

      expect(req.user).toBeNull();
      expect(next).toHaveBeenCalled();
    });

    it('should continue as guest if user is blocked', async () => {
      const mockToken = 'valid-token';
      const mockDecoded = {
        userId: '123',
        type: 'access',
      };
      const mockUser = {
        _id: '123',
        isBlocked: true,
        isActive: true,
      };

      req.headers.authorization = `Bearer ${mockToken}`;
      AuthService.verifyToken = jest.fn().mockReturnValue(mockDecoded);
      User.findById = jest.fn().mockResolvedValue(mockUser);

      await optionalAuth(req, res, next);

      expect(req.user).toBeNull();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('requireEmailVerified', () => {
    it('should allow access if email is verified', () => {
      req.user = {
        _id: '123',
        isEmailVerified: true,
      };

      requireEmailVerified(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should deny access if email is not verified', () => {
      req.user = {
        _id: '123',
        isEmailVerified: false,
      };

      requireEmailVerified(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Vui lòng xác thực email trước khi thực hiện thao tác này',
        code: 'EMAIL_NOT_VERIFIED',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if user is not authenticated', () => {
      req.user = null;

      requireEmailVerified(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('requirePhoneVerified', () => {
    it('should allow access if phone is verified', () => {
      req.user = {
        _id: '123',
        isPhoneVerified: true,
      };

      requirePhoneVerified(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should deny access if phone is not verified', () => {
      req.user = {
        _id: '123',
        isPhoneVerified: false,
      };

      requirePhoneVerified(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Vui lòng xác thực số điện thoại trước khi thực hiện thao tác này',
        code: 'PHONE_NOT_VERIFIED',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if user is not authenticated', () => {
      req.user = null;

      requirePhoneVerified(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
