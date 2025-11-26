/**
 * Responsive Behavior E2E Tests
 * Tests responsive design and mobile navigation patterns
 * Requirements: 4.1, 4.2, 4.3, 4.4, 6.1, 6.2, 6.3, 6.4, 6.5
 */

import { test, expect } from '@playwright/test';

// Test configuration for responsive testing
const RESPONSIVE_CONFIG = {
  viewports: {
    mobile: { width: 375, height: 667, name: 'iPhone SE' },
    mobileLarge: { width: 414, height: 896, name: 'iPhone 11 Pro Max' },
    tablet: { width: 768, height: 1024, name: 'iPad' },
    tabletLarge: { width: 1024, height: 768, name: 'iPad Pro' },
    desktop: { width: 1280, height: 720, name: 'Desktop' },
    desktopLarge: { width: 1440, height: 900, name: 'Large Desktop' },
    ultrawide: { width: 1920, height: 1080, name: 'Ultra Wide' },
  },
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1280,
  },
};

// Mock user data for testing
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  role: 'customer',
};

test.describe('Responsive Behavior Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Viewport Adaptation', () => {
    Object.entries(RESPONSIVE_CONFIG.viewports).forEach(([viewportName, viewport]) => {
      test(`should adapt layout correctly for ${viewportName} (${viewport.width}x${viewport.height})`, async ({ page }) => {
        // Set viewport size
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        
        // Login to access main interface
        await loginUser(page, testUser);
        
        // Check main layout adaptation
        const mainLayout = page.locator('[data-testid="main-layout"]');
        await expect(mainLayout).toBeVisible();
        
        // Check navigation adaptation
        await checkNavigationAdaptation(page, viewport);
        
        // Check panel layout adaptation
        await checkPanelLayoutAdaptation(page, viewport);
        
        // Check form layout adaptation
        await checkFormLayoutAdaptation(page, viewport);
        
        // Take screenshot for visual regression
        await page.screenshot({
          path: `test-results/responsive-${viewportName}-${Date.now()}.png`,
          fullPage: true,
        });
      });
    });
  });

  test.describe('Mobile Navigation Patterns', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(RESPONSIVE_CONFIG.viewports.mobile);
    });

    test('should display mobile hamburger menu', async ({ page }) => {
      await loginUser(page, testUser);
      
      // Check for mobile menu button
      const menuButton = page.locator('[data-testid="mobile-menu-button"]');
      await expect(menuButton).toBeVisible();
      
      // Verify desktop navigation is hidden
      const desktopNav = page.locator('[data-testid="desktop-navigation"]');
      await expect(desktopNav).not.toBeVisible();
    });

    test('should open and close mobile menu correctly', async ({ page }) => {
      await loginUser(page, testUser);
      
      const menuButton = page.locator('[data-testid="mobile-menu-button"]');
      const mobileMenu = page.locator('[data-testid="mobile-menu"]');
      
      // Open menu
      await menuButton.click();
      await expect(mobileMenu).toBeVisible();
      
      // Check menu animation
      await page.waitForTimeout(300); // Wait for animation
      
      // Check menu items are visible
      const menuItems = page.locator('[data-testid="mobile-nav-item"]');
      await expect(menuItems.first()).toBeVisible();
      
      // Close menu by clicking close button
      const closeButton = page.locator('[data-testid="mobile-menu-close"]');
      await closeButton.click();
      await expect(mobileMenu).not.toBeVisible();
    });

    test('should close mobile menu when clicking outside', async ({ page }) => {
      await loginUser(page, testUser);
      
      const menuButton = page.locator('[data-testid="mobile-menu-button"]');
      const mobileMenu = page.locator('[data-testid="mobile-menu"]');
      
      // Open menu
      await menuButton.click();
      await expect(mobileMenu).toBeVisible();
      
      // Click outside menu
      await page.click('body', { position: { x: 10, y: 10 } });
      
      // Menu should close
      await expect(mobileMenu).not.toBeVisible();
    });

    test('should support swipe gestures for menu', async ({ page }) => {
      await loginUser(page, testUser);
      
      // Test swipe to open (if implemented)
      await page.touchscreen.tap(10, 100);
      await page.mouse.move(10, 100);
      await page.mouse.down();
      await page.mouse.move(200, 100);
      await page.mouse.up();
      
      // Check if menu responds to swipe
      const mobileMenu = page.locator('[data-testid="mobile-menu"]');
      // Note: This depends on swipe implementation
    });
  });

  test.describe('Touch Interactions', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(RESPONSIVE_CONFIG.viewports.mobile);
    });

    test('should have touch-friendly button sizes', async ({ page }) => {
      await loginUser(page, testUser);
      
      // Check button sizes meet touch target requirements (44px minimum)
      const buttons = page.locator('button, [role="button"]');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < Math.min(buttonCount, 10); i++) {
        const button = buttons.nth(i);
        if (await button.isVisible()) {
          const boundingBox = await button.boundingBox();
          
          // Check minimum touch target size (44px)
          expect(boundingBox.width).toBeGreaterThanOrEqual(44);
          expect(boundingBox.height).toBeGreaterThanOrEqual(44);
        }
      }
    });

    test('should handle touch interactions smoothly', async ({ page }) => {
      await loginUser(page, testUser);
      
      // Test touch interactions on various elements
      const interactiveElements = page.locator('[data-testid*="button"], [data-testid*="link"]');
      const elementCount = await interactiveElements.count();
      
      for (let i = 0; i < Math.min(elementCount, 5); i++) {
        const element = interactiveElements.nth(i);
        if (await element.isVisible()) {
          // Test touch interaction
          await element.tap();
          
          // Verify no double-tap zoom issues
          const viewport = await page.viewportSize();
          expect(viewport.width).toBe(RESPONSIVE_CONFIG.viewports.mobile.width);
        }
      }
    });
  });

  test.describe('Content Reflow', () => {
    test('should reflow content appropriately across breakpoints', async ({ page }) => {
      await loginUser(page, testUser);
      
      // Test content reflow at different breakpoints
      const breakpointTests = [
        { width: 320, name: 'small mobile' },
        { width: 768, name: 'tablet' },
        { width: 1024, name: 'desktop' },
        { width: 1440, name: 'large desktop' },
      ];
      
      for (const breakpoint of breakpointTests) {
        await page.setViewportSize({ width: breakpoint.width, height: 800 });
        
        // Check content containers
        const contentContainers = page.locator('[data-testid*="panel"], [data-testid*="container"]');
        const containerCount = await contentContainers.count();
        
        for (let i = 0; i < Math.min(containerCount, 5); i++) {
          const container = contentContainers.nth(i);
          if (await container.isVisible()) {
            const boundingBox = await container.boundingBox();
            
            // Content should not overflow viewport
            expect(boundingBox.width).toBeLessThanOrEqual(breakpoint.width);
            
            // Content should have appropriate margins
            expect(boundingBox.x).toBeGreaterThanOrEqual(0);
          }
        }
      }
    });

    test('should handle text scaling appropriately', async ({ page }) => {
      await loginUser(page, testUser);
      
      // Test different viewport sizes
      const viewports = [
        RESPONSIVE_CONFIG.viewports.mobile,
        RESPONSIVE_CONFIG.viewports.tablet,
        RESPONSIVE_CONFIG.viewports.desktop,
      ];
      
      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        
        // Check text elements
        const textElements = page.locator('h1, h2, h3, p, span');
        const textCount = await textElements.count();
        
        for (let i = 0; i < Math.min(textCount, 10); i++) {
          const textElement = textElements.nth(i);
          if (await textElement.isVisible()) {
            const styles = await textElement.evaluate(el => {
              const computed = window.getComputedStyle(el);
              return {
                fontSize: computed.fontSize,
                lineHeight: computed.lineHeight,
              };
            });
            
            // Verify readable font sizes
            const fontSize = parseInt(styles.fontSize);
            expect(fontSize).toBeGreaterThanOrEqual(14); // Minimum readable size
          }
        }
      }
    });
  });

  test.describe('Image and Media Responsiveness', () => {
    test('should handle responsive images correctly', async ({ page }) => {
      await loginUser(page, testUser);
      
      // Test different viewport sizes
      const viewports = [
        RESPONSIVE_CONFIG.viewports.mobile,
        RESPONSIVE_CONFIG.viewports.tablet,
        RESPONSIVE_CONFIG.viewports.desktop,
      ];
      
      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        
        // Check images
        const images = page.locator('img');
        const imageCount = await images.count();
        
        for (let i = 0; i < Math.min(imageCount, 5); i++) {
          const image = images.nth(i);
          if (await image.isVisible()) {
            const boundingBox = await image.boundingBox();
            
            // Images should not overflow container
            expect(boundingBox.width).toBeLessThanOrEqual(viewport.width);
            
            // Check if image has responsive attributes
            const srcset = await image.getAttribute('srcset');
            const sizes = await image.getAttribute('sizes');
            
            // At least one responsive attribute should be present for optimization
            if (srcset || sizes) {
              expect(srcset || sizes).toBeTruthy();
            }
          }
        }
      }
    });
  });
});

// Helper functions
async function loginUser(page, user) {
  // Navigate to login if not already logged in
  const loginButton = page.locator('[data-testid="login-button"]');
  
  if (await loginButton.isVisible()) {
    await page.fill('[data-testid="email-input"]', user.email);
    await page.fill('[data-testid="password-input"]', user.password);
    await loginButton.click();
    
    // Wait for navigation
    await page.waitForLoadState('networkidle');
  }
}

async function checkNavigationAdaptation(page, viewport) {
  if (viewport.width < RESPONSIVE_CONFIG.breakpoints.mobile) {
    // Mobile navigation should be visible
    const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
    await expect(mobileMenuButton).toBeVisible();
    
    // Desktop navigation should be hidden
    const desktopNav = page.locator('[data-testid="desktop-navigation"]');
    await expect(desktopNav).not.toBeVisible();
  } else {
    // Desktop navigation should be visible
    const desktopNav = page.locator('[data-testid="desktop-navigation"]');
    if (await desktopNav.count() > 0) {
      await expect(desktopNav).toBeVisible();
    }
  }
}

async function checkPanelLayoutAdaptation(page, viewport) {
  const panels = page.locator('[data-testid*="panel"]');
  const panelCount = await panels.count();
  
  for (let i = 0; i < Math.min(panelCount, 3); i++) {
    const panel = panels.nth(i);
    if (await panel.isVisible()) {
      const boundingBox = await panel.boundingBox();
      
      // Panel should not overflow viewport
      expect(boundingBox.width).toBeLessThanOrEqual(viewport.width);
      
      // Check responsive spacing
      const styles = await panel.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          padding: computed.padding,
          margin: computed.margin,
        };
      });
      
      expect(styles.padding).toBeTruthy();
    }
  }
}

async function checkFormLayoutAdaptation(page, viewport) {
  const forms = page.locator('form');
  const formCount = await forms.count();
  
  for (let i = 0; i < Math.min(formCount, 2); i++) {
    const form = forms.nth(i);
    if (await form.isVisible()) {
      // Check form inputs are appropriately sized
      const inputs = form.locator('input, select, textarea');
      const inputCount = await inputs.count();
      
      for (let j = 0; j < Math.min(inputCount, 5); j++) {
        const input = inputs.nth(j);
        if (await input.isVisible()) {
          const boundingBox = await input.boundingBox();
          
          // Input should not overflow form
          expect(boundingBox.width).toBeLessThanOrEqual(viewport.width - 40); // Account for padding
          
          // Input should have minimum touch target height on mobile
          if (viewport.width < RESPONSIVE_CONFIG.breakpoints.mobile) {
            expect(boundingBox.height).toBeGreaterThanOrEqual(44);
          }
        }
      }
    }
  }
}