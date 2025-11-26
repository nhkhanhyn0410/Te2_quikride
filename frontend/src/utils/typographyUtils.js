/**
 * Typography utility functions for consistent text styling
 */

import { typography } from '../theme/themeConfig';

/**
 * Get font size configuration by key
 * @param {string} key - Font size key (e.g., 'base', 'lg', 'xl')
 * @returns {object} Font size configuration with size and line height
 */
export const getFontSize = (key = 'base') => {
  const fontConfig = typography.fontSize[key];
  if (!fontConfig) {
    console.warn(`Font size '${key}' not found, using base`);
    const baseConfig = typography.fontSize.base;
    if (Array.isArray(baseConfig)) {
      return {
        fontSize: baseConfig[0],
        lineHeight: baseConfig[1]?.lineHeight || baseConfig[1],
      };
    }
    return { fontSize: baseConfig };
  }
  
  if (Array.isArray(fontConfig)) {
    return {
      fontSize: fontConfig[0],
      lineHeight: fontConfig[1]?.lineHeight || fontConfig[1],
    };
  }
  
  return { fontSize: fontConfig };
};

/**
 * Get font weight by key
 * @param {string} key - Font weight key (e.g., 'normal', 'medium', 'bold')
 * @returns {string} Font weight value
 */
export const getFontWeight = (key = 'normal') => {
  return typography.fontWeight[key] || typography.fontWeight.normal;
};

/**
 * Get font family by key
 * @param {string} key - Font family key (e.g., 'sans')
 * @returns {string} Font family value
 */
export const getFontFamily = (key = 'sans') => {
  const fontFamily = typography.fontFamily[key];
  if (Array.isArray(fontFamily)) {
    return fontFamily.join(', ');
  }
  return fontFamily || typography.fontFamily.sans.join(', ');
};

/**
 * Generate typography classes for Tailwind CSS
 * @param {object} options - Typography options
 * @param {string} options.size - Font size key
 * @param {string} options.weight - Font weight key
 * @param {string} options.family - Font family key
 * @param {string} options.color - Text color
 * @param {string} options.align - Text alignment
 * @param {string} options.transform - Text transform
 * @param {string} options.decoration - Text decoration
 * @returns {string} Tailwind CSS typography classes
 */
export const generateTypographyClasses = (options = {}) => {
  const classes = [];
  
  if (options.size) {
    classes.push(`text-${options.size}`);
  }
  
  if (options.weight) {
    classes.push(`font-${options.weight}`);
  }
  
  if (options.family) {
    classes.push(`font-${options.family}`);
  }
  
  if (options.color) {
    classes.push(`text-${options.color}`);
  }
  
  if (options.align) {
    classes.push(`text-${options.align}`);
  }
  
  if (options.transform) {
    classes.push(`${options.transform}`);
  }
  
  if (options.decoration) {
    classes.push(`${options.decoration}`);
  }
  
  return classes.join(' ');
};

/**
 * Generate responsive typography classes
 * @param {object} breakpoints - Breakpoint-specific typography
 * @param {string} property - Typography property ('text', 'font')
 * @returns {string} Responsive Tailwind CSS classes
 */
export const generateResponsiveTypography = (breakpoints, property = 'text') => {
  const classes = [];
  
  Object.entries(breakpoints).forEach(([breakpoint, value]) => {
    if (breakpoint === 'base') {
      classes.push(`${property}-${value}`);
    } else {
      classes.push(`${breakpoint}:${property}-${value}`);
    }
  });
  
  return classes.join(' ');
};

/**
 * Create typography style object for inline styles
 * @param {object} options - Typography options
 * @returns {object} CSS style object
 */
export const createTypographyStyles = (options = {}) => {
  const styles = {};
  
  if (options.size) {
    const fontConfig = getFontSize(options.size);
    styles.fontSize = fontConfig.fontSize;
    if (fontConfig.lineHeight) {
      styles.lineHeight = fontConfig.lineHeight;
    }
  }
  
  if (options.weight) {
    styles.fontWeight = getFontWeight(options.weight);
  }
  
  if (options.family) {
    styles.fontFamily = getFontFamily(options.family);
  }
  
  if (options.color) {
    styles.color = options.color;
  }
  
  if (options.align) {
    styles.textAlign = options.align;
  }
  
  if (options.transform) {
    styles.textTransform = options.transform;
  }
  
  if (options.decoration) {
    styles.textDecoration = options.decoration;
  }
  
  if (options.letterSpacing) {
    styles.letterSpacing = options.letterSpacing;
  }
  
  if (options.wordSpacing) {
    styles.wordSpacing = options.wordSpacing;
  }
  
  return styles;
};

/**
 * Typography presets for common use cases
 */
export const typographyPresets = {
  // Headings
  headings: {
    h1: { size: '5xl', weight: 'bold', color: 'neutral-900' },
    h2: { size: '4xl', weight: 'bold', color: 'neutral-900' },
    h3: { size: '3xl', weight: 'semibold', color: 'neutral-900' },
    h4: { size: '2xl', weight: 'semibold', color: 'neutral-800' },
    h5: { size: 'xl', weight: 'semibold', color: 'neutral-800' },
    h6: { size: 'lg', weight: 'medium', color: 'neutral-700' },
  },
  
  // Body text
  body: {
    large: { size: 'lg', weight: 'normal', color: 'neutral-700' },
    normal: { size: 'base', weight: 'normal', color: 'neutral-700' },
    small: { size: 'sm', weight: 'normal', color: 'neutral-600' },
    tiny: { size: 'xs', weight: 'normal', color: 'neutral-500' },
  },
  
  // UI elements
  ui: {
    button: { size: 'base', weight: 'medium', color: 'white' },
    label: { size: 'sm', weight: 'medium', color: 'neutral-700' },
    caption: { size: 'xs', weight: 'normal', color: 'neutral-500' },
    code: { size: 'sm', weight: 'normal', family: 'mono' },
  },
  
  // Status text
  status: {
    success: { size: 'sm', weight: 'medium', color: 'success-600' },
    warning: { size: 'sm', weight: 'medium', color: 'warning-600' },
    error: { size: 'sm', weight: 'medium', color: 'error-600' },
    info: { size: 'sm', weight: 'medium', color: 'primary-600' },
  },
  
  // Links
  links: {
    primary: { size: 'base', weight: 'medium', color: 'primary-600', decoration: 'underline' },
    secondary: { size: 'sm', weight: 'normal', color: 'neutral-600', decoration: 'underline' },
    subtle: { size: 'base', weight: 'normal', color: 'neutral-700' },
  },
};

/**
 * Apply typography preset
 * @param {string} category - Preset category
 * @param {string} variant - Preset variant
 * @returns {object} Typography configuration
 */
export const applyTypographyPreset = (category, variant) => {
  return typographyPresets[category]?.[variant] || {};
};

/**
 * Calculate optimal line height for given font size
 * @param {string} fontSize - Font size in pixels
 * @returns {string} Calculated line height
 */
export const calculateLineHeight = (fontSize) => {
  const size = parseInt(fontSize);
  if (size <= 14) return '1.5';
  if (size <= 18) return '1.4';
  if (size <= 24) return '1.3';
  return '1.2';
};

/**
 * Get text truncation classes
 * @param {string} type - Truncation type ('truncate', 'ellipsis', 'clip')
 * @param {number} lines - Number of lines for multi-line truncation
 * @returns {string} Tailwind CSS classes
 */
export const getTextTruncationClasses = (type = 'truncate', lines = 1) => {
  if (type === 'truncate') {
    return 'truncate';
  }
  
  if (type === 'ellipsis' && lines > 1) {
    return `line-clamp-${lines}`;
  }
  
  if (type === 'clip') {
    return 'text-clip overflow-hidden';
  }
  
  return 'truncate';
};

/**
 * Generate text contrast classes based on background
 * @param {string} background - Background color
 * @returns {string} Text color classes for good contrast
 */
export const getContrastTextClasses = (background) => {
  const darkBackgrounds = [
    'neutral-800', 'neutral-900',
    'primary-800', 'primary-900',
    'success-800', 'success-900',
    'warning-800', 'warning-900',
    'error-800', 'error-900'
  ];
  
  if (darkBackgrounds.some(dark => background.includes(dark))) {
    return 'text-white';
  }
  
  return 'text-neutral-900';
};

export default {
  getFontSize,
  getFontWeight,
  getFontFamily,
  generateTypographyClasses,
  generateResponsiveTypography,
  createTypographyStyles,
  typographyPresets,
  applyTypographyPreset,
  calculateLineHeight,
  getTextTruncationClasses,
  getContrastTextClasses,
};