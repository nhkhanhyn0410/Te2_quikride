const AuthService = require('../services/auth.service');
const User = require('../models/User');

/**
 * Middleware xác thực JWT token
 * Kiểm tra token trong header Authorization: Bearer <token>
 */
const authenticate = async (req, res, next) => {
  try {
    // 1. Lấy token từ header
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Kiểm tra token có tồn tại không
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Vui lòng đăng nhập để truy cập',
      });
    }

    // 2. Verify token
    let decoded;
    try {
      decoded = AuthService.verifyToken(token);
    } catch (error) {
      return res.status(401).json({
        status: 'error',
        message: error.message || 'Token không hợp lệ',
      });
    }

    // 3. Kiểm tra token type (phải là access token)
    if (decoded.type !== 'access') {
      return res.status(401).json({
        status: 'error',
        message: 'Token không hợp lệ',
      });
    }

    // 4. Kiểm tra user còn tồn tại không
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'User không tồn tại',
      });
    }

    // 5. Kiểm tra user có bị block không
    if (user.isBlocked) {
      return res.status(403).json({
        status: 'error',
        message: `Tài khoản đã bị khóa. Lý do: ${user.blockedReason || 'Không rõ'}`,
      });
    }

    // 6. Kiểm tra user có active không
    if (!user.isActive) {
      return res.status(403).json({
        status: 'error',
        message: 'Tài khoản không hoạt động',
      });
    }

    // 7. Lưu user vào request object
    req.user = user;
    req.userId = user._id;

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Lỗi xác thực',
    });
  }
};

/**
 * Middleware kiểm tra role
 * Sử dụng sau authenticate middleware
 * @param {...String} roles - Danh sách roles được phép
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // Kiểm tra user đã được authenticate chưa
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Vui lòng đăng nhập để truy cập',
      });
    }

    // Kiểm tra role
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Bạn không có quyền truy cập tài nguyên này',
      });
    }

    next();
  };
};

/**
 * Middleware cho phép truy cập không cần đăng nhập
 * Nhưng nếu có token hợp lệ thì sẽ lưu user vào request
 * Dùng cho guest booking
 */
const optionalAuth = async (req, res, next) => {
  try {
    // Lấy token từ header
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Nếu không có token, cho phép tiếp tục (guest)
    if (!token) {
      req.user = null;
      return next();
    }

    // Nếu có token, verify và lưu user
    try {
      const decoded = AuthService.verifyToken(token);

      if (decoded.type === 'access') {
        const user = await User.findById(decoded.userId);
        if (user && !user.isBlocked && user.isActive) {
          req.user = user;
          req.userId = user._id;
        }
      }
    } catch (error) {
      // Token không hợp lệ, vẫn cho phép tiếp tục như guest
      req.user = null;
    }

    next();
  } catch (error) {
    console.error('Optional auth error:', error);
    req.user = null;
    next();
  }
};

/**
 * Middleware kiểm tra email đã được verify chưa
 * Sử dụng sau authenticate middleware
 */
const requireEmailVerified = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'Vui lòng đăng nhập để truy cập',
    });
  }

  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      status: 'error',
      message: 'Vui lòng xác thực email trước khi thực hiện thao tác này',
      code: 'EMAIL_NOT_VERIFIED',
    });
  }

  next();
};

/**
 * Middleware kiểm tra phone đã được verify chưa
 * Sử dụng sau authenticate middleware
 */
const requirePhoneVerified = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'Vui lòng đăng nhập để truy cập',
    });
  }

  if (!req.user.isPhoneVerified) {
    return res.status(403).json({
      status: 'error',
      message: 'Vui lòng xác thực số điện thoại trước khi thực hiện thao tác này',
      code: 'PHONE_NOT_VERIFIED',
    });
  }

  next();
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
  requireEmailVerified,
  requirePhoneVerified,
};
