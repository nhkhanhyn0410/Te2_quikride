/**
 * Theme utility functions for accessing theme values
 */

import { defaultTheme } from './themeConfig';

/**
 * Get color value from theme palette
 * @param {string} color - Color name (e.g., 'primary', 'success')
 * @param {number|string} shade - Color shade (e.g., 500, '500')
 * @param {object} theme - Theme object (optional, defaults to defaultTheme)
 * @returns {string} Color value
 */
export const getColor = (color, shade = 500, theme = defaultTheme) => {
  try {
    const colorPalette = theme.colors[color];
    if (!colorPalette) {
      console.warn(`Color '${color}' not found in theme`);
      return theme.colors.neutral[500]; // Fallback to neutral
    }
    
    const colorValue = colorPalette[shade];
    if (!colorValue) {
      console.warn(`Shade '${shade}' not found for color '${color}'`);
      return colorPalette[500] || colorPalette[Object.keys(colorPalette)[0]]; // Fallback to 500 or first available
    }
    
    return colorValue;
  } catch (error) {
    console.error('Error getting color:', error);
    return '#6b7280'; // Fallback to neutral gray
  }
};

/**
 * Get spacing value from theme
 * @param {number|string} size - Spacing size (e.g., 4, '4')
 * @param {object} theme - Theme object (optional, defaults to defaultTheme)
 * @returns {string} Spacing value
 */
export const getSpacing = (size, theme = defaultTheme) => {
  try {
    const spacingValue = theme.spacing[size];
    if (!spacingValue) {
      console.warn(`Spacing '${size}' not found in theme`);
      return theme.spacing[4] || '16px'; // Fallback to base spacing
    }
    return spacingValue;
  } catch (error) {
    console.error('Error getting spacing:', error);
    return '16px'; // Fallback spacing
  }
};

/**
 * Get typography value from theme
 * @param {string} property - Typography property (e.g., 'fontSize', 'fontWeight')
 * @param {string} size - Typography size (e.g., 'base', 'lg')
 * @param {object} theme - Theme object (optional, defaults to defaultTheme)
 * @returns {string|array} Typography value
 */
export const getTypography = (property, size, theme = defaultTheme) => {
  try {
    const typographyProperty = theme.typography[property];
    if (!typographyProperty) {
      console.warn(`Typography property '${property}' not found in theme`);
      return null;
    }
    
    const value = typographyProperty[size];
    if (!value) {
      console.warn(`Typography size '${size}' not found for property '${property}'`);
      return typographyProperty.base || Object.values(typographyProperty)[0]; // Fallback to base or first available
    }
    
    return value;
  } catch (error) {
    console.error('Error getting typography:', error);
    return null;
  }
};

/**
 * Get shadow value from theme
 * @param {string} size - Shadow size (e.g., 'sm', 'base', 'lg')
 * @param {object} theme - Theme object (optional, defaults to defaultTheme)
 * @returns {string} Shadow value
 */
export const getShadow = (size = 'base', theme = defaultTheme) => {
  try {
    const shadowValue = theme.shadows[size];
    if (!shadowValue) {
      console.warn(`Shadow '${size}' not found in theme`);
      return theme.shadows.base || '0 1px 3px 0 rgb(0 0 0 / 0.1)'; // Fallback to base shadow
    }
    return shadowValue;
  } catch (error) {
    console.error('Error getting shadow:', error);
    return '0 1px 3px 0 rgb(0 0 0 / 0.1)'; // Fallback shadow
  }
};

/**
 * Get border radius value from theme
 * @param {string} size - Border radius size (e.g., 'sm', 'base', 'lg')
 * @param {object} theme - Theme object (optional, defaults to defaultTheme)
 * @returns {string} Border radius value
 */
export const getBorderRadius = (size = 'base', theme = defaultTheme) => {
  try {
    const radiusValue = theme.borderRadius[size];
    if (!radiusValue) {
      console.warn(`Border radius '${size}' not found in theme`);
      return theme.borderRadius.base || '4px'; // Fallback to base radius
    }
    return radiusValue;
  } catch (error) {
    console.error('Error getting border radius:', error);
    return '4px'; // Fallback radius
  }
};

/**
 * Generate CSS custom properties from theme
 * @param {object} theme - Theme object (optional, defaults to defaultTheme)
 * @returns {object} CSS custom properties object
 */
export const generateCSSVariables = (theme = defaultTheme) => {
  const cssVars = {};
  
  try {
    // Color variables
    Object.entries(theme.colors).forEach(([colorName, colorPalette]) => {
      Object.entries(colorPalette).forEach(([shade, value]) => {
        cssVars[`--color-${colorName}-${shade}`] = value;
      });
    });
    
    // Spacing variables
    Object.entries(theme.spacing).forEach(([size, value]) => {
      cssVars[`--spacing-${size}`] = value;
    });
    
    // Typography variables
    if (theme.typography.fontSize) {
      Object.entries(theme.typography.fontSize).forEach(([size, value]) => {
        const fontSize = Array.isArray(value) ? value[0] : value;
        cssVars[`--font-size-${size}`] = fontSize;
      });
    }
    
    // Shadow variables
    Object.entries(theme.shadows).forEach(([size, value]) => {
      cssVars[`--shadow-${size}`] = value;
    });
    
    // Border radius variables
    Object.entries(theme.borderRadius).forEach(([size, value]) => {
      cssVars[`--border-radius-${size}`] = value;
    });
    
  } catch (error) {
    console.error('Error generating CSS variables:', error);
  }
  
  return cssVars;
};

/**
 * Create responsive breakpoint utilities
 * @param {object} theme - Theme object (optional, defaults to defaultTheme)
 * @returns {object} Breakpoint utilities
 */
export const createBreakpoints = (theme = defaultTheme) => {
  const breakpoints = {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1280px',
    wide: '1536px',
  };
  
  return {
    mobile: `@media (max-width: ${breakpoints.mobile})`,
    tablet: `@media (max-width: ${breakpoints.tablet})`,
    desktop: `@media (min-width: ${breakpoints.tablet})`,
    wide: `@media (min-width: ${breakpoints.wide})`,
    between: (min, max) => `@media (min-width: ${breakpoints[min]}) and (max-width: ${breakpoints[max]})`,
  };
};

export default {
  getColor,
  getSpacing,
  getTypography,
  getShadow,
  getBorderRadius,
  generateCSSVariables,
  createBreakpoints,
};