/**
 * Performance E2E Tests
 * Tests page load times and interaction responsiveness
 * Requirements: 4.1, 4.2, 4.3, 4.4, 6.1, 6.2, 6.3, 6.4, 6.5
 */

import { test, expect } from '@playwright/test';

// Performance thresholds (in milliseconds)
const PERFORMANCE_THRESHOLDS = {
  pageLoad: {
    fast: 1500,
    acceptable: 3000,
    slow: 5000,
  },
  interaction: {
    fast: 100,
    acceptable: 300,
    slow: 1000,
  },
  navigation: {
    fast: 500,
    acceptable: 1000,
    slow: 2000,
  },
  rendering: {
    fast: 16, // 60fps
    acceptable: 33, // 30fps
    slow: 100,
  },
};

// Test pages with expected performance characteristics
const TEST_PAGES = [
  { path: '/', name: 'Home', expectedLoad: 'fast' },
  { path: '/login', name: 'Login', expectedLoad: 'fast' },
  { path: '/dashboard', name: 'Dashboard', expectedLoad: 'acceptable' },
  { path: '/bookings', name: 'Bookings', expectedLoad: 'acceptable' },
  { path: '/profile', name: 'Profile', expectedLoad: 'fast' },
];

// Mock user for testing
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  role: 'customer',
};

test.describe('Performance Tests', () => {
  test.describe('Page Load Performance', () => {
    TEST_PAGES.forEach(({ path, name, expectedLoad }) => {
      test(`should load ${name} page within ${expectedLoad} threshold`, async ({ page }) => {
        // Start performance measurement
        const startTime = Date.now();
        
        // Navigate to page
        await page.goto(path);
        
        // Wait for page to be fully loaded
        await page.waitForLoadState('networkidle');
        
        const loadTime = Date.now() - startTime;
        const threshold = PERFORMANCE_THRESHOLDS.pageLoad[expectedLoad];
        
        // Check load time meets threshold
        expect(loadTime).toBeLessThan(threshold);
        
        console.log(`${name} page loaded in ${loadTime}ms (threshold: ${threshold}ms)`);
      });
    });

    test('should load critical resources quickly', async ({ page }) => {
      // Monitor network requests
      const resourceTimes = [];
      
      page.on('response', response => {
        const request = response.request();
        const resourceType = request.resourceType();
        
        // Track critical resources
        if (['document', 'stylesheet', 'script'].includes(resourceType)) {
          resourceTimes.push({
            url: request.url(),
            type: resourceType,
            status: response.status(),
            timing: response.timing(),
          });
        }
      });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check critical resource load times
      for (const resource of resourceTimes) {
        if (resource.timing) {
          const responseTime = resource.timing.responseEnd - resource.timing.requestStart;
          
          // Critical resources should load within 2 seconds
          expect(responseTime).toBeLessThan(2000);
          
          console.log(`${resource.type} (${resource.url.split('/').pop()}) loaded in ${responseTime}ms`);
        }
      }
    });

    test('should handle concurrent page loads efficiently', async ({ browser }) => {
      // Create multiple pages to simulate concurrent users
      const pages = await Promise.all([
        browser.newPage(),
        browser.newPage(),
        browser.newPage(),
      ]);
      
      try {
        // Load pages concurrently
        const startTime = Date.now();
        
        await Promise.all(pages.map(async (page, index) => {
          await page.goto(`/?user=${index}`);
          await page.waitForLoadState('networkidle');
        }));
        
        const totalTime = Date.now() - startTime;
        
        // Concurrent loads should not significantly impact performance
        expect(totalTime).toBeLessThan(PERFORMANCE_THRESHOLDS.pageLoad.slow);
        
        console.log(`Concurrent page loads completed in ${totalTime}ms`);
      } finally {
        // Clean up pages
        await Promise.all(pages.map(page => page.close()));
      }
    });
  });

  test.describe('Interaction Performance', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await loginUser(page, testUser);
    });

    test('should respond to button clicks quickly', async ({ page }) => {
      // Find interactive buttons
      const buttons = page.locator('button, [role="button"]');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < Math.min(buttonCount, 5); i++) {
        const button = buttons.nth(i);
        
        if (await button.isVisible() && await button.isEnabled()) {
          const startTime = Date.now();
          
          // Click button and wait for response
          await button.click();
          
          // Wait for any visual feedback or navigation
          await page.waitForTimeout(50); // Small delay to capture response
          
          const responseTime = Date.now() - startTime;
          
          // Button should respond within acceptable threshold
          expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.interaction.acceptable);
          
          console.log(`Button ${i} responded in ${responseTime}ms`);
        }
      }
    });

    test('should handle form input efficiently', async ({ page }) => {
      // Navigate to a form page
      await page.goto('/profile');
      
      // Find form inputs
      const inputs = page.locator('input, textarea, select');
      const inputCount = await inputs.count();
      
      for (let i = 0; i < Math.min(inputCount, 5); i++) {
        const input = inputs.nth(i);
        
        if (await input.isVisible() && await input.isEnabled()) {
          const startTime = Date.now();
          
          // Type in input
          await input.fill('test input');
          
          const responseTime = Date.now() - startTime;
          
          // Input should respond quickly
          expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.interaction.fast);
          
          console.log(`Input ${i} responded in ${responseTime}ms`);
        }
      }
    });

    test('should handle scroll performance', async ({ page }) => {
      // Navigate to a page with scrollable content
      await page.goto('/dashboard');
      
      // Measure scroll performance
      const scrollMetrics = await page.evaluate(() => {
        return new Promise((resolve) => {
          const startTime = performance.now();
          let frameCount = 0;
          
          const measureFrame = () => {
            frameCount++;
            if (frameCount < 60) { // Measure for ~1 second at 60fps
              requestAnimationFrame(measureFrame);
            } else {
              const endTime = performance.now();
              resolve({
                duration: endTime - startTime,
                frames: frameCount,
                fps: frameCount / ((endTime - startTime) / 1000),
              });
            }
          };
          
          // Start scrolling
          window.scrollBy(0, 10);
          requestAnimationFrame(measureFrame);
        });
      });
      
      // Should maintain reasonable frame rate during scroll
      expect(scrollMetrics.fps).toBeGreaterThan(30);
      
      console.log(`Scroll performance: ${scrollMetrics.fps.toFixed(2)} FPS`);
    });
  });

  test.describe('Navigation Performance', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await loginUser(page, testUser);
    });

    test('should navigate between pages quickly', async ({ page }) => {
      const navigationTests = [
        { from: '/', to: '/dashboard', name: 'Home to Dashboard' },
        { from: '/dashboard', to: '/bookings', name: 'Dashboard to Bookings' },
        { from: '/bookings', to: '/profile', name: 'Bookings to Profile' },
      ];
      
      for (const { from, to, name } of navigationTests) {
        await page.goto(from);
        await page.waitForLoadState('networkidle');
        
        const startTime = Date.now();
        
        // Navigate to next page
        await page.goto(to);
        await page.waitForLoadState('networkidle');
        
        const navigationTime = Date.now() - startTime;
        
        // Navigation should be within acceptable threshold
        expect(navigationTime).toBeLessThan(PERFORMANCE_THRESHOLDS.navigation.acceptable);
        
        console.log(`${name} navigation took ${navigationTime}ms`);
      }
    });

    test('should handle menu interactions efficiently', async ({ page }) => {
      // Test navigation menu performance
      const navItems = page.locator('[data-testid="nav-item"]');
      const navCount = await navItems.count();
      
      for (let i = 0; i < Math.min(navCount, 3); i++) {
        const navItem = navItems.nth(i);
        
        if (await navItem.isVisible()) {
          const startTime = Date.now();
          
          // Click navigation item
          await navItem.click();
          await page.waitForLoadState('networkidle');
          
          const navigationTime = Date.now() - startTime;
          
          // Menu navigation should be fast
          expect(navigationTime).toBeLessThan(PERFORMANCE_THRESHOLDS.navigation.fast);
          
          console.log(`Menu navigation ${i} took ${navigationTime}ms`);
        }
      }
    });

    test('should handle mobile menu performance', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Test mobile menu performance
      const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
      
      if (await mobileMenuButton.isVisible()) {
        const startTime = Date.now();
        
        // Open mobile menu
        await mobileMenuButton.click();
        
        // Wait for menu to be visible
        const mobileMenu = page.locator('[data-testid="mobile-menu"]');
        await expect(mobileMenu).toBeVisible();
        
        const openTime = Date.now() - startTime;
        
        // Mobile menu should open quickly
        expect(openTime).toBeLessThan(PERFORMANCE_THRESHOLDS.interaction.acceptable);
        
        console.log(`Mobile menu opened in ${openTime}ms`);
        
        // Test closing performance
        const closeStartTime = Date.now();
        
        const closeButton = page.locator('[data-testid="mobile-menu-close"]');
        await closeButton.click();
        await expect(mobileMenu).not.toBeVisible();
        
        const closeTime = Date.now() - closeStartTime;
        
        expect(closeTime).toBeLessThan(PERFORMANCE_THRESHOLDS.interaction.acceptable);
        
        console.log(`Mobile menu closed in ${closeTime}ms`);
      }
    });
  });

  test.describe('Resource Loading Performance', () => {
    test('should load images efficiently', async ({ page }) => {
      const imageLoadTimes = [];
      
      // Monitor image loading
      page.on('response', response => {
        const request = response.request();
        if (request.resourceType() === 'image') {
          const timing = response.timing();
          if (timing) {
            imageLoadTimes.push({
              url: request.url(),
              loadTime: timing.responseEnd - timing.requestStart,
              size: response.headers()['content-length'],
            });
          }
        }
      });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check image load performance
      for (const image of imageLoadTimes) {
        // Images should load within 3 seconds
        expect(image.loadTime).toBeLessThan(3000);
        
        console.log(`Image loaded in ${image.loadTime}ms (${image.size} bytes)`);
      }
    });

    test('should handle CSS loading efficiently', async ({ page }) => {
      const cssLoadTimes = [];
      
      // Monitor CSS loading
      page.on('response', response => {
        const request = response.request();
        if (request.resourceType() === 'stylesheet') {
          const timing = response.timing();
          if (timing) {
            cssLoadTimes.push({
              url: request.url(),
              loadTime: timing.responseEnd - timing.requestStart,
            });
          }
        }
      });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check CSS load performance
      for (const css of cssLoadTimes) {
        // CSS should load within 2 seconds
        expect(css.loadTime).toBeLessThan(2000);
        
        console.log(`CSS loaded in ${css.loadTime}ms`);
      }
    });

    test('should handle JavaScript loading efficiently', async ({ page }) => {
      const jsLoadTimes = [];
      
      // Monitor JavaScript loading
      page.on('response', response => {
        const request = response.request();
        if (request.resourceType() === 'script') {
          const timing = response.timing();
          if (timing) {
            jsLoadTimes.push({
              url: request.url(),
              loadTime: timing.responseEnd - timing.requestStart,
            });
          }
        }
      });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check JavaScript load performance
      for (const js of jsLoadTimes) {
        // JavaScript should load within 3 seconds
        expect(js.loadTime).toBeLessThan(3000);
        
        console.log(`JavaScript loaded in ${js.loadTime}ms`);
      }
    });
  });

  test.describe('Memory and CPU Performance', () => {
    test('should maintain reasonable memory usage', async ({ page }) => {
      await page.goto('/');
      await loginUser(page, testUser);
      
      // Get initial memory usage
      const initialMetrics = await page.evaluate(() => {
        if (performance.memory) {
          return {
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize,
            jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
          };
        }
        return null;
      });
      
      if (initialMetrics) {
        // Navigate through several pages to test memory usage
        const pages = ['/dashboard', '/bookings', '/profile', '/'];
        
        for (const pagePath of pages) {
          await page.goto(pagePath);
          await page.waitForLoadState('networkidle');
        }
        
        // Get final memory usage
        const finalMetrics = await page.evaluate(() => {
          if (performance.memory) {
            return {
              usedJSHeapSize: performance.memory.usedJSHeapSize,
              totalJSHeapSize: performance.memory.totalJSHeapSize,
              jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
            };
          }
          return null;
        });
        
        if (finalMetrics) {
          const memoryIncrease = finalMetrics.usedJSHeapSize - initialMetrics.usedJSHeapSize;
          const memoryIncreasePercent = (memoryIncrease / initialMetrics.usedJSHeapSize) * 100;
          
          // Memory increase should be reasonable (less than 50% increase)
          expect(memoryIncreasePercent).toBeLessThan(50);
          
          console.log(`Memory usage increased by ${memoryIncreasePercent.toFixed(2)}%`);
        }
      }
    });

    test('should handle large datasets efficiently', async ({ page }) => {
      await page.goto('/');
      await loginUser(page, testUser);
      
      // Navigate to a page that might have large datasets
      await page.goto('/dashboard');
      
      // Measure rendering performance with large datasets
      const renderingMetrics = await page.evaluate(() => {
        return new Promise((resolve) => {
          const startTime = performance.now();
          
          // Simulate adding many DOM elements
          const container = document.createElement('div');
          for (let i = 0; i < 1000; i++) {
            const element = document.createElement('div');
            element.textContent = `Item ${i}`;
            container.appendChild(element);
          }
          
          document.body.appendChild(container);
          
          requestAnimationFrame(() => {
            const endTime = performance.now();
            
            // Clean up
            document.body.removeChild(container);
            
            resolve({
              renderTime: endTime - startTime,
              elementCount: 1000,
            });
          });
        });
      });
      
      // Large dataset rendering should be efficient
      expect(renderingMetrics.renderTime).toBeLessThan(100);
      
      console.log(`Rendered ${renderingMetrics.elementCount} elements in ${renderingMetrics.renderTime.toFixed(2)}ms`);
    });
  });
});

// Helper functions
async function loginUser(page, user) {
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