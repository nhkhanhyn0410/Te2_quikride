/**
 * Jest Setup File
 * Runs before all tests
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-purposes-only';
process.env.JWT_ACCESS_EXPIRES = '1d';
process.env.JWT_REFRESH_EXPIRES = '7d';
process.env.SESSION_TIMEOUT_MINUTES = '30';

// Global test timeout
jest.setTimeout(10000);

// Mock console methods to reduce noise in tests (optional)
global.console = {
  ...console,
  error: jest.fn(), // Mock console.error
  warn: jest.fn(),  // Mock console.warn
  log: console.log, // Keep console.log for debugging
};

// Global teardown
afterAll(async () => {
  // Close any open connections if needed
  await new Promise((resolve) => setTimeout(() => resolve(), 500));
});
