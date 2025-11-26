import api from './api';

/**
 * Booking API Service
 * Handles all booking-related API calls
 */

// Search trips
export const searchTrips = async (searchParams) => {
  const queryString = new URLSearchParams(searchParams).toString();
  return api.get(`/trips/search?${queryString}`);
};

// Get trip details
export const getTripDetails = async (tripId) => {
  return api.get(`/trips/${tripId}`);
};

// Get available seats for a trip
export const getAvailableSeats = async (tripId) => {
  return api.get(`/bookings/trips/${tripId}/available-seats`);
};

// Hold seats temporarily
export const holdSeats = async (holdData) => {
  return api.post('/bookings/hold-seats', holdData);
};

// Extend seat hold
export const extendHold = async (bookingId, sessionId, minutes = 15) => {
  return api.post(`/bookings/${bookingId}/extend`, { sessionId, minutes });
};

// Release held seats
export const releaseSeats = async (bookingId, sessionId) => {
  return api.post(`/bookings/${bookingId}/release`, { sessionId });
};

// Confirm booking (after payment)
export const confirmBooking = async (bookingId, sessionId) => {
  return api.post(`/bookings/${bookingId}/confirm`, { sessionId });
};

// Get booking by code
export const getBookingByCode = async (bookingCode) => {
  return api.get(`/bookings/code/${bookingCode}`);
};

// Cancel booking
export const cancelBooking = async (bookingId, reason) => {
  return api.post(`/bookings/${bookingId}/cancel`, { reason });
};

// Cancel booking for guest users (no auth required)
export const cancelBookingGuest = async ({ bookingId, email, phone, reason }) => {
  return api.post('/bookings/guest/cancel', { bookingId, email, phone, reason });
};

// Payment APIs

// Get payment methods
export const getPaymentMethods = async () => {
  return api.get('/payments/methods');
};

// Get bank list for VNPay
export const getBankList = async () => {
  return api.get('/payments/banks');
};

// Create payment
export const createPayment = async (paymentData) => {
  return api.post('/payments/create', paymentData);
};

// Get payment by code
export const getPaymentByCode = async (paymentCode) => {
  return api.get(`/payments/code/${paymentCode}`);
};

// Query payment status
export const queryPaymentStatus = async (paymentCode) => {
  return api.get(`/payments/${paymentCode}/status`);
};

// Voucher APIs

// Validate voucher
export const validateVoucher = async (code, bookingInfo) => {
  return api.post('/vouchers/validate', { code, ...bookingInfo });
};

// Get public vouchers
export const getPublicVouchers = async (filters) => {
  const queryString = new URLSearchParams(filters).toString();
  return api.get(`/vouchers/public?${queryString}`);
};

// Get popular routes (fetch upcoming trips and group by routes)
export const getPopularRoutes = async () => {
  try {
    // Fetch trips for the next 7 days
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    // We'll fetch trips without specific from/to to get all routes
    // Then group them by route on the frontend
    const response = await api.get('/trips/popular-routes');
    return response;
  } catch (error) {
    // Fallback: return empty array if endpoint doesn't exist
    console.error('Failed to fetch popular routes:', error);
    return { status: 'success', data: { routes: [] } };
  }
};

export default {
  searchTrips,
  getTripDetails,
  getAvailableSeats,
  holdSeats,
  extendHold,
  releaseSeats,
  confirmBooking,
  getBookingByCode,
  cancelBooking,
  cancelBookingGuest,
  getPaymentMethods,
  getBankList,
  createPayment,
  getPaymentByCode,
  queryPaymentStatus,
  validateVoucher,
  getPublicVouchers,
  getPopularRoutes,
};
