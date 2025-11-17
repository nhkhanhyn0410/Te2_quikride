const OperatorService = require('../services/operator.service');
const User = require('../models/User');
const Booking = require('../models/Booking');

/**
 * Admin Controller
 * Xử lý các HTTP requests cho admin
 * Includes operator management and user management (UC-22)
 */

/**
 * @route   GET /api/v1/admin/operators
 * @desc    Lấy danh sách operators (Admin)
 * @access  Private (Admin)
 */
exports.getAllOperators = async (req, res, next) => {
  try {
    const {
      verificationStatus,
      isSuspended,
      isActive,
      search,
      page,
      limit,
      sortBy,
      sortOrder,
    } = req.query;

    const filters = {
      verificationStatus,
      isSuspended: isSuspended === 'true' ? true : isSuspended === 'false' ? false : undefined,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      search,
    };

    const options = {
      page,
      limit,
      sortBy,
      sortOrder,
    };

    const result = await OperatorService.getAll(filters, options);

    res.status(200).json({
      status: 'success',
      data: {
        operators: result.operators,
        pagination: result.pagination,
      },
    });
  } catch (error) {
    console.error('Get operators error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || 'Lấy danh sách nhà xe thất bại',
    });
  }
};

/**
 * @route   GET /api/v1/admin/operators/:id
 * @desc    Lấy thông tin chi tiết operator (Admin)
 * @access  Private (Admin)
 */
exports.getOperatorById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const operator = await OperatorService.getById(id);

    res.status(200).json({
      status: 'success',
      data: {
        operator,
      },
    });
  } catch (error) {
    console.error('Get operator error:', error);
    res.status(404).json({
      status: 'error',
      message: error.message || 'Không tìm thấy nhà xe',
    });
  }
};

/**
 * @route   PUT /api/v1/admin/operators/:id/approve
 * @desc    Duyệt nhà xe
 * @access  Private (Admin)
 */
exports.approveOperator = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminId = req.userId; // Từ authenticate middleware

    const operator = await OperatorService.approve(id, adminId);

    res.status(200).json({
      status: 'success',
      message: 'Duyệt nhà xe thành công',
      data: {
        operator,
      },
    });
  } catch (error) {
    console.error('Approve operator error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || 'Duyệt nhà xe thất bại',
    });
  }
};

/**
 * @route   PUT /api/v1/admin/operators/:id/reject
 * @desc    Từ chối nhà xe
 * @access  Private (Admin)
 */
exports.rejectOperator = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const adminId = req.userId; // Từ authenticate middleware

    if (!reason) {
      return res.status(400).json({
        status: 'error',
        message: 'Vui lòng cung cấp lý do từ chối',
      });
    }

    const operator = await OperatorService.reject(id, adminId, reason);

    res.status(200).json({
      status: 'success',
      message: 'Từ chối nhà xe thành công',
      data: {
        operator,
      },
    });
  } catch (error) {
    console.error('Reject operator error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || 'Từ chối nhà xe thất bại',
    });
  }
};

/**
 * @route   PUT /api/v1/admin/operators/:id/suspend
 * @desc    Tạm ngưng nhà xe
 * @access  Private (Admin)
 */
exports.suspendOperator = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        status: 'error',
        message: 'Vui lòng cung cấp lý do tạm ngưng',
      });
    }

    const operator = await OperatorService.suspend(id, reason);

    res.status(200).json({
      status: 'success',
      message: 'Tạm ngưng nhà xe thành công',
      data: {
        operator,
      },
    });
  } catch (error) {
    console.error('Suspend operator error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || 'Tạm ngưng nhà xe thất bại',
    });
  }
};

/**
 * @route   PUT /api/v1/admin/operators/:id/resume
 * @desc    Khôi phục nhà xe
 * @access  Private (Admin)
 */
exports.resumeOperator = async (req, res, next) => {
  try {
    const { id } = req.params;

    const operator = await OperatorService.resume(id);

    res.status(200).json({
      status: 'success',
      message: 'Khôi phục nhà xe thành công',
      data: {
        operator,
      },
    });
  } catch (error) {
    console.error('Resume operator error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || 'Khôi phục nhà xe thất bại',
    });
  }
};

/**
 * ========================
 * USER MANAGEMENT (UC-22)
 * ========================
 */

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with filtering and pagination
 * @access  Private (Admin)
 */
exports.getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      role,
      isBlocked,
      isActive,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Build query
    const query = {};

    // Filter by role
    if (role) {
      query.role = role;
    }

    // Filter by blocked status
    if (isBlocked !== undefined) {
      query.isBlocked = isBlocked === 'true';
    }

    // Filter by active status
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    // Search by email, phone, or name
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const users = await User.find(query)
      .select('-password -passwordResetToken -passwordResetExpires -emailVerificationToken -phoneVerificationOTP -otpExpires')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get total count for pagination
    const total = await User.countDocuments(query);

    // Get user statistics for each user (booking count, total spent)
    const userIds = users.map((u) => u._id);
    const bookingStats = await Booking.aggregate([
      {
        $match: {
          userId: { $in: userIds },
          paymentStatus: 'paid',
        },
      },
      {
        $group: {
          _id: '$userId',
          totalBookings: { $sum: 1 },
          totalSpent: { $sum: '$finalPrice' },
        },
      },
    ]);

    // Map stats to users
    const statsMap = new Map(bookingStats.map((s) => [s._id.toString(), s]));
    const usersWithStats = users.map((user) => {
      const stats = statsMap.get(user._id.toString()) || {
        totalBookings: 0,
        totalSpent: 0,
      };
      return {
        ...user,
        totalBookings: stats.totalBookings,
        totalSpent: stats.totalSpent,
      };
    });

    res.json({
      success: true,
      data: {
        users: usersWithStats,
        pagination: {
          page: parseInt(page),
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể tải danh sách người dùng',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get user details by ID
 * @access  Private (Admin)
 */
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find user
    const user = await User.findById(id)
      .select('-password -passwordResetToken -passwordResetExpires -emailVerificationToken -phoneVerificationOTP -otpExpires')
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng',
      });
    }

    // Get booking statistics
    const bookingStats = await Booking.aggregate([
      {
        $match: {
          userId: user._id,
        },
      },
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 },
          totalAmount: { $sum: '$finalPrice' },
        },
      },
    ]);

    // Get recent bookings
    const recentBookings = await Booking.find({ userId: user._id })
      .populate('tripId', 'routeId departureTime')
      .populate({
        path: 'tripId',
        populate: {
          path: 'routeId',
          select: 'routeName origin destination',
        },
      })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('bookingCode tripId seats totalPrice finalPrice paymentStatus createdAt')
      .lean();

    // Format booking stats
    const stats = {
      totalBookings: 0,
      paidBookings: 0,
      pendingBookings: 0,
      cancelledBookings: 0,
      totalSpent: 0,
    };

    bookingStats.forEach((stat) => {
      stats.totalBookings += stat.count;
      if (stat._id === 'paid') {
        stats.paidBookings = stat.count;
        stats.totalSpent = stat.totalAmount;
      } else if (stat._id === 'pending') {
        stats.pendingBookings = stat.count;
      } else if (stat._id === 'cancelled' || stat._id === 'refunded') {
        stats.cancelledBookings += stat.count;
      }
    });

    res.json({
      success: true,
      data: {
        user,
        stats,
        recentBookings,
      },
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể tải thông tin người dùng',
      error: error.message,
    });
  }
};

/**
 * @route   PUT /api/admin/users/:id/block
 * @desc    Block a user
 * @access  Private (Admin)
 */
exports.blockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    // Validate
    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp lý do khóa tài khoản',
      });
    }

    // Find user
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng',
      });
    }

    // Check if already blocked
    if (user.isBlocked) {
      return res.status(400).json({
        success: false,
        message: 'Tài khoản đã bị khóa trước đó',
      });
    }

    // Prevent blocking admin users
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Không thể khóa tài khoản admin',
      });
    }

    // Block user
    user.isBlocked = true;
    user.blockedReason = reason;
    user.blockedAt = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Đã khóa tài khoản người dùng',
      data: {
        user: {
          _id: user._id,
          email: user.email,
          fullName: user.fullName,
          isBlocked: user.isBlocked,
          blockedReason: user.blockedReason,
          blockedAt: user.blockedAt,
        },
      },
    });
  } catch (error) {
    console.error('Block user error:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể khóa tài khoản',
      error: error.message,
    });
  }
};

/**
 * @route   PUT /api/admin/users/:id/unblock
 * @desc    Unblock a user
 * @access  Private (Admin)
 */
exports.unblockUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find user
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng',
      });
    }

    // Check if not blocked
    if (!user.isBlocked) {
      return res.status(400).json({
        success: false,
        message: 'Tài khoản không bị khóa',
      });
    }

    // Unblock user
    user.isBlocked = false;
    user.blockedReason = undefined;
    user.blockedAt = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Đã mở khóa tài khoản người dùng',
      data: {
        user: {
          _id: user._id,
          email: user.email,
          fullName: user.fullName,
          isBlocked: user.isBlocked,
        },
      },
    });
  } catch (error) {
    console.error('Unblock user error:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể mở khóa tài khoản',
      error: error.message,
    });
  }
};

/**
 * @route   POST /api/admin/users/:id/reset-password
 * @desc    Reset user password (admin)
 * @access  Private (Admin)
 */
exports.resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword, sendEmail = true } = req.body;

    // Validate
    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp mật khẩu mới',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải có ít nhất 6 ký tự',
      });
    }

    // Find user
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng',
      });
    }

    // Prevent resetting admin password
    if (user.role === 'admin' && req.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Không thể đặt lại mật khẩu cho admin khác',
      });
    }

    // Update password
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // TODO: Send email notification to user about password change
    // if (sendEmail) {
    //   await emailService.sendPasswordChangeNotification(user.email, user.fullName);
    // }

    res.json({
      success: true,
      message: 'Đã đặt lại mật khẩu cho người dùng',
      data: {
        user: {
          _id: user._id,
          email: user.email,
          fullName: user.fullName,
        },
      },
    });
  } catch (error) {
    console.error('Reset user password error:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể đặt lại mật khẩu',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/admin/users/statistics
 * @desc    Get user statistics (dashboard)
 * @access  Private (Admin)
 */
exports.getUserStatistics = async (req, res) => {
  try {
    // Total users
    const totalUsers = await User.countDocuments();

    // Active users
    const activeUsers = await User.countDocuments({ isActive: true, isBlocked: false });

    // Blocked users
    const blockedUsers = await User.countDocuments({ isBlocked: true });

    // New users this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    // Users by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]);

    // Users by loyalty tier
    const usersByTier = await User.aggregate([
      {
        $match: { role: 'customer' },
      },
      {
        $group: {
          _id: '$loyaltyTier',
          count: { $sum: 1 },
        },
      },
    ]);

    // User growth (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        blockedUsers,
        newUsersThisMonth,
        usersByRole: usersByRole.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        usersByTier: usersByTier.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        userGrowth,
      },
    });
  } catch (error) {
    console.error('Get user statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể tải thống kê người dùng',
      error: error.message,
    });
  }
};
