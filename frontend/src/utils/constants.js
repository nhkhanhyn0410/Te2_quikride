/**
 * Application Constants
 */

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
  VERIFY_OTP: '/auth/verify-otp',

  // Users
  PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile',
  CHANGE_PASSWORD: '/users/change-password',
  TICKETS: '/users/tickets',
  LOYALTY: '/users/loyalty',

  // Search & Booking
  SEARCH_TRIPS: '/trips/search',
  TRIP_DETAIL: '/trips',
  HOLD_SEATS: '/bookings/hold-seats',
  CREATE_BOOKING: '/bookings',
  CANCEL_BOOKING: '/bookings',

  // Payment
  CREATE_PAYMENT: '/payments/create',
  PAYMENT_CALLBACK: '/payments/callback',

  // Tickets
  TICKET_LOOKUP: '/tickets/lookup',
  CANCEL_TICKET: '/tickets',
  CHANGE_TICKET: '/tickets',
};

// User Roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  OPERATOR: 'operator',
  ADMIN: 'admin',
  TRIP_MANAGER: 'trip_manager',
  DRIVER: 'driver',
};

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

// Payment Methods
export const PAYMENT_METHODS = {
  VNPAY: 'vnpay',
  MOMO: 'momo',
  ZALOPAY: 'zalopay',
  ATM: 'atm',
  VISA: 'visa',
  MASTERCARD: 'mastercard',
  COD: 'cod',
};

// Bus Types
export const BUS_TYPES = {
  LIMOUSINE: 'limousine',
  SLEEPER: 'sleeper',
  SEATER: 'seater',
  DOUBLE_DECKER: 'double_decker',
};

// Trip Status
export const TRIP_STATUS = {
  SCHEDULED: 'scheduled',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Loyalty Tiers
export const LOYALTY_TIERS = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
};

// Time Constants
export const TIME_CONSTANTS = {
  SEAT_HOLD_DURATION: 15 * 60 * 1000, // 15 minutes in milliseconds
  OTP_EXPIRE: 5 * 60 * 1000, // 5 minutes
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
};

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  MAX_SEATS_PER_BOOKING: 6,
  PHONE_REGEX: /^(0|\+84)[0-9]{9}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_TIME: 'DD/MM/YYYY HH:mm',
  API: 'YYYY-MM-DD',
  TIME: 'HH:mm',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
  UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  FORBIDDEN: 'Bạn không có quyền truy cập tài nguyên này.',
  NOT_FOUND: 'Không tìm thấy tài nguyên yêu cầu.',
  SERVER_ERROR: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Đăng nhập thành công!',
  REGISTER: 'Đăng ký tài khoản thành công!',
  BOOKING_SUCCESS: 'Đặt vé thành công!',
  PAYMENT_SUCCESS: 'Thanh toán thành công!',
  CANCEL_SUCCESS: 'Hủy vé thành công!',
  UPDATE_SUCCESS: 'Cập nhật thành công!',
};

export default {
  API_ENDPOINTS,
  USER_ROLES,
  BOOKING_STATUS,
  PAYMENT_METHODS,
  BUS_TYPES,
  TRIP_STATUS,
  LOYALTY_TIERS,
  TIME_CONSTANTS,
  VALIDATION_RULES,
  DATE_FORMATS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};
