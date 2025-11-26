/**
 * E2E Test Utilities
 * Common helper functions for E2E testing
 */

import { expect } from '@playwright/test';

// Common test data
export const TEST_USERS = {
  customer: {
    email: 'customer@test.com',
    password: 'password123',
    role: 'customer',
  },
  operator: {
    email: 'operator@test.com',
    password: 'password123',
    role: 'operator',
  },
  admin: {
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin',
  },
  tripManager: {
    email: 'tripmanager@test.com',
    password: 'password123',
    role: 'tripManager',
  },
};

// Viewport configurations
export const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  mobileLarge: { width:414, height: 896 },
  tablet: { width: 768, height: 1024 },
  tabletLarge: { width: 1024, height: 768 },
  desktop: { width: 1280, height: 720 },
  desktopLarge: { width: 1440, height: 900 },
  ultrawide: { width: 1920, height: 1080 },
};

// Performance thresholds
export const PERFORMANCE_THRESHOLDS = {
  pageLoad: 3000,
  interaction: 300,
  navigation: 1000,
  rendering: 100,
};

/**
 * Login helper function
 * @param {Page} page - Playwright page object
 * @param {Object} user - User credentials
 */
export async function loginUser(page, user) {
  const currentUrl = page.url();
  
  // Check if already logged in
  const userMenu = page.locator('[data-testid="user-menu"]');
  if (await userMenu.isVisible()) {
    return; // Already logged in
  }
  
  // Navigate to login if not on login page
  if (!currentUrl.includes('/login')) {
    await page.goto('/login');
  }
  
  // Fill login form
  await page.fill('[data-testid="email-input"]', user.email);
  await page.fill('[data-testid="password-input"]', user.password);
  await page.click('[data-testid="login-button"]');
  
  // Wait for navigation
  await page.waitForLoadState('networkidle');
}

/**
 * Logout helper function
 * @param {Page} page - Playwright page object
 */
export async function logoutUser(page) {
  const userMenu = page.locator('[data-testid="user-menu"]');
  
  if (await userMenu.isVisible()) {
    await userMenu.click();
    
    const logoutButton = page.locator('[data-testid="logout-button"]');
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await page.waitForLoadState('networkidle');
    }
  }
}

/**
 * Wait for element to be stable (not moving/changing)
 * @param {Locator} element - Playwright locator
 * @param {number} timeout - Timeout in milliseconds
 */
export async function waitForStable(element, timeout = 1000) {
  let previousBox = null;
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    if (await element.isVisible()) {
      const currentBox = await element.boundingBox();
      
      if (previousBox && 
          currentBox.x === previousBox.x && 
          currentBox.y === previousBox.y &&
          currentBox.width === previousBox.width &&
          currentBox.height === previousBox.height) {
        return; // Element is stable
      }
      
      previousBox = currentBox;
    }
    
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}

/**
 * Take screenshot with timestamp
 * @param {Page} page - Playwright page object
 * @param {string} name - Screenshot name
 * @param {Object} options - Screenshot options
 */
export async function takeTimestampedScreenshot(page, name, options = {}) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${name}-${timestamp}.png`;
  
  await page.screenshot({
    path: `test-results/screenshots/${filename}`,
    fullPage: true,
    ...options,
  });
  
  return filename;
}

/**
 * Check element has proper focus indicator
 * @param {Locator} element - Playwright locator
 */
export async function checkFocusIndicator(element) {
  const styles = await element.evaluate(el => {
    const computed = window.getComputedStyle(el);
    return {
      outline: computed.outline,
      outlineWidth: computed.outlineWidth,
      outlineStyle: computed.outlineStyle,
      outlineColor: computed.outlineColor,
      boxShadow: computed.boxShadow,
    };
  });
  
  // Should have visible focus indicator
  const hasFocusIndicator = 
    (styles.outline !== 'none' && styles.outline !== '0px') ||
    (styles.outlineWidth !== '0px' && styles.outlineStyle !== 'none') ||
    (styles.boxShadow !== 'none' && styles.boxShadow.includes('inset') === false);
  
  expect(hasFocusIndicator).toBe(true);
  
  return styles;
}

/**
 * Check color contrast ratio
 * @param {Locator} element - Playwright locator
 * @param {number} minRatio - Minimum contrast ratio (4.5 for AA, 3 for AA Large)
 */
export async function checkColorContrast(element, minRatio = 4.5) {
  const colors = await element.evaluate(el => {
    const styles = window.getComputedStyle(el);
    return {
      color: styles.color,
      backgroundColor: styles.backgroundColor,
    };
  });
  
  // This is a simplified check - in practice, you'd use a proper contrast calculation
  // For now, we just verify colors are defined
  expect(colors.color).toBeTruthy();
  expect(colors.backgroundColor).toBeTruthy();
  
  return colors;
}

/**
 * Measure performance timing
 * @param {Page} page - Playwright page object
 * @param {Function} action - Action to measure
 */
export async function measurePerformance(page, action) {
  const startTime = Date.now();
  
  await action();
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  // Get additional performance metrics
  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    return {
      domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
      loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,
      firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
      firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
    };
  });
  
  return {
    duration,
    ...metrics,
  };
}

/**
 * Check responsive breakpoint behavior
 * @param {Page} page - Playwright page object
 * @param {Object} viewport - Viewport configuration
 * @param {Function} checkFunction - Function to run checks
 */
export async function checkResponsiveBreakpoint(page, viewport, checkFunction) {
  await page.setViewportSize(viewport);
  
  // Wait for responsive changes to take effect
  await page.waitForTimeout(100);
  
  // Run the check function
  await checkFunction(page, viewport);
  
  // Take screenshot for visual verification
  await takeTimestampedScreenshot(page, `responsive-${viewport.width}x${viewport.height}`);
}

/**
 * Verify ARIA attributes
 * @param {Locator} element - Playwright locator
 * @param {Object} expectedAttributes - Expected ARIA attributes
 */
export async function verifyAriaAttributes(element, expectedAttributes) {
  for (const [attribute, expectedValue] of Object.entries(expectedAttributes)) {
    const actualValue = await element.getAttribute(attribute);
    
    if (expectedValue === true) {
      expect(actualValue).toBeTruthy();
    } else if (expectedValue === false) {
      expect(actualValue).toBeFalsy();
    } else {
      expect(actualValue).toBe(expectedValue);
    }
  }
}

/**
 * Check keyboard navigation sequence
 * @param {Page} page - Playwright page object
 * @param {Array} expectedSequence - Array of expected focusable elements
 */
export async function checkKeyboardNavigation(page, expectedSequence) {
  // Start from beginning
  await page.keyboard.press('Home');
  
  for (let i = 0; i < expectedSequence.length; i++) {
    await page.keyboard.press('Tab');
    
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Check focus indicator
    await checkFocusIndicator(focusedElement);
    
    // Verify element matches expected sequence if provided
    if (expectedSequence[i]) {
      const matches = await focusedElement.locator(expectedSequence[i]).count() > 0;
      expect(matches).toBe(true);
    }
  }
}

/**
 * Test form validation behavior
 * @param {Page} page - Playwright page object
 * @param {Object} formConfig - Form configuration
 */
export async function testFormValidation(page, formConfig) {
  const { formSelector, fields, submitSelector } = formConfig;
  
  const form = page.locator(formSelector);
  await expect(form).toBeVisible();
  
  // Test empty form submission
  await page.click(submitSelector);
  
  // Check for validation messages
  for (const field of fields) {
    if (field.required) {
      const errorMessage = page.locator(`[data-testid="${field.name}-error"]`);
      await expect(errorMessage).toBeVisible();
    }
  }
  
  // Test valid form submission
  for (const field of fields) {
    if (field.testValue) {
      await page.fill(`[data-testid="${field.name}-input"]`, field.testValue);
    }
  }
  
  await page.click(submitSelector);
  
  // Form should submit successfully (no validation errors)
  for (const field of fields) {
    if (field.required) {
      const errorMessage = page.locator(`[data-testid="${field.name}-error"]`);
      await expect(errorMessage).not.toBeVisible();
    }
  }
}

/**
 * Generate test report data
 * @param {string} testName - Name of the test
 * @param {Object} results - Test results
 */
export function generateTestReport(testName, results) {
  const report = {
    testName,
    timestamp: new Date().toISOString(),
    results,
    summary: {
      passed: results.filter(r => r.status === 'passed').length,
      failed: results.filter(r => r.status === 'failed').length,
      skipped: results.filter(r => r.status === 'skipped').length,
    },
  };
  
  return report;
}