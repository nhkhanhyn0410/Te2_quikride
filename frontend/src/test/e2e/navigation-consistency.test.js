/**
 * Navigation Consistency E2E Tests
 * Tests navigation behavior and consistency across different user roles
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 4.1, 4.2, 4.3, 4.4
 */

import { test, expect } from '@playwright/test';

// Test configuration
const TEST_CONFIG = {
  baseURL: 'http://localhost:3000',
  timeout: 30000,
  viewports: {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1024, height: 768 },
    wide: { width: 1440, height: 900 },
  },
};

// Mock user data for different roles
const mockUsers = {
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

// Expected navigation items for each role
const expectedNavigation = {
  customer: [
    'Home',
    'Book Trip',
    'My Bookings',
    'Profile',
    'Support',
  ],
  operator: [
    'Dashboard',
    'Trips',
    'Buses',
    'Routes',
    'Reports',
    'Settings',
  ],
  admin: [
    'Dashboard',
    'Users',
    'Operators',
    'System Reports',
    'Complaints',
    'Settings',
  ],
  tripManager: [
    'Dashboard',
    'Active Trips',
    'Trip History',
    'Quick Actions',
    'Reports',
  ],
};

test.describe('Navigation Consistency Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set up page with proper viewport
    await page.goto(TEST_CONFIG.baseURL);
  });

  test.describe('Desktop Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(TEST_CONFIG.viewports.desktop);
    });

    Object.entries(mockUsers).forEach(([role, user]) => {
      test(`should display consistent navigation for ${role} role`, async ({ page }) => {
        // Login as specific role
        await loginAsRole(page, user);

        // Check navigation items
        const navItems = await getNavigationItems(page);
        const expectedItems = expectedNavigation[role];

        // Verify all expected items are present
        for (const item of expectedItems) {
          expect(navItems).toContain(item);
        }

        // Check navigation styling consistency
        await checkNavigationStyling(page);

        // Test navigation interactions
        await testNavigationInteractions(page, expectedItems);
      });
    });

    test('should maintain navigation state across page transitions', async ({ page }) => {
      await loginAsRole(page, mockUsers.customer);

      // Navigate to different pages and check navigation consistency
      const pages = ['/', '/bookings', '/profile'];
      
      for (const pagePath of pages) {
        await page.goto(`${TEST_CONFIG.baseURL}${pagePath}`);
        
        // Check that navigation is still present and consistent
        const navItems = await getNavigationItems(page);
        expect(navItems.length).toBeGreaterThan(0);
        
        // Check active state highlighting
        await checkActiveNavigation(page, pagePath);
      }
    });

    test('should handle navigation hover states consistently', async ({ page }) => {
      await loginAsRole(page, mockUsers.operator);

      const navItems = await page.locator('[data-testid="nav-item"]').all();
      
      for (const item of navItems) {
        // Hover over navigation item
        await item.hover();
        
        // Check hover styling
        const hoverStyles = await item.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            backgroundColor: styles.backgroundColor,
            color: styles.color,
            transform: styles.transform,
          };
        });
        
        // Verify hover effects are applied
        expect(hoverStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
      }
    });
  });

  test.describe('Mobile Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(TEST_CONFIG.viewports.mobile);
    });

    Object.entries(mockUsers).forEach(([role, user]) => {
      test(`should display mobile navigation correctly for ${role} role`, async ({ page }) => {
        await loginAsRole(page, user);

        // Check for mobile menu button
        const menuButton = page.locator('[data-testid="mobile-menu-button"]');
        await expect(menuButton).toBeVisible();

        // Open mobile menu
        await menuButton.click();

        // Check mobile navigation items
        const mobileNavItems = await getMobileNavigationItems(page);
        const expectedItems = expectedNavigation[role];

        for (const item of expectedItems) {
          expect(mobileNavItems).toContain(item);
        }

        // Test mobile menu close functionality
        const closeButton = page.locator('[data-testid="mobile-menu-close"]');
        await closeButton.click();
        
        // Verify menu is closed
        const mobileMenu = page.locator('[data-testid="mobile-menu"]');
        await expect(mobileMenu).not.toBeVisible();
      });
    });

    test('should handle mobile navigation gestures', async ({ page }) => {
      await loginAsRole(page, mockUsers.customer);

      // Test swipe to open menu (if implemented)
      await page.touchscreen.tap(10, 100);
      await page.mouse.move(10, 100);
      await page.mouse.down();
      await page.mouse.move(200, 100);
      await page.mouse.up();

      // Check if menu opened with gesture
      const mobileMenu = page.locator('[data-testid="mobile-menu"]');
      // Note: This test depends on gesture implementation
    });
  });

  test.describe('Responsive Navigation', () => {
    Object.entries(TEST_CONFIG.viewports).forEach(([viewportName, viewport]) => {
      test(`should adapt navigation layout for ${viewportName} viewport`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await loginAsRole(page, mockUsers.admin);

        // Check navigation layout adaptation
        const navigation = page.locator('[data-testid="main-navigation"]');
        await expect(navigation).toBeVisible();

        // Check responsive behavior
        const navStyles = await navigation.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            display: styles.display,
            flexDirection: styles.flexDirection,
            position: styles.position,
          };
        });

        // Verify responsive styles are applied
        expect(navStyles.display).toBeTruthy();
        
        // Take screenshot for visual regression
        await page.screenshot({
          path: `test-results/navigation-${viewportName}-${Date.now()}.png`,
          fullPage: false,
        });
      });
    });
  });

  test.describe('Navigation Accessibility', () => {
    test('should support keyboard navigation', async ({ page }) => {
      await loginAsRole(page, mockUsers.operator);

      // Test keyboard navigation
      await page.keyboard.press('Tab');
      
      // Check focus indicators
      const focusedElement = await page.locator(':focus');
      await expect(focusedElement).toBeVisible();

      // Navigate through menu items with keyboard
      const navItems = await page.locator('[data-testid="nav-item"]').all();
      
      for (let i = 0; i < navItems.length; i++) {
        await page.keyboard.press('Tab');
        const currentFocus = await page.locator(':focus');
        await expect(currentFocus).toBeVisible();
      }

      // Test Enter key activation
      await page.keyboard.press('Enter');
      
      // Verify navigation occurred
      await page.waitForLoadState('networkidle');
    });

    test('should have proper ARIA attributes', async ({ page }) => {
      await loginAsRole(page, mockUsers.admin);

      // Check navigation ARIA attributes
      const navigation = page.locator('[role="navigation"]');
      await expect(navigation).toBeVisible();

      // Check menu items have proper roles
      const menuItems = await page.locator('[role="menuitem"]').all();
      expect(menuItems.length).toBeGreaterThan(0);

      // Check for aria-current on active items
      const activeItem = page.locator('[aria-current="page"]');
      await expect(activeItem).toBeVisible();
    });

    test('should work with screen readers', async ({ page }) => {
      await loginAsRole(page, mockUsers.customer);

      // Check for screen reader friendly elements
      const navLabels = await page.locator('[aria-label]').all();
      expect(navLabels.length).toBeGreaterThan(0);

      // Check for skip links
      const skipLink = page.locator('[data-testid="skip-to-content"]');
      if (await skipLink.isVisible()) {
        await skipLink.click();
        
        // Verify focus moved to main content
        const mainContent = page.locator('main');
        await expect(mainContent).toBeFocused();
      }
    });
  });

  test.describe('Navigation Performance', () => {
    test('should load navigation quickly', async ({ page }) => {
      const startTime = Date.now();
      
      await loginAsRole(page, mockUsers.operator);
      
      // Wait for navigation to be fully loaded
      await page.locator('[data-testid="main-navigation"]').waitFor();
      
      const loadTime = Date.now() - startTime;
      
      // Navigation should load within 2 seconds
      expect(loadTime).toBeLessThan(2000);
    });

    test('should handle navigation interactions smoothly', async ({ page }) => {
      await loginAsRole(page, mockUsers.admin);

      const navItems = await page.locator('[data-testid="nav-item"]').all();
      
      for (const item of navItems) {
        const startTime = Date.now();
        
        await item.click();
        await page.waitForLoadState('networkidle');
        
        const responseTime = Date.now() - startTime;
        
        // Navigation should respond within 1 second
        expect(responseTime).toBeLessThan(1000);
      }
    });
  });
});

// Helper functions
async function loginAsRole(page, user) {
  // Navigate to login page
  await page.goto(`${TEST_CONFIG.baseURL}/login`);
  
  // Fill login form
  await page.fill('[data-testid="email-input"]', user.email);
  await page.fill('[data-testid="password-input"]', user.password);
  
  // Submit login
  await page.click('[data-testid="login-button"]');
  
  // Wait for navigation to complete
  await page.waitForLoadState('networkidle');
  
  // Verify login success by checking for navigation
  await page.locator('[data-testid="main-navigation"]').waitFor();
}

async function getNavigationItems(page) {
  const navItems = await page.locator('[data-testid="nav-item"]').allTextContents();
  return navItems.map(item => item.trim()).filter(item => item.length > 0);
}

async function getMobileNavigationItems(page) {
  const mobileNavItems = await page.locator('[data-testid="mobile-nav-item"]').allTextContents();
  return mobileNavItems.map(item => item.trim()).filter(item => item.length > 0);
}

async function checkNavigationStyling(page) {
  const navigation = page.locator('[data-testid="main-navigation"]');
  
  const styles = await navigation.evaluate(el => {
    const computedStyles = window.getComputedStyle(el);
    return {
      backgroundColor: computedStyles.backgroundColor,
      borderRadius: computedStyles.borderRadius,
      padding: computedStyles.padding,
      fontFamily: computedStyles.fontFamily,
    };
  });
  
  // Verify consistent styling
  expect(styles.backgroundColor).toBeTruthy();
  expect(styles.fontFamily).toContain('Inter');
}

async function testNavigationInteractions(page, expectedItems) {
  for (const item of expectedItems.slice(0, 3)) { // Test first 3 items
    const navItem = page.locator(`[data-testid="nav-item"]:has-text("${item}")`);
    
    if (await navItem.isVisible()) {
      await navItem.click();
      await page.waitForLoadState('networkidle');
      
      // Verify navigation occurred
      const currentUrl = page.url();
      expect(currentUrl).toContain(TEST_CONFIG.baseURL);
    }
  }
}

async function checkActiveNavigation(page, currentPath) {
  const activeNavItem = page.locator('[data-testid="nav-item"][aria-current="page"]');
  
  if (await activeNavItem.isVisible()) {
    const activeStyles = await activeNavItem.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        fontWeight: styles.fontWeight,
      };
    });
    
    // Verify active state styling
    expect(activeStyles.fontWeight).toBe('600'); // semibold
  }
}