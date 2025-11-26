/**
 * Ant Design Theme Configuration
 * Defines the custom theme tokens for the QuikRide application
 */

// Color palette based on design requirements
export const colorPalette = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Base primary color
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // Base success color
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Base warning color
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444', // Base error color
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280', // Base neutral color
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
};

// Typography scale
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
  },
  fontSize: {
    xs: ['12px', { lineHeight: '16px' }],
    sm: ['14px', { lineHeight: '20px' }],
    base: ['16px', { lineHeight: '24px' }],
    lg: ['18px', { lineHeight: '28px' }],
    xl: ['20px', { lineHeight: '28px' }],
    '2xl': ['24px', { lineHeight: '32px' }],
    '3xl': ['30px', { lineHeight: '36px' }],
    '4xl': ['36px', { lineHeight: '40px' }],
    '5xl': ['48px', { lineHeight: '1' }],
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

// Spacing scale
export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
  40: '160px',
  48: '192px',
  56: '224px',
  64: '256px',
};

// Shadow scale
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
};

// Border radius scale
export const borderRadius = {
  none: '0px',
  sm: '2px',
  base: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  '3xl': '24px',
  full: '9999px',
};

// Ant Design theme configuration
export const antdTheme = {
  token: {
    // Color tokens
    colorPrimary: colorPalette.primary[500],
    colorSuccess: colorPalette.success[500],
    colorWarning: colorPalette.warning[500],
    colorError: colorPalette.error[500],
    colorInfo: colorPalette.primary[500],
    
    // Typography tokens
    fontFamily: typography.fontFamily.sans.join(', '),
    fontSize: 16,
    fontSizeHeading1: 48,
    fontSizeHeading2: 36,
    fontSizeHeading3: 30,
    fontSizeHeading4: 24,
    fontSizeHeading5: 20,
    fontSizeLG: 18,
    fontSizeSM: 14,
    fontSizeXS: 12,
    
    // Spacing tokens
    padding: 16,
    paddingXS: 8,
    paddingSM: 12,
    paddingLG: 24,
    paddingXL: 32,
    margin: 16,
    marginXS: 8,
    marginSM: 12,
    marginLG: 24,
    marginXL: 32,
    
    // Border radius tokens
    borderRadius: 6,
    borderRadiusXS: 2,
    borderRadiusSM: 4,
    borderRadiusLG: 8,
    borderRadiusOuter: 4,
    
    // Shadow tokens
    boxShadow: shadows.base,
    boxShadowSecondary: shadows.sm,
    boxShadowTertiary: shadows.lg,
    
    // Layout tokens
    sizeUnit: 4,
    sizeStep: 4,
    wireframe: false,
    
    // Component specific tokens
    controlHeight: 32,
    controlHeightSM: 24,
    controlHeightLG: 40,
    controlHeightXS: 16,
    
    // Line height
    lineHeight: 1.5,
    lineHeightHeading1: 1.2,
    lineHeightHeading2: 1.3,
    lineHeightHeading3: 1.3,
    lineHeightHeading4: 1.4,
    lineHeightHeading5: 1.5,
    
    // Motion
    motionDurationFast: '0.1s',
    motionDurationMid: '0.2s',
    motionDurationSlow: '0.3s',
  },
  components: {
    Button: {
      borderRadius: 6,
      controlHeight: 40,
      controlHeightSM: 32,
      controlHeightLG: 48,
      fontWeight: 500,
    },
    Input: {
      borderRadius: 6,
      controlHeight: 40,
      controlHeightSM: 32,
      controlHeightLG: 48,
    },
    Card: {
      borderRadius: 8,
      paddingLG: 24,
    },
    Modal: {
      borderRadius: 8,
    },
    Table: {
      borderRadius: 8,
      headerBg: colorPalette.neutral[50],
    },
    Menu: {
      borderRadius: 6,
      itemBorderRadius: 4,
    },
    Tabs: {
      borderRadius: 6,
    },
    Select: {
      borderRadius: 6,
      controlHeight: 40,
      controlHeightSM: 32,
      controlHeightLG: 48,
    },
    DatePicker: {
      borderRadius: 6,
      controlHeight: 40,
      controlHeightSM: 32,
      controlHeightLG: 48,
    },
  },
  algorithm: [], // Can be used for dark theme later
};

// Default theme configuration
export const defaultTheme = {
  colors: colorPalette,
  typography,
  spacing,
  shadows,
  borderRadius,
  antd: antdTheme,
};

export default defaultTheme;