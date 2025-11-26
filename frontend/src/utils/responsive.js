/**
 * Responsive Utility Functions for QuikRide UI Standardization
 * Provides JavaScript utilities for responsive behavior and breakpoint management
 */

import { useState, useEffect } from 'react';

// Breakpoint definitions (matching Tailwind config)
export const BREAKPOINTS = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// Breakpoint names in order
export const BREAKPOINT_NAMES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

/**
 * Get current breakpoint based on window width
 * @returns {string} Current breakpoint name
 */
export const getCurrentBreakpoint = () => {
  if (typeof window === 'undefined') return 'lg'; // SSR fallback
  
  const width = window.innerWidth;
  
  if (width >= BREAKPOINTS['2xl']) return '2xl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  if (width >= BREAKPOINTS.xs) return 'xs';
  return 'xs';
};

/**
 * Check if current viewport matches a breakpoint
 * @param {string} breakpoint - Breakpoint to check
 * @returns {boolean} Whether current viewport matches breakpoint
 */
export const isBreakpoint = (breakpoint) => {
  if (typeof window === 'undefined') return false;
  
  const width = window.innerWidth;
  return width >= BREAKPOINTS[breakpoint];
};

/**
 * Check if current viewport is mobile (below md breakpoint)
 * @returns {boolean} Whether current viewport is mobile
 */
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < BREAKPOINTS.md;
};

/**
 * Check if current viewport is tablet (md to lg breakpoint)
 * @returns {boolean} Whether current viewport is tablet
 */
export const isTablet = () => {
  if (typeof window === 'undefined') return false;
  const width = window.innerWidth;
  return width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
};

/**
 * Check if current viewport is desktop (lg and above)
 * @returns {boolean} Whether current viewport is desktop
 */
export const isDesktop = () => {
  if (typeof window === 'undefined') return true; // SSR fallback
  return window.innerWidth >= BREAKPOINTS.lg;
};

/**
 * Get responsive value based on current breakpoint
 * @param {Object} values - Object with breakpoint keys and values
 * @param {*} defaultValue - Default value if no breakpoint matches
 * @returns {*} Value for current breakpoint
 */
export const getResponsiveValue = (values, defaultValue = null) => {
  if (typeof window === 'undefined') return defaultValue;
  
  const currentBreakpoint = getCurrentBreakpoint();
  const currentIndex = BREAKPOINT_NAMES.indexOf(currentBreakpoint);
  
  // Find the largest breakpoint that has a value and is <= current breakpoint
  for (let i = currentIndex; i >= 0; i--) {
    const breakpoint = BREAKPOINT_NAMES[i];
    if (values[breakpoint] !== undefined) {
      return values[breakpoint];
    }
  }
  
  return defaultValue;
};

/**
 * Create a media query string for a breakpoint
 * @param {string} breakpoint - Breakpoint name
 * @param {string} direction - 'up' or 'down'
 * @returns {string} Media query string
 */
export const createMediaQuery = (breakpoint, direction = 'up') => {
  const width = BREAKPOINTS[breakpoint];
  if (!width) return '';
  
  if (direction === 'up') {
    return `(min-width: ${width}px)`;
  } else if (direction === 'down') {
    return `(max-width: ${width - 1}px)`;
  }
  
  return '';
};

/**
 * Hook for responsive behavior (React hook)
 * @param {string} breakpoint - Breakpoint to watch
 * @returns {boolean} Whether current viewport matches breakpoint
 */
export const useBreakpoint = (breakpoint) => {
  if (typeof window === 'undefined') return false;
  
  const [matches, setMatches] = useState(isBreakpoint(breakpoint));
  
  useEffect(() => {
    const mediaQuery = window.matchMedia(createMediaQuery(breakpoint));
    
    const handleChange = (e) => {
      setMatches(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    setMatches(mediaQuery.matches);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [breakpoint]);
  
  return matches;
};

/**
 * Hook for current breakpoint (React hook)
 * @returns {string} Current breakpoint name
 */
export const useCurrentBreakpoint = () => {
  if (typeof window === 'undefined') return 'lg';
  
  const [currentBreakpoint, setCurrentBreakpoint] = useState(getCurrentBreakpoint());
  
  useEffect(() => {
    const handleResize = () => {
      setCurrentBreakpoint(getCurrentBreakpoint());
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial value
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return currentBreakpoint;
};

/**
 * Hook for mobile detection (React hook)
 * @returns {boolean} Whether current viewport is mobile
 */
export const useIsMobile = () => {
  if (typeof window === 'undefined') return false;
  
  const [mobile, setMobile] = useState(isMobile());
  
  useEffect(() => {
    const handleResize = () => {
      setMobile(isMobile());
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial value
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return mobile;
};

/**
 * Get responsive grid columns based on breakpoint
 * @param {Object} config - Grid configuration object
 * @returns {number} Number of columns for current breakpoint
 */
export const getResponsiveGridColumns = (config = {}) => {
  const defaultConfig = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 6,
    '2xl': 12,
  };
  
  const mergedConfig = { ...defaultConfig, ...config };
  return getResponsiveValue(mergedConfig, 1);
};

/**
 * Get responsive spacing value
 * @param {string} size - Size variant (xs, sm, md, lg, xl)
 * @returns {string} Tailwind spacing class
 */
export const getResponsiveSpacing = (size = 'md') => {
  const spacingMap = {
    xs: 'p-responsive-xs',
    sm: 'p-responsive-sm',
    md: 'p-responsive-md',
    lg: 'p-responsive-lg',
    xl: 'p-responsive-xl',
  };
  
  return spacingMap[size] || spacingMap.md;
};

/**
 * Get responsive text size class
 * @param {string} size - Size variant
 * @returns {string} Tailwind text size class
 */
export const getResponsiveTextSize = (size = 'base') => {
  const textSizeMap = {
    xs: 'text-responsive-xs',
    sm: 'text-responsive-sm',
    base: 'text-responsive-base',
    lg: 'text-responsive-lg',
    xl: 'text-responsive-xl',
    '2xl': 'text-responsive-2xl',
    '3xl': 'text-responsive-3xl',
    '4xl': 'text-responsive-4xl',
  };
  
  return textSizeMap[size] || textSizeMap.base;
};

/**
 * Get responsive heading class
 * @param {number} level - Heading level (1-6)
 * @returns {string} Tailwind heading class
 */
export const getResponsiveHeading = (level = 1) => {
  const headingMap = {
    1: 'heading-responsive-h1',
    2: 'heading-responsive-h2',
    3: 'heading-responsive-h3',
    4: 'heading-responsive-h4',
    5: 'heading-responsive-h5',
    6: 'heading-responsive-h6',
  };
  
  return headingMap[level] || headingMap[1];
};

/**
 * Generate responsive class names based on configuration
 * @param {Object} config - Configuration object with breakpoint keys
 * @param {string} prefix - Class prefix
 * @returns {string} Space-separated class names
 */
export const generateResponsiveClasses = (config, prefix = '') => {
  const classes = [];
  
  BREAKPOINT_NAMES.forEach((breakpoint) => {
    if (config[breakpoint] !== undefined) {
      const value = config[breakpoint];
      const breakpointPrefix = breakpoint === 'xs' ? '' : `${breakpoint}:`;
      classes.push(`${breakpointPrefix}${prefix}${value}`);
    }
  });
  
  return classes.join(' ');
};

/**
 * Debounce function for resize events
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 150) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for scroll/resize events
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit time in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit = 100) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Export default object with all utilities
export default {
  BREAKPOINTS,
  BREAKPOINT_NAMES,
  getCurrentBreakpoint,
  isBreakpoint,
  isMobile,
  isTablet,
  isDesktop,
  getResponsiveValue,
  createMediaQuery,
  useBreakpoint,
  useCurrentBreakpoint,
  useIsMobile,
  getResponsiveGridColumns,
  getResponsiveSpacing,
  getResponsiveTextSize,
  getResponsiveHeading,
  generateResponsiveClasses,
  debounce,
  throttle,
};