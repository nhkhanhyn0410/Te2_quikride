const EmployeeService = require('../services/employee.service');

/**
 * Employee Controller
 * Xử lý các HTTP requests liên quan đến employees
 */

/**
 * @route   POST /api/v1/operators/employees
 * @desc    Tạo nhân viên mới
 * @access  Private (Operator)
 */
exports.create = async (req, res, next) => {
  try {
    const operatorId = req.userId; // Từ authenticate middleware
    const employeeData = req.body;

    // Validate required fields
    const requiredFields = [
      'employeeCode',
      'fullName',
      'phone',
      'password',
      'role',
    ];

    const missingFields = requiredFields.filter(
      (field) => !employeeData[field],
    );
    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: `Thiếu các trường bắt buộc: ${missingFields.join(', ')}`,
      });
    }

    const employee = await EmployeeService.create(operatorId, employeeData);

    res.status(201).json({
      status: 'success',
      message: 'Tạo nhân viên thành công',
      data: {
        employee,
      },
    });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || 'Tạo nhân viên thất bại',
    });
  }
};

/**
 * @route   GET /api/v1/operators/employees
 * @desc    Lấy danh sách employees của operator
 * @access  Private (Operator)
 */
exports.getMyEmployees = async (req, res, next) => {
  try {
    const operatorId = req.userId;
    const { role, status, search, page, limit, sortBy, sortOrder } =
      req.query;

    const filters = {
      role,
      status,
      search,
    };

    const options = {
      page,
      limit,
      sortBy,
      sortOrder,
    };

    const result = await EmployeeService.getByOperator(
      operatorId,
      filters,
      options,
    );

    res.status(200).json({
      status: 'success',
      data: {
        employees: result.employees,
        pagination: result.pagination,
      },
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || 'Lấy danh sách nhân viên thất bại',
    });
  }
};

/**
 * @route   GET /api/v1/operators/employees/:id
 * @desc    Lấy thông tin employee theo ID
 * @access  Private (Operator)
 */
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const operatorId = req.userId;

    const employee = await EmployeeService.getById(id, operatorId);

    res.status(200).json({
      status: 'success',
      data: {
        employee,
      },
    });
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(404).json({
      status: 'error',
      message: error.message || 'Không tìm thấy nhân viên',
    });
  }
};

/**
 * @route   PUT /api/v1/operators/employees/:id
 * @desc    Cập nhật employee
 * @access  Private (Operator)
 */
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const operatorId = req.userId;
    const updateData = req.body;

    const employee = await EmployeeService.update(
      id,
      operatorId,
      updateData,
    );

    res.status(200).json({
      status: 'success',
      message: 'Cập nhật nhân viên thành công',
      data: {
        employee,
      },
    });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || 'Cập nhật nhân viên thất bại',
    });
  }
};

/**
 * @route   DELETE /api/v1/operators/employees/:id
 * @desc    Xóa employee (soft delete - terminate)
 * @access  Private (Operator)
 */
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const operatorId = req.userId;

    await EmployeeService.delete(id, operatorId);

    res.status(200).json({
      status: 'success',
      message: 'Xóa nhân viên thành công',
    });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || 'Xóa nhân viên thất bại',
    });
  }
};

/**
 * @route   PUT /api/v1/operators/employees/:id/status
 * @desc    Thay đổi trạng thái employee
 * @access  Private (Operator)
 */
exports.changeStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const operatorId = req.userId;

    if (!status) {
      return res.status(400).json({
        status: 'error',
        message: 'Trạng thái là bắt buộc',
      });
    }

    const employee = await EmployeeService.changeStatus(
      id,
      operatorId,
      status,
    );

    res.status(200).json({
      status: 'success',
      message: 'Thay đổi trạng thái nhân viên thành công',
      data: {
        employee,
      },
    });
  } catch (error) {
    console.error('Change employee status error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || 'Thay đổi trạng thái nhân viên thất bại',
    });
  }
};

/**
 * @route   GET /api/v1/operators/employees/statistics
 * @desc    Lấy thống kê employees
 * @access  Private (Operator)
 */
exports.getStatistics = async (req, res, next) => {
  try {
    const operatorId = req.userId;

    const statistics = await EmployeeService.getStatistics(operatorId);

    res.status(200).json({
      status: 'success',
      data: {
        statistics,
      },
    });
  } catch (error) {
    console.error('Get employee statistics error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || 'Lấy thống kê nhân viên thất bại',
    });
  }
};

/**
 * @route   GET /api/v1/operators/employees/available/:role
 * @desc    Lấy danh sách nhân viên có thể assign vào chuyến
 * @access  Private (Operator)
 */
exports.getAvailableForTrips = async (req, res, next) => {
  try {
    const { role } = req.params;
    const operatorId = req.userId;

    const employees = await EmployeeService.getAvailableForTrips(
      operatorId,
      role,
    );

    res.status(200).json({
      status: 'success',
      data: {
        employees,
        total: employees.length,
      },
    });
  } catch (error) {
    console.error('Get available employees error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || 'Lấy danh sách nhân viên thất bại',
    });
  }
};

/**
 * @route   POST /api/v1/operators/employees/:id/reset-password
 * @desc    Reset mật khẩu nhân viên
 * @access  Private (Operator)
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    const operatorId = req.userId;

    if (!newPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Mật khẩu mới là bắt buộc',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'Mật khẩu phải có ít nhất 6 ký tự',
      });
    }

    await EmployeeService.resetPassword(id, operatorId, newPassword);

    res.status(200).json({
      status: 'success',
      message: 'Reset mật khẩu thành công',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || 'Reset mật khẩu thất bại',
    });
  }
};

/**
 * @route   POST /api/v1/employees/change-password
 * @desc    Đổi mật khẩu (employee tự đổi)
 * @access  Private (Employee)
 */
exports.changePassword = async (req, res, next) => {
  try {
    const employeeId = req.userId; // From authenticate middleware
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Mật khẩu hiện tại và mật khẩu mới là bắt buộc',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự',
      });
    }

    await EmployeeService.changePassword(
      employeeId,
      currentPassword,
      newPassword,
    );

    res.status(200).json({
      status: 'success',
      message: 'Đổi mật khẩu thành công',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || 'Đổi mật khẩu thất bại',
    });
  }
};
