/**
 * Visual Regression Testing Configuration
 * Configuration for visual testing of UI components
 */

export const visualTestConfig = {
  // Viewport configurations for responsive testing
  viewports: {
    mobile: {
      name: 'Mobile',
      width: 375,
      height: 667,
    },
    tablet: {
      name: 'Tablet',
      width: 768,
      height: 1024,
    },
    desktop: {
      name: 'Desktop',
      width: 1024,
      height: 768,
    },
    wide: {
      name: 'Wide Desktop',
      width: 1440,
      height: 900,
    },
  },

  // Component test scenarios
  testScenarios: {
    buttons: {
      variants: ['primary', 'secondary', 'success', 'warning', 'danger', 'ghost', 'link'],
      sizes: ['small', 'medium', 'large'],
      states: ['default', 'hover', 'focus', 'active', 'disabled', 'loading'],
      withIcons: true,
      responsive: true,
    },
    panels: {
      variants: ['default', 'elevated', 'bordered', 'ghost'],
      sizes: ['small', 'medium', 'large'],
      padding: ['compact', 'comfortable', 'spacious'],
      withHeader: true,
      withFooter: true,
      responsive: true,
    },
    forms: {
      components: ['input', 'select', 'textarea', 'datepicker'],
      states: ['default', 'focus', 'error', 'success', 'warning', 'disabled'],
      responsive: true,
    },
    navigation: {
      roles: ['customer', 'operator', 'admin', 'tripManager'],
      states: ['default', 'active', 'hover'],
      responsive: true,
      mobileMenu: true,
    },
  },

  // Visual testing thresholds
  thresholds: {
    // Pixel difference threshold (0-1, where 0 is identical)
    pixelThreshold: 0.1,
    // Percentage of different pixels allowed
    threshold: 0.01,
    // Include anti-aliasing in comparison
    includeAA: false,
  },

  // Animation and timing settings
  animations: {
    // Disable animations for consistent screenshots
    disableAnimations: true,
    // Wait time before taking screenshot
    delay: 500,
  },

  // Screenshot settings
  screenshot: {
    // Full page or element only
    fullPage: false,
    // Clip to element bounds
    clip: true,
    // Omit background for transparent elements
    omitBackground: false,
  },
};

// Test utilities for visual regression
export const visualTestUtils = {
  /**
   * Generate test cases for component variants
   */
  generateVariantTests: (component, variants) => {
    return variants.map(variant => ({
      name: `${component}-${variant}`,
      variant,
      story: `${component}--${variant}`,
    }));
  },

  /**
   * Generate responsive test cases
   */
  generateResponsiveTests: (component, viewports) => {
    return Object.entries(viewports).map(([name, viewport]) => ({
      name: `${component}-${name}`,
      viewport,
      story: `${component}--responsive`,
    }));
  },

  /**
   * Generate interaction state tests
   */
  generateInteractionTests: (component, states) => {
    return states.map(state => ({
      name: `${component}-${state}`,
      state,
      story: `${component}--interactive`,
      interactions: getInteractionForState(state),
    }));
  },
};

/**
 * Get interaction steps for different states
 */
function getInteractionForState(state) {
  const interactions = {
    hover: [
      { type: 'hover', selector: '[data-testid="component"]' }
    ],
    focus: [
      { type: 'focus', selector: '[data-testid="component"]' }
    ],
    active: [
      { type: 'mousedown', selector: '[data-testid="component"]' }
    ],
    disabled: [],
    loading: [],
    default: [],
  };

  return interactions[state] || [];
}

// Storybook visual testing configuration
export const storybookVisualConfig = {
  // Stories to test
  stories: [
    'UI Components/Buttons/**',
    'UI Components/Panels/**',
    'UI Components/Forms/**',
    'UI Components/Navigation/**',
  ],

  // Test parameters
  parameters: {
    // Chromatic configuration
    chromatic: {
      // Viewports to test
      viewports: [375, 768, 1024, 1440],
      // Disable animations
      pauseAnimationAtEnd: true,
      // Delay before screenshot
      delay: 300,
    },

    // Percy configuration (alternative visual testing service)
    percy: {
      // Skip stories that don't need visual testing
      skip: false,
      // Additional CSS to inject
      additionalSnapshots: [
        {
          prefix: 'Mobile - ',
          widths: [375],
        },
        {
          prefix: 'Tablet - ',
          widths: [768],
        },
        {
          prefix: 'Desktop - ',
          widths: [1024, 1440],
        },
      ],
    },
  },
};

export default visualTestConfig;