const jwt = require('jsonwebtoken');

/**
 * Trip Manager Authentication Middleware
 * Verifies JWT token for trip managers and drivers
 */

/**
 * Protect routes - require trip manager authentication
 */
const protectTripManager = (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập để truy cập',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Check if token is for trip manager
    if (decoded.type !== 'trip_manager') {
      return res.status(403).json({
        success: false,
        message: 'Chỉ Trip Manager mới có quyền truy cập',
      });
    }

    // Attach trip manager info to request
    req.tripManager = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error('Trip manager auth error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token đã hết hạn. Vui lòng đăng nhập lại',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Lỗi xác thực',
    });
  }
};

/**
 * Authorize specific roles
 * @param  {...string} roles - Allowed roles (trip_manager, driver)
 */
const authorizeTripManager = (...roles) => {
  return (req, res, next) => {
    if (!req.tripManager) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập',
      });
    }

    if (!roles.includes(req.tripManager.role)) {
      return res.status(403).json({
        success: false,
        message: `Chỉ ${roles.join(', ')} mới có quyền truy cập`,
      });
    }

    next();
  };
};

module.exports = {
  protectTripManager,
  authorizeTripManager,
};
