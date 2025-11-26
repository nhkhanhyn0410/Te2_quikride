/**
 * Combined style utilities for spacing, typography, and responsive design
 */

import spacingUtils from './spacingUtils';
import typographyUtils from './typographyUtils';

/**
 * Generate combined component classes
 * @param {object} options - Style options
 * @param {object} options.spacing - Spacing configuration
 * @param {object} options.typography - Typography configuration
 * @param {string} options.className - Additional classes
 * @returns {string} Combined Tailwind CSS classes
 */
export const generateComponentClasses = (options = {}) => {
  const classes = [];
  
  // Add spacing classes
  if (options.spacing) {
    if (options.spacing.margin) {
      classes.push(spacingUtils.generateMarginClasses(options.spacing.margin));
    }
    if (options.spacing.padding) {
      classes.push(spacingUtils.generatePaddingClasses(options.spacing.padding));
    }
    if (options.spacing.gap) {
      classes.push(spacingUtils.generateGapClasses(options.spacing.gap));
    }
  }
  
  // Add typography classes
  if (options.typography) {
    classes.push(typographyUtils.generateTypographyClasses(options.typography));
  }
  
  // Add custom classes
  if (options.className) {
    classes.push(options.className);
  }
  
  return classes.filter(Boolean).join(' ');
};

/**
 * Generate responsive component classes
 * @param {object} breakpoints - Breakpoint-specific configurations
 * @returns {string} Responsive Tailwind CSS classes
 */
export const generateResponsiveClasses = (breakpoints = {}) => {
  const classes = [];
  
  Object.entries(breakpoints).forEach(([breakpoint, config]) => {
    const prefix = breakpoint === 'base' ? '' : `${breakpoint}:`;
    
    if (config.spacing) {
      if (config.spacing.margin) {
        const marginClasses = spacingUtils.generateMarginClasses(config.spacing.margin);
        if (prefix) {
          classes.push(marginClasses.split(' ').map(cls => `${prefix}${cls}`).join(' '));
        } else {
          classes.push(marginClasses);
        }
      }
      
      if (config.spacing.padding) {
        const paddingClasses = spacingUtils.generatePaddingClasses(config.spacing.padding);
        if (prefix) {
          classes.push(paddingClasses.split(' ').map(cls => `${prefix}${cls}`).join(' '));
        } else {
          classes.push(paddingClasses);
        }
      }
    }
    
    if (config.typography) {
      const typographyClasses = typographyUtils.generateTypographyClasses(config.typography);
      if (prefix) {
        classes.push(typographyClasses.split(' ').map(cls => `${prefix}${cls}`).join(' '));
      } else {
        classes.push(typographyClasses);
      }
    }
  });
  
  return classes.filter(Boolean).join(' ');
};

/**
 * Create combined inline styles
 * @param {object} options - Style options
 * @returns {object} Combined CSS style object
 */
export const createComponentStyles = (options = {}) => {
  const styles = {};
  
  // Add spacing styles
  if (options.spacing) {
    Object.assign(styles, spacingUtils.createSpacingStyles(options.spacing));
  }
  
  // Add typography styles
  if (options.typography) {
    Object.assign(styles, typographyUtils.createTypographyStyles(options.typography));
  }
  
  // Add custom styles
  if (options.style) {
    Object.assign(styles, options.style);
  }
  
  return styles;
};

/**
 * Common component style presets
 */
export const componentPresets = {
  // Button variants
  button: {
    primary: {
      typography: { size: 'base', weight: 'medium' },
      spacing: { padding: { x: 4, y: 2 } },
      className: 'bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors',
    },
    secondary: {
      typography: { size: 'base', weight: 'medium' },
      spacing: { padding: { x: 4, y: 2 } },
      className: 'bg-neutral-100 text-neutral-700 rounded-md hover:bg-neutral-200 transition-colors',
    },
    ghost: {
      typography: { size: 'base', weight: 'medium' },
      spacing: { padding: { x: 4, y: 2 } },
      className: 'text-primary-600 hover:bg-primary-50 rounded-md transition-colors',
    },
  },
  
  // Card variants
  card: {
    default: {
      spacing: { padding: { all: 6 } },
      className: 'bg-white rounded-lg shadow-sm border border-neutral-200',
    },
    elevated: {
      spacing: { padding: { all: 6 } },
      className: 'bg-white rounded-lg shadow-md border border-neutral-200',
    },
    bordered: {
      spacing: { padding: { all: 6 } },
      className: 'bg-white rounded-lg border-2 border-neutral-300',
    },
  },
  
  // Form elements
  form: {
    field: {
      spacing: { margin: { bottom: 4 } },
      className: 'w-full',
    },
    label: {
      typography: { size: 'sm', weight: 'medium', color: 'neutral-700' },
      spacing: { margin: { bottom: 1 } },
      className: 'block',
    },
    input: {
      typography: { size: 'base' },
      spacing: { padding: { x: 3, y: 2 } },
      className: 'w-full border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
    },
    error: {
      typography: { size: 'sm', color: 'error-600' },
      spacing: { margin: { top: 1 } },
    },
  },
  
  // Layout components
  layout: {
    container: {
      spacing: { padding: { x: 4 }, margin: { x: 'auto' } },
      className: 'max-w-7xl',
    },
    section: {
      spacing: { padding: { y: 12 } },
    },
    grid: {
      spacing: { gap: 6 },
      className: 'grid',
    },
  },
};

/**
 * Apply component preset
 * @param {string} category - Preset category
 * @param {string} variant - Preset variant
 * @returns {object} Component style configuration
 */
export const applyComponentPreset = (category, variant) => {
  return componentPresets[category]?.[variant] || {};
};

/**
 * Merge style configurations
 * @param {...object} configs - Style configurations to merge
 * @returns {object} Merged configuration
 */
export const mergeStyleConfigs = (...configs) => {
  const merged = {
    spacing: {},
    typography: {},
    className: '',
    style: {},
  };
  
  configs.forEach(config => {
    if (config.spacing) {
      Object.assign(merged.spacing, config.spacing);
    }
    if (config.typography) {
      Object.assign(merged.typography, config.typography);
    }
    if (config.className) {
      merged.className = `${merged.className} ${config.className}`.trim();
    }
    if (config.style) {
      Object.assign(merged.style, config.style);
    }
  });
  
  return merged;
};

/**
 * Create responsive breakpoint configuration
 * @param {object} base - Base configuration
 * @param {object} overrides - Breakpoint-specific overrides
 * @returns {object} Responsive configuration
 */
export const createResponsiveConfig = (base, overrides = {}) => {
  return {
    base,
    ...overrides,
  };
};

export default {
  generateComponentClasses,
  generateResponsiveClasses,
  createComponentStyles,
  componentPresets,
  applyComponentPreset,
  mergeStyleConfigs,
  createResponsiveConfig,
  ...spacingUtils,
  ...typographyUtils,
};