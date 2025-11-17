const OperatorService = require('../services/operator.service');

/**
 * Admin Controller
 * Xử lý các HTTP requests cho admin
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
