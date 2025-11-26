/**
 * Tests for Responsive Utility Functions
 */

import {
  BREAKPOINTS,
  BREAKPOINT_NAMES,
  getCurrentBreakpoint,
  isBreakpoint,
  isMobile,
  isTablet,
  isDesktop,
  getResponsiveValue,
  createMediaQuery,
  getResponsiveGridColumns,
  getResponsiveSpacing,
  getResponsiveTextSize,
  getResponsiveHeading,
  generateResponsiveClasses,
  debounce,
  throttle,
} from '../responsive';

// Mock window object
const mockWindow = (width) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
};

describe('Responsive Utilities', () => {
  beforeEach(() => {
    // Reset window mock
    mockWindow(1024);
  });

  describe('BREAKPOINTS and BREAKPOINT_NAMES', () => {
    test('should have correct breakpoint values', () => {
      expect(BREAKPOINTS).toEqual({
        xs: 475,
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        '2xl': 1536,
      });
    });

    test('should have correct breakpoint names in order', () => {
      expect(BREAKPOINT_NAMES).toEqual(['xs', 'sm', 'md', 'lg', 'xl', '2xl']);
    });
  });

  describe('getCurrentBreakpoint', () => {
    test('should return correct breakpoint for different widths', () => {
      mockWindow(400);
      expect(getCurrentBreakpoint()).toBe('xs');

      mockWindow(600);
      expect(getCurrentBreakpoint()).toBe('sm');

      mockWindow(800);
      expect(getCurrentBreakpoint()).toBe('md');

      mockWindow(1100);
      expect(getCurrentBreakpoint()).toBe('lg');

      mockWindow(1300);
      expect(getCurrentBreakpoint()).toBe('xl');

      mockWindow(1600);
      expect(getCurrentBreakpoint()).toBe('2xl');
    });

    test('should return lg as fallback for SSR', () => {
      const originalWindow = global.window;
      delete global.window;
      
      expect(getCurrentBreakpoint()).toBe('lg');
      
      global.window = originalWindow;
    });
  });

  describe('isBreakpoint', () => {
    test('should correctly identify breakpoint matches', () => {
      mockWindow(1100);
      
      expect(isBreakpoint('xs')).toBe(true);
      expect(isBreakpoint('sm')).toBe(true);
      expect(isBreakpoint('md')).toBe(true);
      expect(isBreakpoint('lg')).toBe(true);
      expect(isBreakpoint('xl')).toBe(false);
      expect(isBreakpoint('2xl')).toBe(false);
    });

    test('should return false for SSR', () => {
      const originalWindow = global.window;
      delete global.window;
      
      expect(isBreakpoint('lg')).toBe(false);
      
      global.window = originalWindow;
    });
  });

  describe('Device type detection', () => {
    test('isMobile should detect mobile correctly', () => {
      mockWindow(600);
      expect(isMobile()).toBe(true);

      mockWindow(800);
      expect(isMobile()).toBe(false);
    });

    test('isTablet should detect tablet correctly', () => {
      mockWindow(600);
      expect(isTablet()).toBe(false);

      mockWindow(800);
      expect(isTablet()).toBe(true);

      mockWindow(1100);
      expect(isTablet()).toBe(false);
    });

    test('isDesktop should detect desktop correctly', () => {
      mockWindow(800);
      expect(isDesktop()).toBe(false);

      mockWindow(1100);
      expect(isDesktop()).toBe(true);
    });

    test('should handle SSR correctly', () => {
      const originalWindow = global.window;
      delete global.window;
      
      expect(isMobile()).toBe(false);
      expect(isTablet()).toBe(false);
      expect(isDesktop()).toBe(true);
      
      global.window = originalWindow;
    });
  });

  describe('getResponsiveValue', () => {
    test('should return correct value for current breakpoint', () => {
      mockWindow(1100); // lg breakpoint
      
      const values = {
        xs: 'mobile',
        md: 'tablet',
        lg: 'desktop',
        xl: 'wide',
      };
      
      expect(getResponsiveValue(values)).toBe('desktop');
    });

    test('should fallback to smaller breakpoint if current not available', () => {
      mockWindow(1100); // lg breakpoint
      
      const values = {
        xs: 'mobile',
        md: 'tablet',
        // lg not defined
        xl: 'wide',
      };
      
      expect(getResponsiveValue(values)).toBe('tablet');
    });

    test('should return default value if no match found', () => {
      mockWindow(1100);
      
      const values = {
        xl: 'wide',
      };
      
      expect(getResponsiveValue(values, 'fallback')).toBe('fallback');
    });
  });

  describe('createMediaQuery', () => {
    test('should create correct media query for up direction', () => {
      expect(createMediaQuery('md', 'up')).toBe('(min-width: 768px)');
      expect(createMediaQuery('lg')).toBe('(min-width: 1024px)'); // default up
    });

    test('should create correct media query for down direction', () => {
      expect(createMediaQuery('md', 'down')).toBe('(max-width: 767px)');
    });

    test('should return empty string for invalid breakpoint', () => {
      expect(createMediaQuery('invalid')).toBe('');
    });
  });

  describe('getResponsiveGridColumns', () => {
    test('should return correct columns for current breakpoint', () => {
      mockWindow(1100); // lg breakpoint
      
      expect(getResponsiveGridColumns()).toBe(4); // default lg value
    });

    test('should use custom config', () => {
      mockWindow(1100); // lg breakpoint
      
      const config = {
        lg: 6,
        xl: 8,
      };
      
      expect(getResponsiveGridColumns(config)).toBe(6);
    });
  });

  describe('getResponsiveSpacing', () => {
    test('should return correct spacing class', () => {
      expect(getResponsiveSpacing('sm')).toBe('p-responsive-sm');
      expect(getResponsiveSpacing('lg')).toBe('p-responsive-lg');
      expect(getResponsiveSpacing()).toBe('p-responsive-md'); // default
    });

    test('should fallback to md for invalid size', () => {
      expect(getResponsiveSpacing('invalid')).toBe('p-responsive-md');
    });
  });

  describe('getResponsiveTextSize', () => {
    test('should return correct text size class', () => {
      expect(getResponsiveTextSize('sm')).toBe('text-responsive-sm');
      expect(getResponsiveTextSize('xl')).toBe('text-responsive-xl');
      expect(getResponsiveTextSize()).toBe('text-responsive-base'); // default
    });

    test('should fallback to base for invalid size', () => {
      expect(getResponsiveTextSize('invalid')).toBe('text-responsive-base');
    });
  });

  describe('getResponsiveHeading', () => {
    test('should return correct heading class', () => {
      expect(getResponsiveHeading(1)).toBe('heading-responsive-h1');
      expect(getResponsiveHeading(3)).toBe('heading-responsive-h3');
      expect(getResponsiveHeading(6)).toBe('heading-responsive-h6');
    });

    test('should fallback to h1 for invalid level', () => {
      expect(getResponsiveHeading(7)).toBe('heading-responsive-h1');
      expect(getResponsiveHeading()).toBe('heading-responsive-h1'); // default
    });
  });

  describe('generateResponsiveClasses', () => {
    test('should generate correct responsive classes', () => {
      const config = {
        xs: '1',
        sm: '2',
        md: '3',
        lg: '4',
      };
      
      const result = generateResponsiveClasses(config, 'grid-cols-');
      expect(result).toBe('grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4');
    });

    test('should handle xs breakpoint without prefix', () => {
      const config = {
        xs: 'block',
        md: 'flex',
      };
      
      const result = generateResponsiveClasses(config, '');
      expect(result).toBe('block md:flex');
    });

    test('should skip undefined values', () => {
      const config = {
        xs: '1',
        sm: undefined,
        md: '3',
      };
      
      const result = generateResponsiveClasses(config, 'grid-cols-');
      expect(result).toBe('grid-cols-1 md:grid-cols-3');
    });
  });

  describe('debounce', () => {
    test('should debounce function calls', (done) => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn();
      debouncedFn();
      debouncedFn();
      
      expect(mockFn).not.toHaveBeenCalled();
      
      setTimeout(() => {
        expect(mockFn).toHaveBeenCalledTimes(1);
        done();
      }, 150);
    });
  });

  describe('throttle', () => {
    test('should throttle function calls', (done) => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);
      
      throttledFn();
      throttledFn();
      throttledFn();
      
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      setTimeout(() => {
        throttledFn();
        expect(mockFn).toHaveBeenCalledTimes(2);
        done();
      }, 150);
    });
  });
});