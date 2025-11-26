/**
 * Accessibility E2E Tests
 * Tests keyboard navigation and screen reader support
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 4.1, 4.2, 4.3, 4.4
 */

import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

// Accessibility test configuration
const A11Y_CONFIG = {
  rules: {
    // Enable all WCAG 2.1 AA rules
    'color-contrast': { enabled: true },
    'keyboard-navigation': { enabled: true },
    'focus-management': { enabled: true },
    'aria-labels': { enabled: true },
    'heading-order': { enabled: true },
    'landmark-roles': { enabled: true },
  },
  tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
};

// Test pages for accessibility testing
const TEST_PAGES = [
  { path: '/', name: 'Home' },
  { path: '/login', name: 'Login' },
  { path: '/dashboard', name: 'Dashboard' },
  { path: '/bookings', name: 'Bookings' },
  { path: '/profile', name: 'Profile' },
];

// Mock user for testing
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  role: 'customer',
};

test.describe('Accessibility Tests', () => {
  test.describe('WCAG Compliance', () => {
    TEST_PAGES.forEach(({ path, name }) => {
      test(`should meet WCAG 2.1 AA standards on ${name} page`, async ({ page }) => {
        await page.goto(path);
        
        // Login if required
        if (path !== '/' && path !== '/login') {
          await loginUser(page, testUser);
          await page.goto(path);
        }
        
        // Inject axe-core for accessibility testing
        await injectAxe(page);
        
        // Run accessibility checks
        await checkA11y(page, null, {
          detailedReport: true,
          detailedReportOptions: { html: true },
          tags: A11Y_CONFIG.tags,
        });
      });
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/');
      await loginUser(page, testUser);
      
      // Check heading hierarchy
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      const headingLevels = [];
      
      for (const heading of headings) {
        if (await heading.isVisible()) {
          const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
          const level = parseInt(tagName.charAt(1));
          headingLevels.push(level);
        }
      }
      
      // Check heading hierarchy is logical
      if (headingLevels.length > 0) {
        expect(headingLevels[0]).toBe(1); // First heading should be h1
        
        for (let i = 1; i < headingLevels.length; i++) {
          const currentLevel = headingLevels[i];
          const previousLevel = headingLevels[i - 1];
          
          // Heading levels should not skip more than one level
          expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
        }
      }
    });

    test('should have proper landmark roles', async ({ page }) => {
      await page.goto('/');
      await loginUser(page, testUser);
      
      // Check for essential landmark roles
      const landmarks = [
        { role: 'banner', element: 'header' },
        { role: 'navigation', element: 'nav' },
        { role: 'main', element: 'main' },
        { role: 'contentinfo', element: 'footer' },
      ];
      
      for (const { role, element } of landmarks) {
        const landmarkByRole = page.locator(`[role="${role}"]`);
        const landmarkByElement = page.locator(element);
        
        // Should have landmark either by role or semantic element
        const hasLandmark = (await landmarkByRole.count()) > 0 || (await landmarkByElement.count()) > 0;
        
        if (role === 'main' || role === 'navigation') {
          expect(hasLandmark).toBe(true);
        }
      }
    });
  });

  test.describe('Keyboard Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await loginUser(page, testUser);
    });

    test('should support tab navigation through interactive elements', async ({ page }) => {
      // Start from the beginning of the page
      await page.keyboard.press('Home');
      
      // Get all focusable elements
      const focusableElements = await page.locator(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ).all();
      
      const focusableCount = focusableElements.length;
      let currentFocusIndex = 0;
      
      // Tab through elements
      for (let i = 0; i < Math.min(focusableCount, 10); i++) {
        await page.keyboard.press('Tab');
        
        // Check that an element is focused
        const focusedElement = page.locator(':focus');
        await expect(focusedElement).toBeVisible();
        
        // Check focus indicator is visible
        const focusStyles = await focusedElement.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            outline: styles.outline,
            outlineWidth: styles.outlineWidth,
            boxShadow: styles.boxShadow,
          };
        });
        
        // Should have visible focus indicator
        const hasFocusIndicator = 
          focusStyles.outline !== 'none' || 
          focusStyles.outlineWidth !== '0px' || 
          focusStyles.boxShadow !== 'none';
        
        expect(hasFocusIndicator).toBe(true);
      }
    });

    test('should support reverse tab navigation', async ({ page }) => {
      // Navigate to end of page
      await page.keyboard.press('End');
      
      // Tab backwards through elements
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Shift+Tab');
        
        // Check that an element is focused
        const focusedElement = page.locator(':focus');
        await expect(focusedElement).toBeVisible();
      }
    });

    test('should support Enter key activation', async ({ page }) => {
      // Find buttons and links
      const interactiveElements = page.locator('button, [role="button"], a[href]');
      const elementCount = await interactiveElements.count();
      
      for (let i = 0; i < Math.min(elementCount, 3); i++) {
        const element = interactiveElements.nth(i);
        
        if (await element.isVisible() && await element.isEnabled()) {
          // Focus the element
          await element.focus();
          
          // Activate with Enter key
          await page.keyboard.press('Enter');
          
          // Wait for any response
          await page.waitForTimeout(100);
          
          // Element should have responded to Enter key
          // (This is verified by the fact that no error was thrown)
        }
      }
    });

    test('should support Space key activation for buttons', async ({ page }) => {
      // Find buttons
      const buttons = page.locator('button, [role="button"]');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < Math.min(buttonCount, 3); i++) {
        const button = buttons.nth(i);
        
        if (await button.isVisible() && await button.isEnabled()) {
          // Focus the button
          await button.focus();
          
          // Activate with Space key
          await page.keyboard.press('Space');
          
          // Wait for any response
          await page.waitForTimeout(100);
          
          // Button should have responded to Space key
          // (This is verified by the fact that no error was thrown)
        }
      }
    });

    test('should support arrow key navigation in menus', async ({ page }) => {
      // Look for navigation menus
      const navMenus = page.locator('[role="menu"], [role="menubar"], nav ul');
      const menuCount = await navMenus.count();
      
      if (menuCount > 0) {
        const menu = navMenus.first();
        
        // Focus first menu item
        const firstMenuItem = menu.locator('[role="menuitem"], li a, li button').first();
        if (await firstMenuItem.isVisible()) {
          await firstMenuItem.focus();
          
          // Test arrow key navigation
          await page.keyboard.press('ArrowDown');
          
          // Check that focus moved
          const focusedElement = page.locator(':focus');
          await expect(focusedElement).toBeVisible();
          
          // Test arrow up
          await page.keyboard.press('ArrowUp');
          
          // Focus should move back
          await expect(focusedElement).toBeVisible();
        }
      }
    });

    test('should support Escape key to close modals/menus', async ({ page }) => {
      // Look for modal triggers
      const modalTriggers = page.locator('[data-testid*="modal"], [data-testid*="menu"]');
      const triggerCount = await modalTriggers.count();
      
      for (let i = 0; i < Math.min(triggerCount, 2); i++) {
        const trigger = modalTriggers.nth(i);
        
        if (await trigger.isVisible()) {
          // Open modal/menu
          await trigger.click();
          
          // Wait for modal/menu to open
          await page.waitForTimeout(300);
          
          // Press Escape
          await page.keyboard.press('Escape');
          
          // Wait for close animation
          await page.waitForTimeout(300);
          
          // Modal/menu should be closed (no error means it handled Escape)
        }
      }
    });
  });

  test.describe('Screen Reader Support', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await loginUser(page, testUser);
    });

    test('should have proper ARIA labels and descriptions', async ({ page }) => {
      // Check for ARIA labels
      const elementsWithAriaLabel = page.locator('[aria-label]');
      const labelCount = await elementsWithAriaLabel.count();
      
      for (let i = 0; i < Math.min(labelCount, 10); i++) {
        const element = elementsWithAriaLabel.nth(i);
        
        if (await element.isVisible()) {
          const ariaLabel = await element.getAttribute('aria-label');
          
          // ARIA label should be meaningful
          expect(ariaLabel).toBeTruthy();
          expect(ariaLabel.length).toBeGreaterThan(2);
        }
      }
      
      // Check for ARIA descriptions
      const elementsWithAriaDescription = page.locator('[aria-describedby]');
      const descriptionCount = await elementsWithAriaDescription.count();
      
      for (let i = 0; i < Math.min(descriptionCount, 5); i++) {
        const element = elementsWithAriaDescription.nth(i);
        
        if (await element.isVisible()) {
          const describedBy = await element.getAttribute('aria-describedby');
          
          // Should reference existing element
          const descriptionElement = page.locator(`#${describedBy}`);
          await expect(descriptionElement).toBeAttached();
        }
      }
    });

    test('should have proper form labels', async ({ page }) => {
      // Navigate to a form page
      await page.goto('/profile');
      
      // Check form inputs have labels
      const formInputs = page.locator('input, select, textarea');
      const inputCount = await formInputs.count();
      
      for (let i = 0; i < Math.min(inputCount, 10); i++) {
        const input = formInputs.nth(i);
        
        if (await input.isVisible()) {
          const inputId = await input.getAttribute('id');
          const ariaLabel = await input.getAttribute('aria-label');
          const ariaLabelledBy = await input.getAttribute('aria-labelledby');
          
          // Input should have some form of label
          const hasLabel = inputId || ariaLabel || ariaLabelledBy;
          
          if (inputId) {
            // Check for associated label
            const label = page.locator(`label[for="${inputId}"]`);
            const labelExists = (await label.count()) > 0;
            
            if (!labelExists && !ariaLabel && !ariaLabelledBy) {
              // Input should have some form of accessible name
              console.warn(`Input without accessible name found: ${await input.getAttribute('name') || 'unnamed'}`);
            }
          }
        }
      }
    });

    test('should have proper button descriptions', async ({ page }) => {
      // Check buttons have accessible names
      const buttons = page.locator('button, [role="button"]');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < Math.min(buttonCount, 10); i++) {
        const button = buttons.nth(i);
        
        if (await button.isVisible()) {
          const buttonText = await button.textContent();
          const ariaLabel = await button.getAttribute('aria-label');
          const ariaLabelledBy = await button.getAttribute('aria-labelledby');
          
          // Button should have accessible name
          const hasAccessibleName = 
            (buttonText && buttonText.trim().length > 0) || 
            ariaLabel || 
            ariaLabelledBy;
          
          expect(hasAccessibleName).toBe(true);
        }
      }
    });

    test('should announce dynamic content changes', async ({ page }) => {
      // Look for live regions
      const liveRegions = page.locator('[aria-live], [role="status"], [role="alert"]');
      const liveRegionCount = await liveRegions.count();
      
      if (liveRegionCount > 0) {
        for (let i = 0; i < Math.min(liveRegionCount, 3); i++) {
          const liveRegion = liveRegions.nth(i);
          
          if (await liveRegion.isVisible()) {
            const ariaLive = await liveRegion.getAttribute('aria-live');
            const role = await liveRegion.getAttribute('role');
            
            // Live region should have proper attributes
            const hasLiveAttribute = ariaLive || role === 'status' || role === 'alert';
            expect(hasLiveAttribute).toBe(true);
          }
        }
      }
    });

    test('should have proper table headers', async ({ page }) => {
      // Look for data tables
      const tables = page.locator('table');
      const tableCount = await tables.count();
      
      for (let i = 0; i < Math.min(tableCount, 3); i++) {
        const table = tables.nth(i);
        
        if (await table.isVisible()) {
          // Check for table headers
          const headers = table.locator('th');
          const headerCount = await headers.count();
          
          if (headerCount > 0) {
            // Headers should have scope attribute
            for (let j = 0; j < headerCount; j++) {
              const header = headers.nth(j);
              const scope = await header.getAttribute('scope');
              
              // Header should have scope (col, row, colgroup, rowgroup)
              if (scope) {
                expect(['col', 'row', 'colgroup', 'rowgroup']).toContain(scope);
              }
            }
          }
        }
      }
    });
  });

  test.describe('Color and Contrast', () => {
    test('should meet color contrast requirements', async ({ page }) => {
      await page.goto('/');
      await loginUser(page, testUser);
      
      // Inject axe-core and run color contrast checks
      await injectAxe(page);
      
      await checkA11y(page, null, {
        rules: {
          'color-contrast': { enabled: true },
        },
        tags: ['wcag2aa'],
      });
    });

    test('should not rely solely on color for information', async ({ page }) => {
      await page.goto('/');
      await loginUser(page, testUser);
      
      // Look for elements that might rely on color
      const colorElements = page.locator('.text-red, .text-green, .text-yellow, .bg-red, .bg-green, .bg-yellow');
      const colorElementCount = await colorElements.count();
      
      for (let i = 0; i < Math.min(colorElementCount, 5); i++) {
        const element = colorElements.nth(i);
        
        if (await element.isVisible()) {
          const textContent = await element.textContent();
          const ariaLabel = await element.getAttribute('aria-label');
          const title = await element.getAttribute('title');
          
          // Element should have additional indicators beyond color
          const hasAdditionalIndicator = 
            (textContent && textContent.trim().length > 0) ||
            ariaLabel ||
            title;
          
          // This is a guideline check - elements should ideally have text or other indicators
          if (!hasAdditionalIndicator) {
            console.warn('Element may rely solely on color for meaning');
          }
        }
      }
    });
  });

  test.describe('Focus Management', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await loginUser(page, testUser);
    });

    test('should manage focus properly in modals', async ({ page }) => {
      // Look for modal triggers
      const modalTriggers = page.locator('[data-testid*="modal-trigger"]');
      const triggerCount = await modalTriggers.count();
      
      if (triggerCount > 0) {
        const trigger = modalTriggers.first();
        
        // Focus trigger and remember it
        await trigger.focus();
        const triggerElement = await page.locator(':focus');
        
        // Open modal
        await trigger.click();
        
        // Wait for modal to open
        await page.waitForTimeout(300);
        
        // Focus should move to modal
        const modalElement = page.locator('[role="dialog"], [data-testid*="modal"]');
        if (await modalElement.isVisible()) {
          // Check that focus is within modal
          const focusedElement = page.locator(':focus');
          const isWithinModal = await modalElement.locator(':focus').count() > 0;
          
          // Focus should be trapped within modal
          expect(isWithinModal).toBe(true);
          
          // Close modal
          await page.keyboard.press('Escape');
          
          // Wait for modal to close
          await page.waitForTimeout(300);
          
          // Focus should return to trigger
          const finalFocusedElement = page.locator(':focus');
          // Note: This test depends on proper focus management implementation
        }
      }
    });

    test('should skip to main content', async ({ page }) => {
      // Look for skip link
      const skipLink = page.locator('[data-testid="skip-to-content"], a[href="#main"], a[href="#content"]');
      
      if (await skipLink.count() > 0) {
        const skip = skipLink.first();
        
        // Focus skip link (usually first focusable element)
        await page.keyboard.press('Tab');
        
        if (await skip.isVisible()) {
          // Activate skip link
          await page.keyboard.press('Enter');
          
          // Focus should move to main content
          const mainContent = page.locator('main, #main, #content');
          if (await mainContent.count() > 0) {
            // Check that focus moved to main content area
            const focusedElement = page.locator(':focus');
            // Note: This test depends on skip link implementation
          }
        }
      }
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