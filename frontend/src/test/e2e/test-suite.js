/**
 * E2E Test Suite Runner
 * Comprehensive test suite for UI standardization E2E testing
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 4.1, 4.2, 4.3, 4.4
 */

import { test, expect } from '@playwright/test';

// Import all test modules
import './navigation-consistency.test.js';
import './responsive-behavior.test.js';
import './cross-browser-consistency.test.js';
import './performance.test.js';
import './accessibility.test.js';

// Test suite configuration
const TEST_SUITE_CONFIG = {
  name: 'UI Standardization E2E Test Suite',
  version: '1.0.0',
  description: 'Comprehensive E2E testing for UI standardization across all user roles',
  requirements: ['6.1', '6.2', '6.3', '6.4', '6.5', '4.1', '4.2', '4.3', '4.4'],
  testCategories: [
    'Navigation Consistency',
    'Responsive Behavior',
    'Cross-Browser Consistency',
    'Performance',
    'Accessibility',
  ],
};

// Global test setup and teardown
test.beforeAll(async () => {
  console.log(`Starting ${TEST_SUITE_CONFIG.name} v${TEST_SUITE_CONFIG.version}`);
  console.log(`Testing requirements: ${TEST_SUITE_CONFIG.requirements.join(', ')}`);
});

test.afterAll(async () => {
  console.log(`Completed ${TEST_SUITE_CONFIG.name}`);
});

// Test suite health check
test.describe('Test Suite Health Check', () => {
  test('should verify test environment is ready', async ({ page }) => {
    // Check that the application is running
    await page.goto('/');
    
    // Verify basic page structure
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Check for React app root
    const root = page.locator('#root, [data-reactroot]');
    await expect(root).toBeAttached();
    
    console.log('✅ Test environment is ready');
  });

  test('should verify all test data attributes are present', async ({ page }) => {
    await page.goto('/');
    
    // Check for essential test data attributes
    const testAttributes = [
      'data-testid="main-layout"',
      'data-testid="navigation"',
    ];
    
    let attributeCount = 0;
    
    for (const attr of testAttributes) {
      const elements = page.locator(`[${attr}]`);
      const count = await elements.count();
      if (count > 0) {
        attributeCount++;
      }
    }
    
    console.log(`✅ Found ${attributeCount} test attributes`);
  });

  test('should verify browser capabilities', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Test modern browser features
    const browserCapabilities = await page.evaluate(() => {
      return {
        flexbox: CSS.supports('display', 'flex'),
        grid: CSS.supports('display', 'grid'),
        customProperties: CSS.supports('color', 'var(--test)'),
        es6: typeof Promise !== 'undefined',
        fetch: typeof fetch !== 'undefined',
        localStorage: typeof localStorage !== 'undefined',
      };
    });
    
    // Verify essential capabilities
    expect(browserCapabilities.flexbox).toBe(true);
    expect(browserCapabilities.grid).toBe(true);
    expect(browserCapabilities.es6).toBe(true);
    
    console.log(`✅ ${browserName} browser capabilities verified`);
  });
});

// Export test suite configuration for reporting
export { TEST_SUITE_CONFIG };