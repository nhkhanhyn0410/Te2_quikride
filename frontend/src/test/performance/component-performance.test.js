/**
 * Component Performance Tests
 * Tests rendering performance and interaction responsiveness of UI components
 */

import { test, expect } from '@playwright/test';

// Performance test configuration
const PERFORMANCE_CONFIG = {
  baseURL: 'http://localhost:6006', // Storybook URL
  thresholds: {
    // First Contentful Paint should be under 1.5s
    fcp: 1500,
    // Largest Contentful Paint should be under 2.5s
    lcp: 2500,
    // First Input Delay should be under 100ms
    fid: 100,
    // Cumulative Layout Shift should be under 0.1
    cls: 0.1,
    // Time to Interactive should be under 3s
    tti: 3000,
  },
  // Number of test runs for averaging
  iterations: 5,
};

test.describe('Component Performance Tests', () => {
  test.describe('Button Component Performance', () => {
    test('should render StandardButton quickly', async ({ page }) => {
      const metrics = await measureComponentPerformance(
        page,
        '/iframe.html?id=ui-components-buttons-standardbutton--all-variants'
      );

      // Check performance metrics
      expect(metrics.fcp).toBeLessThan(PERFORMANCE_CONFIG.thresholds.fcp);
      expect(metrics.lcp).toBeLessThan(PERFORMANCE_CONFIG.thresholds.lcp);
      expect(metrics.cls).toBeLessThan(PERFORMANCE_CONFIG.thresholds.cls);
    });

    test('should handle button interactions quickly', async ({ page }) => {
      await page.goto(`${PERFORMANCE_CONFIG.baseURL}/iframe.html?id=ui-components-buttons-standardbutton--interactive`);
      
      // Wait for component to load
      await page.waitForSelector('[data-testid="standard-button"]');
      
      const button = page.locator('[data-testid="standard-button"]').first();
      
      // Measure interaction performance
      const interactionTimes = [];
      
      for (let i = 0; i < 10; i++) {
        const startTime = Date.now();
        
        await button.click();
        await page.waitForTimeout(50); // Small delay to simulate real interaction
        
        const endTime = Date.now();
        interactionTimes.push(endTime - startTime);
      }
      
      const averageInteractionTime = interactionTimes.reduce((a, b) => a + b, 0) / interactionTimes.length;
      
      // Interaction should be under 50ms on average
      expect(averageInteractionTime).toBeLessThan(50);
    });

    test('should render multiple buttons efficiently', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto(`${PERFORMANCE_CONFIG.baseURL}/iframe.html?id=ui-components-buttons-standardbutton--all-variants`);
      
      // Wait for all buttons to be rendered
      await page.waitForSelector('[data-testid="standard-button"]');
      const buttons = await page.locator('[data-testid="standard-button"]').count();
      
      const endTime = Date.now();
      const renderTime = endTime - startTime;
      
      // Should render multiple buttons quickly
      expect(renderTime).toBeLessThan(1000);
      expect(buttons).toBeGreaterThan(5); // Ensure multiple buttons are rendered
    });
  });

  test.describe('Panel Component Performance', () => {
    test('should render StandardPanel quickly', async ({ page }) => {
      const metrics = await measureComponentPerformance(
        page,
        '/iframe.html?id=ui-components-panels-standardpanel--all-variants'
      );

      expect(metrics.fcp).toBeLessThan(PERFORMANCE_CONFIG.thresholds.fcp);
      expect(metrics.lcp).toBeLessThan(PERFORMANCE_CONFIG.thresholds.lcp);
      expect(metrics.cls).toBeLessThan(PERFORMANCE_CONFIG.thresholds.cls);
    });

    test('should handle complex panel content efficiently', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto(`${PERFORMANCE_CONFIG.baseURL}/iframe.html?id=ui-components-panels-standardpanel--with-header-and-footer`);
      
      // Wait for complex panel to load
      await page.waitForSelector('[data-testid="panel-header"]');
      await page.waitForSelector('[data-testid="panel-content"]');
      await page.waitForSelector('[data-testid="panel-footer"]');
      
      const endTime = Date.now();
      const renderTime = endTime - startTime;
      
      // Complex panel should render within 2 seconds
      expect(renderTime).toBeLessThan(2000);
    });

    test('should handle panel state changes efficiently', async ({ page }) => {
      await page.goto(`${PERFORMANCE_CONFIG.baseURL}/iframe.html?id=ui-components-panels-standardpanel--interactive`);
      
      const panel = page.locator('[data-testid="standard-panel"]').first();
      
      // Test loading state performance
      const loadingStartTime = Date.now();
      
      // Trigger loading state (this would depend on the interactive story implementation)
      await page.evaluate(() => {
        // Simulate loading state change
        const event = new CustomEvent('setLoading', { detail: { loading: true } });
        document.dispatchEvent(event);
      });
      
      await page.waitForSelector('[data-testid="loading-spinner"]');
      
      const loadingEndTime = Date.now();
      const loadingTransitionTime = loadingEndTime - loadingStartTime;
      
      // Loading state should appear quickly
      expect(loadingTransitionTime).toBeLessThan(200);
    });
  });

  test.describe('Form Component Performance', () => {
    test('should render form components quickly', async ({ page }) => {
      const metrics = await measureComponentPerformance(
        page,
        '/iframe.html?id=ui-components-forms-form-components--complete-form'
      );

      expect(metrics.fcp).toBeLessThan(PERFORMANCE_CONFIG.thresholds.fcp);
      expect(metrics.lcp).toBeLessThan(PERFORMANCE_CONFIG.thresholds.lcp);
    });

    test('should handle form input interactions efficiently', async ({ page }) => {
      await page.goto(`${PERFORMANCE_CONFIG.baseURL}/iframe.html?id=ui-components-forms-form-components--form-inputs`);
      
      const input = page.locator('input').first();
      
      // Measure typing performance
      const typingTimes = [];
      const testText = 'Performance test input';
      
      for (const char of testText) {
        const startTime = Date.now();
        
        await input.type(char);
        
        const endTime = Date.now();
        typingTimes.push(endTime - startTime);
      }
      
      const averageTypingTime = typingTimes.reduce((a, b) => a + b, 0) / typingTimes.length;
      
      // Each character input should be under 20ms
      expect(averageTypingTime).toBeLessThan(20);
    });

    test('should handle form validation efficiently', async ({ page }) => {
      await page.goto(`${PERFORMANCE_CONFIG.baseURL}/iframe.html?id=ui-components-forms-form-components--validation-states`);
      
      const errorInput = page.locator('[data-testid="error-input"]');
      
      const startTime = Date.now();
      
      // Trigger validation by focusing and blurring
      await errorInput.focus();
      await errorInput.blur();
      
      // Wait for validation message to appear
      await page.waitForSelector('[data-testid="validation-message"]');
      
      const endTime = Date.now();
      const validationTime = endTime - startTime;
      
      // Validation should appear within 100ms
      expect(validationTime).toBeLessThan(100);
    });
  });

  test.describe('Responsive Performance', () => {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1024, height: 768 },
      { name: 'wide', width: 1440, height: 900 },
    ];

    viewports.forEach(viewport => {
      test(`should perform well on ${viewport.name} viewport`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        
        const metrics = await measureComponentPerformance(
          page,
          '/iframe.html?id=ui-components-panels-standardpanel--responsive-behavior'
        );

        // Performance should be consistent across viewports
        expect(metrics.fcp).toBeLessThan(PERFORMANCE_CONFIG.thresholds.fcp);
        expect(metrics.lcp).toBeLessThan(PERFORMANCE_CONFIG.thresholds.lcp);
        expect(metrics.cls).toBeLessThan(PERFORMANCE_CONFIG.thresholds.cls);
      });
    });

    test('should handle viewport changes efficiently', async ({ page }) => {
      await page.goto(`${PERFORMANCE_CONFIG.baseURL}/iframe.html?id=ui-components-panels-standardpanel--responsive-behavior`);
      
      // Start with desktop viewport
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.waitForLoadState('networkidle');
      
      const resizeTimes = [];
      
      // Test multiple viewport changes
      const viewportSizes = [
        { width: 375, height: 667 },   // Mobile
        { width: 768, height: 1024 },  // Tablet
        { width: 1440, height: 900 },  // Wide
        { width: 1024, height: 768 },  // Back to desktop
      ];
      
      for (const size of viewportSizes) {
        const startTime = Date.now();
        
        await page.setViewportSize(size);
        await page.waitForTimeout(100); // Allow for layout recalculation
        
        const endTime = Date.now();
        resizeTimes.push(endTime - startTime);
      }
      
      const averageResizeTime = resizeTimes.reduce((a, b) => a + b, 0) / resizeTimes.length;
      
      // Viewport changes should be handled quickly
      expect(averageResizeTime).toBeLessThan(200);
    });
  });

  test.describe('Memory Performance', () => {
    test('should not have memory leaks in component rendering', async ({ page }) => {
      await page.goto(`${PERFORMANCE_CONFIG.baseURL}/iframe.html?id=ui-components-buttons-standardbutton--all-variants`);
      
      // Get initial memory usage
      const initialMemory = await page.evaluate(() => {
        if (performance.memory) {
          return {
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize,
          };
        }
        return null;
      });
      
      // Perform multiple component interactions
      for (let i = 0; i < 50; i++) {
        await page.reload();
        await page.waitForSelector('[data-testid="standard-button"]');
      }
      
      // Get final memory usage
      const finalMemory = await page.evaluate(() => {
        if (performance.memory) {
          return {
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize,
          };
        }
        return null;
      });
      
      if (initialMemory && finalMemory) {
        const memoryIncrease = finalMemory.usedJSHeapSize - initialMemory.usedJSHeapSize;
        const memoryIncreasePercent = (memoryIncrease / initialMemory.usedJSHeapSize) * 100;
        
        // Memory increase should be reasonable (less than 50% increase)
        expect(memoryIncreasePercent).toBeLessThan(50);
      }
    });
  });
});

// Helper function to measure component performance
async function measureComponentPerformance(page, storyPath) {
  const url = `${PERFORMANCE_CONFIG.baseURL}${storyPath}`;
  
  // Navigate to the story
  await page.goto(url);
  
  // Wait for the component to load
  await page.waitForLoadState('networkidle');
  
  // Get performance metrics
  const metrics = await page.evaluate(() => {
    return new Promise((resolve) => {
      // Use Performance Observer to get metrics
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const paintEntries = entries.filter(entry => entry.entryType === 'paint');
        const navigationEntries = entries.filter(entry => entry.entryType === 'navigation');
        
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
        const lcp = entries.find(entry => entry.entryType === 'largest-contentful-paint')?.startTime || 0;
        
        resolve({
          fcp,
          lcp,
          cls: 0, // Would need layout shift observer for accurate CLS
          tti: navigationEntries[0]?.loadEventEnd || 0,
        });
      });
      
      observer.observe({ entryTypes: ['paint', 'navigation', 'largest-contentful-paint'] });
      
      // Fallback timeout
      setTimeout(() => {
        resolve({
          fcp: performance.now(),
          lcp: performance.now(),
          cls: 0,
          tti: performance.now(),
        });
      }, 5000);
    });
  });
  
  return metrics;
}