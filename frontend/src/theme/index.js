/**
 * Theme module exports
 */

export { default as ThemeProvider, useTheme } from './ThemeProvider';
export { 
  defaultTheme, 
  antdTheme, 
  colorPalette, 
  typography, 
  spacing, 
  shadows, 
  borderRadius 
} from './themeConfig';
export {
  getColor,
  getSpacing,
  getTypography,
  getShadow,
  getBorderRadius,
  generateCSSVariables,
  createBreakpoints,
  default as themeUtils
} from './themeUtils';

// Re-export everything for convenience
export * from './themeConfig';
export * from './themeUtils';