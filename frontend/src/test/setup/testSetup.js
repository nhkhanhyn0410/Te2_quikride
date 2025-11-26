/**
 * Test Setup Configuration
 * Global test setup for UI standardization tests
 */

import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { jest } from '@jest/globals';

// Configure testing library
configure({
  testIdAttribute: 'data-testid',
  // Increase timeout for complex component tests
  asyncUtilTimeout: 5000,
});

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver for responsive components
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver for lazy loading components
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock performance API for performance tests
Object.defineProperty(window, 'performance', {
  writable: true,
  value: {
    ...window.performance,
    memory: {
      usedJSHeapSize: 1000000,
      totalJSHeapSize: 2000000,
      jsHeapSizeLimit: 4000000,
    },
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByType: jest.fn(() => []),
    getEntriesByName: jest.fn(() => []),
  },
});

// Mock console methods to reduce noise in tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    // Suppress specific warnings that are expected in tests
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is deprecated') ||
       args[0].includes('Warning: componentWillReceiveProps') ||
       args[0].includes('Warning: componentWillMount'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args) => {
    // Suppress specific warnings that are expected in tests
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('deprecated') ||
       args[0].includes('legacy'))
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// Global test utilities
global.testUtils = {
  // Helper to create mock data
  createMockUser: (overrides = {}) => ({
    id: Math.floor(Math.random() * 1000),
    name: 'Test User',
    email: 'test@example.com',
    role: 'Customer',
    status: 'Active',
    createdAt: new Date().toISOString(),
    ...overrides,
  }),

  // Helper to create mock table data
  createMockTableData: (count = 5) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: ['Customer', 'Operator', 'Admin'][i % 3],
      status: ['Active', 'Inactive', 'Pending'][i % 3],
      createdAt: new Date(2023, i % 12, (i % 28) + 1).toISOString().split('T')[0],
    }));
  },

  // Helper to create mock chart data
  createMockChartData: (count = 6) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return Array.from({ length: count }, (_, i) => ({
      name: months[i % 12],
      value: Math.floor(Math.random() * 500) + 100,
      growth: Math.floor(Math.random() * 40) - 20,
    }));
  },

  // Helper to wait for async operations
  waitForAsync: (ms = 100) => new Promise(resolve => setTimeout(resolve, ms)),

  // Helper to simulate user interactions
  simulateUserInteraction: async (element, action = 'click') => {
    const { fireEvent } = await import('@testing-library/react');
    
    switch (action) {
      case 'click':
        fireEvent.click(element);
        break;
      case 'focus':
        fireEvent.focus(element);
        break;
      case 'blur':
        fireEvent.blur(element);
        break;
      case 'hover':
        fireEvent.mouseEnter(element);
        break;
      default:
        fireEvent.click(element);
    }
  },
};

// Mock Ant Design components that might cause issues in tests
jest.mock('antd', () => {
  const antd = jest.requireActual('antd');
  
  return {
    ...antd,
    // Mock components that might have issues in test environment
    DatePicker: (props) => {
      const React = require('react');
      return React.createElement('input', {
        'data-testid': 'date-picker',
        type: 'date',
        onChange: (e) => props.onChange?.(e.target.value),
        ...props,
      });
    },
    Upload: (props) => {
      const React = require('react');
      return React.createElement('input', {
        'data-testid': 'upload',
        type: 'file',
        onChange: (e) => props.onChange?.(e.target.files),
        ...props,
      });
    },
  };
});

// Setup for accessibility testing
import { toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

// Global error boundary for tests
class TestErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Test Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return React.createElement('div', {
        'data-testid': 'error-boundary',
        children: `Error: ${this.state.error?.message || 'Unknown error'}`
      });
    }

    return this.props.children;
  }
}

global.TestErrorBoundary = TestErrorBoundary;

// Cleanup after each test
afterEach(() => {
  // Clear all mocks
  jest.clearAllMocks();
  
  // Reset DOM
  document.body.innerHTML = '';
  
  // Reset any global state
  if (global.testState) {
    global.testState = {};
  }
});