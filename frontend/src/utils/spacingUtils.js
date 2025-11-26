/**
 * Spacing utility functions for consistent margin and padding application
 */

import { spacing } from '../theme/themeConfig';

/**
 * Get spacing value by key
 * @param {string|number} key - Spacing key (e.g., '4', 4, 'lg')
 * @returns {string} Spacing value in pixels
 */
export const getSpacing = (key) => {
  // Handle numeric keys
  if (typeof key === 'number') {
    key = key.toString();
  }
  
  // Handle string keys
  if (typeof key === 'string') {
    return spacing[key] || spacing['4']; // Default to 16px
  }
  
  return spacing['4']; // Default fallback
};

/**
 * Generate margin classes for Tailwind CSS
 * @param {object} options - Margin options
 * @param {string|number} options.all - All sides margin
 * @param {string|number} options.x - Horizontal margin
 * @param {string|number} options.y - Vertical margin
 * @param {string|number} options.top - Top margin
 * @param {string|number} options.right - Right margin
 * @param {string|number} options.bottom - Bottom margin
 * @param {string|number} options.left - Left margin
 * @returns {string} Tailwind CSS margin classes
 */
export const generateMarginClasses = (options = {}) => {
  const classes = [];
  
  if (options.all !== undefined) {
    classes.push(`m-${options.all}`);
  }
  
  if (options.x !== undefined) {
    classes.push(`mx-${options.x}`);
  }
  
  if (options.y !== undefined) {
    classes.push(`my-${options.y}`);
  }
  
  if (options.top !== undefined) {
    classes.push(`mt-${options.top}`);
  }
  
  if (options.right !== undefined) {
    classes.push(`mr-${options.right}`);
  }
  
  if (options.bottom !== undefined) {
    classes.push(`mb-${options.bottom}`);
  }
  
  if (options.left !== undefined) {
    classes.push(`ml-${options.left}`);
  }
  
  return classes.join(' ');
};

/**
 * Generate padding classes for Tailwind CSS
 * @param {object} options - Padding options
 * @param {string|number} options.all - All sides padding
 * @param {string|number} options.x - Horizontal padding
 * @param {string|number} options.y - Vertical padding
 * @param {string|number} options.top - Top padding
 * @param {string|number} options.right - Right padding
 * @param {string|number} options.bottom - Bottom padding
 * @param {string|number} options.left - Left padding
 * @returns {string} Tailwind CSS padding classes
 */
export const generatePaddingClasses = (options = {}) => {
  const classes = [];
  
  if (options.all !== undefined) {
    classes.push(`p-${options.all}`);
  }
  
  if (options.x !== undefined) {
    classes.push(`px-${options.x}`);
  }
  
  if (options.y !== undefined) {
    classes.push(`py-${options.y}`);
  }
  
  if (options.top !== undefined) {
    classes.push(`pt-${options.top}`);
  }
  
  if (options.right !== undefined) {
    classes.push(`pr-${options.right}`);
  }
  
  if (options.bottom !== undefined) {
    classes.push(`pb-${options.bottom}`);
  }
  
  if (options.left !== undefined) {
    classes.push(`pl-${options.left}`);
  }
  
  return classes.join(' ');
};

/**
 * Generate gap classes for flexbox and grid layouts
 * @param {string|number} gap - Gap value
 * @param {string|number} gapX - Horizontal gap
 * @param {string|number} gapY - Vertical gap
 * @returns {string} Tailwind CSS gap classes
 */
export const generateGapClasses = (gap, gapX, gapY) => {
  const classes = [];
  
  if (gap !== undefined) {
    classes.push(`gap-${gap}`);
  }
  
  if (gapX !== undefined) {
    classes.push(`gap-x-${gapX}`);
  }
  
  if (gapY !== undefined) {
    classes.push(`gap-y-${gapY}`);
  }
  
  return classes.join(' ');
};

/**
 * Generate responsive spacing classes
 * @param {object} breakpoints - Breakpoint-specific spacing
 * @param {string} type - Type of spacing ('m', 'p', 'gap')
 * @param {string} direction - Direction ('', 'x', 'y', 't', 'r', 'b', 'l')
 * @returns {string} Responsive Tailwind CSS classes
 */
export const generateResponsiveSpacing = (breakpoints, type = 'm', direction = '') => {
  const classes = [];
  const prefix = direction ? `${type}${direction}` : type;
  
  Object.entries(breakpoints).forEach(([breakpoint, value]) => {
    if (breakpoint === 'base') {
      classes.push(`${prefix}-${value}`);
    } else {
      classes.push(`${breakpoint}:${prefix}-${value}`);
    }
  });
  
  return classes.join(' ');
};

/**
 * Create spacing style object for inline styles
 * @param {object} options - Spacing options
 * @returns {object} CSS style object
 */
export const createSpacingStyles = (options = {}) => {
  const styles = {};
  
  if (options.margin !== undefined) {
    if (typeof options.margin === 'object') {
      if (options.margin.all !== undefined) {
        styles.margin = getSpacing(options.margin.all);
      } else {
        if (options.margin.top !== undefined) styles.marginTop = getSpacing(options.margin.top);
        if (options.margin.right !== undefined) styles.marginRight = getSpacing(options.margin.right);
        if (options.margin.bottom !== undefined) styles.marginBottom = getSpacing(options.margin.bottom);
        if (options.margin.left !== undefined) styles.marginLeft = getSpacing(options.margin.left);
        if (options.margin.x !== undefined) {
          styles.marginLeft = getSpacing(options.margin.x);
          styles.marginRight = getSpacing(options.margin.x);
        }
        if (options.margin.y !== undefined) {
          styles.marginTop = getSpacing(options.margin.y);
          styles.marginBottom = getSpacing(options.margin.y);
        }
      }
    } else {
      styles.margin = getSpacing(options.margin);
    }
  }
  
  if (options.padding !== undefined) {
    if (typeof options.padding === 'object') {
      if (options.padding.all !== undefined) {
        styles.padding = getSpacing(options.padding.all);
      } else {
        if (options.padding.top !== undefined) styles.paddingTop = getSpacing(options.padding.top);
        if (options.padding.right !== undefined) styles.paddingRight = getSpacing(options.padding.right);
        if (options.padding.bottom !== undefined) styles.paddingBottom = getSpacing(options.padding.bottom);
        if (options.padding.left !== undefined) styles.paddingLeft = getSpacing(options.padding.left);
        if (options.padding.x !== undefined) {
          styles.paddingLeft = getSpacing(options.padding.x);
          styles.paddingRight = getSpacing(options.padding.x);
        }
        if (options.padding.y !== undefined) {
          styles.paddingTop = getSpacing(options.padding.y);
          styles.paddingBottom = getSpacing(options.padding.y);
        }
      }
    } else {
      styles.padding = getSpacing(options.padding);
    }
  }
  
  return styles;
};

/**
 * Spacing presets for common use cases
 */
export const spacingPresets = {
  // Component spacing
  component: {
    tight: { padding: { all: 2 }, margin: { bottom: 2 } },
    normal: { padding: { all: 4 }, margin: { bottom: 4 } },
    loose: { padding: { all: 6 }, margin: { bottom: 6 } },
  },
  
  // Layout spacing
  layout: {
    section: { padding: { y: 12 }, margin: { bottom: 8 } },
    container: { padding: { x: 4 }, margin: { x: 'auto' } },
    grid: { gap: 6 },
  },
  
  // Form spacing
  form: {
    field: { margin: { bottom: 4 } },
    group: { margin: { bottom: 6 } },
    actions: { margin: { top: 8 }, gap: 4 },
  },
  
  // Card spacing
  card: {
    compact: { padding: { all: 4 } },
    comfortable: { padding: { all: 6 } },
    spacious: { padding: { all: 8 } },
  },
};

/**
 * Apply spacing preset
 * @param {string} category - Preset category
 * @param {string} variant - Preset variant
 * @returns {object} Spacing configuration
 */
export const applySpacingPreset = (category, variant) => {
  return spacingPresets[category]?.[variant] || {};
};

export default {
  getSpacing,
  generateMarginClasses,
  generatePaddingClasses,
  generateGapClasses,
  generateResponsiveSpacing,
  createSpacingStyles,
  spacingPresets,
  applySpacingPreset,
};