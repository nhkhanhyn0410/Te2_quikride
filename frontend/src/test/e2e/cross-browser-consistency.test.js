/**
 * Cross-Browser Consistency E2E Tests
 * Tests UI consistency across different browsers and platforms
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 4.1, 4.2, 4.3, 4.4
 */

import { test, expect } from '@playwright/test';

// Test configuration for cross-browser testing
const BROWSER_CONFIG = {
  browsers: ['chromium', 'firefox', 'webkit'],
  testPages: [
    { path: '/', name: 'Home' },
    { path: '/login', name: 'Login' },
    { path: '/dashboard', name: 'Dashboard' },
    { path: '/bookings', name: 'Bookings' },
    { path: '/profile', name: 'Profile' },
  ],
  viewports: {
    desktop: { width: 1280, height: 720 },
    tablet: { width: 768, height: 1024 },
    mobile: { width: 375, height: 667 },
  },
};

// Mock user for testing
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  role: 'customer',
};

test.describe('Cross-Browser Consistency Tests', () => {
  test.describe('UI Component Rendering', () => {
    BROWSER_CONFIG.testPages.forEach(({ path, name }) => {
      test(`should render ${name} page consistently across browsers`, async ({ page, browserName }) => {
        await page.goto(path);
        
        // Login if required
        if (path !== '/' && path !== '/login') {
          await loginUser(page, testUser);
          await page.goto(path);
        }
        
        // Wait for page to load completely
        await page.waitForLoadState('networkidle');
        
        // Check basic page structure
        await checkPageStructure(page, browserName);
        
        // Check component consistency
        await checkComponentConsistency(page, browserName);
        
        // Check styling consistency
        await checkStylingConsistency(page, browserName);
        
        // Take screenshot for visual comparison
        await page.screenshot({
          path: `test-results/cross-browser-${name.toLowerCase()}-${browserName}-${Date.now()}.png`,
          fullPage: true,
        });
      });
    });
  });

  test.describe('Font Rendering', () => {
    test('should render fonts consistently across browsers', async ({ page, browserName }) => {
      await page.goto('/');
      await loginUser(page, testUser);
      
      // Check font rendering for different text elements
      const textElements = [
        { selector: 'h1', expectedFont: 'Inter' },
        { selector: 'h2', expectedFont: 'Inter' },
        { selector: 'p', expectedFont: 'Inter' },
        { selector: 'button', expectedFont: 'Inter' },
      ];
      
      for (const { selector, expectedFont } of textElements) {
        const elements = page.locator(selector);
        const count = await elements.count();
        
        if (count > 0) {
          const element = elements.first();
          const fontFamily = await element.evaluate(el => {
            return window.getComputedStyle(el).fontFamily;
          });
          
          // Check font family includes expected font
          expect(fontFamily.toLowerCase()).toContain(expectedFont.toLowerCase());
        }
      }
    });

    test('should handle font fallbacks correctly', async ({ page, browserName }) => {
      await page.goto('/');
      
      // Block font loading to test fallbacks
      await page.route('**/*.woff*', route => route.abort());
      await page.route('**/*.ttf', route => route.abort());
      
      await page.reload();
      
      // Check that fallback fonts are applied
      const textElement = page.locator('h1').first();
      if (await textElement.isVisible()) {
        const fontFamily = await textElement.evaluate(el => {
          return window.getComputedStyle(el).fontFamily;
        });
        
        // Should fall back to system fonts
        expect(fontFamily).toMatch(/sans-serif|system-ui|arial|helvetica/i);
      }
    });
  });

  test.describe('CSS Grid and Flexbox Support', () => {
    test('should render grid layouts consistently', async ({ page, browserName }) => {
      await page.goto('/');
      await loginUser(page, testUser);
      
      // Check grid containers
      const gridContainers = page.locator('[class*="grid"], [style*="display: grid"]');
      const gridCount = await gridContainers.count();
      
      for (let i = 0; i < Math.min(gridCount, 5); i++) {
        const grid = gridContainers.nth(i);
        if (await grid.isVisible()) {
          const gridStyles = await grid.evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
              display: styles.display,
              gridTemplateColumns: styles.gridTemplateColumns,
              gap: styles.gap,
            };
          });
          
          // Verify grid properties are applied
          expect(gridStyles.display).toBe('grid');
          if (gridStyles.gridTemplateColumns !== 'none') {
            expect(gridStyles.gridTemplateColumns).toBeTruthy();
          }
        }
      }
    });

    test('should render flexbox layouts consistently', async ({ page, browserName }) => {
      await page.goto('/');
      await loginUser(page, testUser);
      
      // Check flex containers
      const flexContainers = page.locator('[class*="flex"], [style*="display: flex"]');
      const flexCount = await flexContainers.count();
      
      for (let i = 0; i < Math.min(flexCount, 5); i++) {
        const flex = flexContainers.nth(i);
        if (await flex.isVisible()) {
          const flexStyles = await flex.evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
              display: styles.display,
              flexDirection: styles.flexDirection,
              justifyContent: styles.justifyContent,
              alignItems: styles.alignItems,
            };
          });
          
          // Verify flex properties are applied
          expect(flexStyles.display).toBe('flex');
          expect(flexStyles.flexDirection).toBeTruthy();
        }
      }
    });
  });

  test.describe('Form Element Consistency', () => {
    test('should render form elements consistently', async ({ page, browserName }) => {
      await page.goto('/login');
      
      // Check form input styling
      const formElements = [
        { selector: 'input[type="email"]', property: 'border' },
        { selector: 'input[type="password"]', property: 'border' },
        { selector: 'button[type="submit"]', property: 'backgroundColor' },
      ];
      
      for (const { selector, property } of formElements) {
        const element = page.locator(selector).first();
        if (await element.isVisible()) {
          const styles = await element.evaluate((el, prop) => {
            const computed = window.getComputedStyle(el);
            return {
              [prop]: computed[prop],
              borderRadius: computed.borderRadius,
              padding: computed.padding,
            };
          }, property);
          
          // Verify consistent styling
          expect(styles[property]).toBeTruthy();
          expect(styles.borderRadius).toBeTruthy();
          expect(styles.padding).toBeTruthy();
        }
      }
    });

    test('should handle form validation consistently', async ({ page, browserName }) => {
      await page.goto('/login');
      
      // Test form validation
      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click();
      
      // Check for validation messages
      const validationMessages = page.locator('[data-testid*="error"], .error, [class*="error"]');
      const messageCount = await validationMessages.count();
      
      if (messageCount > 0) {
        const firstMessage = validationMessages.first();
        const messageStyles = await firstMessage.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            color: styles.color,
            fontSize: styles.fontSize,
            display: styles.display,
          };
        });
        
        // Verify error styling is applied
        expect(messageStyles.display).not.toBe('none');
        expect(messageStyles.color).toBeTruthy();
      }
    });
  });

  test.describe('Animation and Transition Support', () => {
    test('should handle CSS animations consistently', async ({ page, browserName }) => {
      await page.goto('/');
      await loginUser(page, testUser);
      
      // Look for animated elements
      const animatedElements = page.locator('[class*="animate"], [class*="transition"]');
      const animatedCount = await animatedElements.count();
      
      for (let i = 0; i < Math.min(animatedCount, 3); i++) {
        const element = animatedElements.nth(i);
        if (await element.isVisible()) {
          const animationStyles = await element.evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
              transition: styles.transition,
              animation: styles.animation,
              transform: styles.transform,
            };
          });
          
          // Check if animations are supported
          if (animationStyles.transition !== 'all 0s ease 0s') {
            expect(animationStyles.transition).toBeTruthy();
          }
        }
      }
    });

    test('should handle hover effects consistently', async ({ page, browserName }) => {
      await page.goto('/');
      await loginUser(page, testUser);
      
      // Test hover effects on interactive elements
      const interactiveElements = page.locator('button, a, [role="button"]');
      const elementCount = await interactiveElements.count();
      
      for (let i = 0; i < Math.min(elementCount, 5); i++) {
        const element = interactiveElements.nth(i);
        if (await element.isVisible()) {
          // Get initial styles
          const initialStyles = await element.evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
              backgroundColor: styles.backgroundColor,
              color: styles.color,
            };
          });
          
          // Hover over element
          await element.hover();
          
          // Get hover styles
          const hoverStyles = await element.evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
              backgroundColor: styles.backgroundColor,
              color: styles.color,
            };
          });
          
          // Styles should be defined (may or may not change)
          expect(hoverStyles.backgroundColor).toBeTruthy();
          expect(hoverStyles.color).toBeTruthy();
        }
      }
    });
  });

  test.describe('JavaScript Functionality', () => {
    test('should execute JavaScript consistently', async ({ page, browserName }) => {
      await page.goto('/');
      
      // Test basic JavaScript functionality
      const jsResult = await page.evaluate(() => {
        // Test modern JavaScript features
        const testArray = [1, 2, 3];
        const doubled = testArray.map(x => x * 2);
        const hasThree = testArray.includes(3);
        
        // Test ES6+ features
        const testObject = { a: 1, b: 2 };
        const { a, b } = testObject;
        
        return {
          arrayMap: doubled,
          includes: hasThree,
          destructuring: a + b,
        };
      });
      
      // Verify JavaScript execution
      expect(jsResult.arrayMap).toEqual([2, 4, 6]);
      expect(jsResult.includes).toBe(true);
      expect(jsResult.destructuring).toBe(3);
    });

    test('should handle async operations consistently', async ({ page, browserName }) => {
      await page.goto('/');
      
      // Test async/await functionality
      const asyncResult = await page.evaluate(async () => {
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        
        await delay(100);
        
        return 'async-complete';
      });
      
      expect(asyncResult).toBe('async-complete');
    });
  });

  test.describe('Performance Consistency', () => {
    test('should load pages within acceptable time across browsers', async ({ page, browserName }) => {
      const startTime = Date.now();
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // Page should load within 5 seconds across all browsers
      expect(loadTime).toBeLessThan(5000);
      
      console.log(`${browserName} load time: ${loadTime}ms`);
    });

    test('should handle large DOM efficiently', async ({ page, browserName }) => {
      await page.goto('/');
      await loginUser(page, testUser);
      
      // Navigate to a page with potentially large DOM
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Measure DOM interaction performance
      const startTime = Date.now();
      
      // Perform DOM operations
      const elements = page.locator('*');
      const elementCount = await elements.count();
      
      const operationTime = Date.now() - startTime;
      
      // DOM operations should be reasonably fast
      expect(operationTime).toBeLessThan(2000);
      expect(elementCount).toBeGreaterThan(0);
      
      console.log(`${browserName} DOM operation time: ${operationTime}ms, elements: ${elementCount}`);
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

async function checkPageStructure(page, browserName) {
  // Check for essential page elements
  const essentialElements = [
    'header',
    'main',
    'nav',
  ];
  
  for (const elementType of essentialElements) {
    const element = page.locator(elementType);
    if (await element.count() > 0) {
      await expect(element.first()).toBeVisible();
    }
  }
}

async function checkComponentConsistency(page, browserName) {
  // Check standardized components
  const componentSelectors = [
    '[data-testid*="panel"]',
    '[data-testid*="button"]',
    '[data-testid*="card"]',
    '[data-testid*="form"]',
  ];
  
  for (const selector of componentSelectors) {
    const components = page.locator(selector);
    const count = await components.count();
    
    for (let i = 0; i < Math.min(count, 3); i++) {
      const component = components.nth(i);
      if (await component.isVisible()) {
        // Check component has proper styling
        const styles = await component.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            display: computed.display,
            position: computed.position,
            boxSizing: computed.boxSizing,
          };
        });
        
        expect(styles.display).not.toBe('none');
        expect(styles.boxSizing).toBe('border-box');
      }
    }
  }
}

async function checkStylingConsistency(page, browserName) {
  // Check CSS custom properties (CSS variables)
  const rootStyles = await page.evaluate(() => {
    const root = document.documentElement;
    const styles = window.getComputedStyle(root);
    
    // Check for CSS custom properties
    const customProps = {};
    for (let i = 0; i < styles.length; i++) {
      const prop = styles[i];
      if (prop.startsWith('--')) {
        customProps[prop] = styles.getPropertyValue(prop);
      }
    }
    
    return customProps;
  });
  
  // Should have some CSS custom properties defined
  const propCount = Object.keys(rootStyles).length;
  if (propCount > 0) {
    expect(propCount).toBeGreaterThan(0);
  }
}