import api from './api';

/**
 * Operator API Service
 * All API calls for operator dashboard
 */

// ==================== Auth ====================

export const operatorAuth = {
  login: (credentials) => api.post('/operators/login', credentials),
  register: (data) => api.post('/operators/register', data),
  getProfile: () => api.get('/operators/me/profile'),
  updateProfile: (data) => api.put('/operators/me/profile', data),
};

// ==================== Routes ====================

export const routesApi = {
  // Get all routes for operator
  getMyRoutes: (params = {}) => api.get('/operators/routes', { params }),

  // Get single route
  getById: (id) => api.get(`/operators/routes/${id}`),

  // Create route
  create: (data) => api.post('/operators/routes', data),

  // Update route
  update: (id, data) => api.put(`/operators/routes/${id}`, data),

  // Delete route
  delete: (id) => api.delete(`/operators/routes/${id}`),

  // Toggle active status
  toggleActive: (id) => api.put(`/operators/routes/${id}/toggle-active`),

  // Pickup points
  addPickupPoint: (id, data) => api.post(`/operators/routes/${id}/pickup-points`, data),
  removePickupPoint: (id, pointId) => api.delete(`/operators/routes/${id}/pickup-points/${pointId}`),

  // Dropoff points
  addDropoffPoint: (id, data) => api.post(`/operators/routes/${id}/dropoff-points`, data),
  removeDropoffPoint: (id, pointId) => api.delete(`/operators/routes/${id}/dropoff-points/${pointId}`),
};

// ==================== Buses ====================

export const busesApi = {
  // Get all buses for operator
  getMyBuses: (params = {}) => api.get('/operators/buses', { params }),

  // Get single bus
  getById: (id) => api.get(`/operators/buses/${id}`),

  // Create bus
  create: (data) => api.post('/operators/buses', data),

  // Update bus
  update: (id, data) => api.put(`/operators/buses/${id}`, data),

  // Delete bus
  delete: (id) => api.delete(`/operators/buses/${id}`),

  // Change status
  changeStatus: (id, status) => api.put(`/operators/buses/${id}/status`, { status }),

  // Get statistics
  getStatistics: () => api.get('/operators/buses/statistics'),

  // Search buses
  search: (params) => api.get('/operators/buses', { params }),
};

// ==================== Employees ====================

export const employeesApi = {
  // Get all employees for operator
  getMyEmployees: (params = {}) => api.get('/operators/employees', { params }),

  // Get single employee
  getById: (id) => api.get(`/operators/employees/${id}`),

  // Create employee
  create: (data) => api.post('/operators/employees', data),

  // Update employee
  update: (id, data) => api.put(`/operators/employees/${id}`, data),

  // Delete employee
  delete: (id) => api.delete(`/operators/employees/${id}`),

  // Change status
  changeStatus: (id, status) => api.put(`/operators/employees/${id}/status`, { status }),

  // Get statistics
  getStatistics: () => api.get('/operators/employees/statistics'),

  // Get available employees for trips
  getAvailableForTrips: (role) => api.get(`/operators/employees/available/${role}`),

  // Reset password
  resetPassword: (id, newPassword) =>
    api.post(`/operators/employees/${id}/reset-password`, { newPassword }),
};

// ==================== Seat Layout Templates ====================

export const seatLayoutApi = {
  // Get all templates
  getAllTemplates: () => api.get('/buses/seat-layout/templates'),

  // Get templates by bus type
  getTemplatesByType: (busType) => api.get(`/buses/seat-layout/templates/${busType}`),

  // Get specific template
  getTemplate: (busType, templateName) =>
    api.get(`/buses/seat-layout/templates/${busType}/${templateName}`),

  // Build custom layout
  buildLayout: (data) => api.post('/buses/seat-layout/build', data),

  // Validate layout
  validateLayout: (data) => api.post('/buses/seat-layout/validate', data),
};

// Export all APIs
export default {
  auth: operatorAuth,
  routes: routesApi,
  buses: busesApi,
  employees: employeesApi,
  seatLayout: seatLayoutApi,
};
