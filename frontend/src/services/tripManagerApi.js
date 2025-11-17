import api from './api';

/**
 * Trip Manager API Service
 * API calls for trip managers and drivers
 */

// Base URL for trip manager endpoints
const BASE_URL = '/trip-manager';

export const tripManagerApi = {
  /**
   * Login as trip manager
   * @param {Object} credentials - { username, password }
   * @returns {Promise}
   */
  login: (credentials) =>
    fetch(`${import.meta.env.VITE_API_URL}${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    }).then((res) => res.json()),

  /**
   * Get current trip manager info
   * @returns {Promise}
   */
  getMe: () =>
    fetch(`${import.meta.env.VITE_API_URL}${BASE_URL}/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('trip_manager_token')}`,
      },
    }).then((res) => res.json()),

  /**
   * Get assigned trips
   * @param {Object} params - { status, date }
   * @returns {Promise}
   */
  getAssignedTrips: (params = {}) =>
    fetch(
      `${import.meta.env.VITE_API_URL}${BASE_URL}/trips?${new URLSearchParams(params)}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('trip_manager_token')}`,
        },
      }
    ).then((res) => res.json()),

  /**
   * Get trip details with passengers
   * @param {string} tripId - Trip ID
   * @returns {Promise}
   */
  getTripDetails: (tripId) =>
    fetch(`${import.meta.env.VITE_API_URL}${BASE_URL}/trips/${tripId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('trip_manager_token')}`,
      },
    }).then((res) => res.json()),

  /**
   * Get trip passengers
   * @param {string} tripId - Trip ID
   * @returns {Promise}
   */
  getTripPassengers: (tripId) =>
    fetch(`${import.meta.env.VITE_API_URL}${BASE_URL}/trips/${tripId}/passengers`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('trip_manager_token')}`,
      },
    }).then((res) => res.json()),

  /**
   * Update trip status (UC-21)
   * @param {string} tripId - Trip ID
   * @param {Object} data - { status, reason }
   * @returns {Promise}
   */
  updateTripStatus: (tripId, data) =>
    fetch(`${import.meta.env.VITE_API_URL}${BASE_URL}/trips/${tripId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('trip_manager_token')}`,
      },
      body: JSON.stringify(data),
    }).then((res) => res.json()),

  /**
   * Start trip (legacy - use updateTripStatus instead)
   * @param {string} tripId - Trip ID
   * @returns {Promise}
   */
  startTrip: (tripId) =>
    fetch(`${import.meta.env.VITE_API_URL}${BASE_URL}/trips/${tripId}/start`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('trip_manager_token')}`,
      },
    }).then((res) => res.json()),

  /**
   * Complete trip (legacy - use updateTripStatus instead)
   * @param {string} tripId - Trip ID
   * @returns {Promise}
   */
  completeTrip: (tripId) =>
    fetch(`${import.meta.env.VITE_API_URL}${BASE_URL}/trips/${tripId}/complete`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('trip_manager_token')}`,
      },
    }).then((res) => res.json()),

  /**
   * Verify ticket QR code
   * @param {string} tripId - Trip ID
   * @param {Object} data - { qrCodeData }
   * @returns {Promise}
   */
  verifyTicketQR: (tripId, data) =>
    fetch(`${import.meta.env.VITE_API_URL}${BASE_URL}/trips/${tripId}/verify-ticket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('trip_manager_token')}`,
      },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
};

export default tripManagerApi;
