# UI Standardization Testing Guide

This guide covers the comprehensive testing infrastructure for the UI standardization project, including visual regression testing, component testing, E2E testing, and performance testing.

## Overview

The testing infrastructure includes:

1. **Visual Regression Testing** - Using Storybook for component documentation and visual testing
2. **Component Unit Testing** - Comprehensive unit tests with accessibility testing using jest-axe
3. **E2E Testing** - End-to-end tests for navigation consistency and user flows
4. **Performance Testing** - Component rendering and interaction performance tests

## Test Structure

```
frontend/src/test/
├── setup.js                           # Test setup and configuration
├── visual-regression.config.js        # Visual testing configuration
├── TESTING_GUIDE.md                   # This guide
├── e2e/
│   └── navigation-consistency.test.js  # E2E navigation tests
└── performance/
    └── component-performance.test.js   # Performance tests

frontend/src/components/ui/
├── buttons/
│   └── __tests__/
│       ├── StandardButton.test.jsx
│       └── StandardButton.accessibility.test.jsx
├── forms/
│   └── __tests__/
│       └── FormComponents.accessibility.test.jsx
└── __tests__/
    └── StandardPanel.accessibility.test.jsx

frontend/src/stories/
├── Welcome.stories.jsx
└── ui/
    ├── StandardPanel.stories.jsx
    └── FormComponents.stories.jsx
```

## Running Tests

### Unit Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- StandardButton.test.jsx

# Run accessibility tests only
npm test -- --testNamePattern="Accessibility"
```

### Visual Regression Tests (Storybook)

```bash
# Start Storybook for development
npm run storybook

# Build Storybook for production
npm run build-storybook

# Run visual regression tests (requires additional setup)
npm run test:visual
```

### E2E Tests

```bash
# Install Playwright (if not already installed)
npx playwright install

# Run E2E tests
npx playwright test

# Run E2E tests with UI
npx playwright test --ui

# Run specific E2E test
npx playwright test navigation-consistency
```

### Performance Tests

```bash
# Run performance tests
npx playwright test performance/

# Run performance tests with detailed reporting
npx playwright test performance/ --reporter=html
```

## Test Categories

### 1. Visual Regression Testing

Visual regression testing ensures UI components maintain consistent appearance across changes.

**Configuration**: `src/test/visual-regression.config.js`

**Key Features**:
- Multiple viewport testing (mobile, tablet, desktop, wide)
- Component variant testing
- Interaction state testing (hover, focus, active, disabled)
- Responsive behavior testing

**Storybook Stories**:
- `StandardButton.stories.jsx` - Button component variants and states
- `StandardPanel.stories.jsx` - Panel component variants and layouts
- `FormComponents.stories.jsx` - Form component states and validation

### 2. Component Unit Testing

Unit tests verify component functionality, props, and behavior.

**Key Features**:
- Component rendering tests
- Props validation tests
- Event handling tests
- State management tests
- Error boundary tests

**Example Test Structure**:
```javascript
describe('StandardButton', () => {
  it('should render with default props', () => {
    // Test implementation
  });

  it('should handle click events', () => {
    // Test implementation
  });

  it('should apply variant styles correctly', () => {
    // Test implementation
  });
});
```

### 3. Accessibility Testing

Accessibility tests ensure components meet WCAG 2.1 guidelines.

**Tools Used**:
- `jest-axe` for automated accessibility testing
- Manual keyboard navigation testing
- Screen reader compatibility testing

**Key Test Areas**:
- Color contrast compliance
- Keyboard navigation support
- ARIA attributes and roles
- Focus management
- Screen reader compatibility

**Example Accessibility Test**:
```javascript
it('should not have accessibility violations', async () => {
  const { container } = render(<StandardButton>Test</StandardButton>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### 4. E2E Testing

End-to-end tests verify complete user workflows and navigation consistency.

**Test Areas**:
- Navigation consistency across user roles
- Responsive navigation behavior
- Mobile menu functionality
- Keyboard navigation
- Performance metrics

**Key Features**:
- Multi-role testing (customer, operator, admin, trip manager)
- Cross-viewport testing
- Interaction performance measurement
- Accessibility compliance in real scenarios

### 5. Performance Testing

Performance tests ensure components render and interact efficiently.

**Metrics Measured**:
- First Contentful Paint (FCP) < 1.5s
- Largest Contentful Paint (LCP) < 2.5s
- First Input Delay (FID) < 100ms
- Cumulative Layout Shift (CLS) < 0.1
- Time to Interactive (TTI) < 3s

**Test Areas**:
- Component rendering performance
- Interaction responsiveness
- Memory usage and leak detection
- Bundle size impact
- Responsive performance across viewports

## Test Configuration

### Vitest Configuration

The project uses Vitest for unit testing with the following configuration:

```javascript
// vite.config.js
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/'],
    },
  },
});
```

### Storybook Configuration

Storybook is configured for visual testing and component documentation:

```javascript
// .storybook/main.js
const config = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-docs',
    '@storybook/addon-viewport',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};
```

### Playwright Configuration

E2E and performance tests use Playwright:

```javascript
// playwright.config.js
module.exports = {
  testDir: './src/test/e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', use: { ...devices['iPhone 12'] } },
  ],
};
```

## Best Practices

### Writing Component Tests

1. **Test Behavior, Not Implementation**
   ```javascript
   // Good
   it('should show loading state when loading prop is true', () => {
     render(<StandardButton loading>Save</StandardButton>);
     expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
   });

   // Avoid
   it('should set loading state in component state', () => {
     // Testing internal implementation
   });
   ```

2. **Use Semantic Queries**
   ```javascript
   // Good
   const button = screen.getByRole('button', { name: 'Save Changes' });
   const input = screen.getByLabelText('Email Address');

   // Avoid
   const button = screen.getByTestId('save-button');
   ```

3. **Test Accessibility**
   ```javascript
   it('should be accessible', async () => {
     const { container } = render(<Component />);
     const results = await axe(container);
     expect(results).toHaveNoViolations();
   });
   ```

### Writing Visual Tests

1. **Cover All Variants**
   ```javascript
   export const AllVariants = () => (
     <div>
       <StandardButton variant="primary">Primary</StandardButton>
       <StandardButton variant="secondary">Secondary</StandardButton>
       <StandardButton variant="success">Success</StandardButton>
     </div>
   );
   ```

2. **Test Interaction States**
   ```javascript
   export const InteractionStates = () => (
     <div>
       <StandardButton>Default</StandardButton>
       <StandardButton disabled>Disabled</StandardButton>
       <StandardButton loading>Loading</StandardButton>
     </div>
   );
   ```

3. **Include Responsive Examples**
   ```javascript
   export const ResponsiveBehavior = () => (
     <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
       {/* Responsive grid content */}
     </div>
   );
   ```

### Writing E2E Tests

1. **Use Page Object Model**
   ```javascript
   class NavigationPage {
     constructor(page) {
       this.page = page;
     }

     async clickMenuItem(itemName) {
       await this.page.click(`[data-testid="nav-item"]:has-text("${itemName}")`);
     }
   }
   ```

2. **Test Real User Scenarios**
   ```javascript
   test('user can complete booking flow', async ({ page }) => {
     await page.goto('/');
     await page.click('text=Book Trip');
     await page.fill('[data-testid="destination"]', 'Ho Chi Minh City');
     await page.click('[data-testid="search-button"]');
     // Continue with realistic user flow
   });
   ```

3. **Verify Performance**
   ```javascript
   test('page loads within performance budget', async ({ page }) => {
     const startTime = Date.now();
     await page.goto('/dashboard');
     await page.waitForLoadState('networkidle');
     const loadTime = Date.now() - startTime;
     expect(loadTime).toBeLessThan(3000);
   });
   ```

## Continuous Integration

### GitHub Actions Workflow

```yaml
name: UI Testing
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:coverage
      
      - name: Build Storybook
        run: npm run build-storybook
      
      - name: Run E2E tests
        run: npx playwright test
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: test-results
          path: test-results/
```

## Troubleshooting

### Common Issues

1. **Tests failing due to timing issues**
   - Use `waitFor` utilities
   - Increase timeout for slow operations
   - Use `waitForLoadState` in E2E tests

2. **Accessibility violations**
   - Check color contrast ratios
   - Ensure proper ARIA attributes
   - Verify keyboard navigation

3. **Visual regression failures**
   - Update baseline images if changes are intentional
   - Check for font loading issues
   - Verify consistent test environment

4. **Performance test failures**
   - Check for memory leaks
   - Optimize component rendering
   - Review bundle size impact

### Debugging Tips

1. **Use test debugging tools**
   ```javascript
   import { screen } from '@testing-library/react';
   
   // Debug rendered output
   screen.debug();
   
   // Debug specific element
   screen.debug(screen.getByRole('button'));
   ```

2. **Visual debugging in E2E tests**
   ```javascript
   // Take screenshot for debugging
   await page.screenshot({ path: 'debug.png' });
   
   // Run with headed browser
   npx playwright test --headed
   ```

3. **Performance debugging**
   ```javascript
   // Monitor performance in browser
   const metrics = await page.evaluate(() => performance.getEntriesByType('navigation'));
   console.log(metrics);
   ```

## Maintenance

### Regular Tasks

1. **Update test snapshots** when UI changes are intentional
2. **Review and update accessibility tests** as WCAG guidelines evolve
3. **Monitor performance budgets** and adjust thresholds as needed
4. **Update E2E tests** when user flows change
5. **Maintain Storybook stories** to reflect current component APIs

### Test Coverage Goals

- **Unit Test Coverage**: > 80%
- **Accessibility Coverage**: 100% of interactive components
- **Visual Regression Coverage**: All component variants and states
- **E2E Coverage**: All critical user flows
- **Performance Coverage**: All major components and pages

This comprehensive testing infrastructure ensures the UI standardization maintains high quality, accessibility, and performance standards throughout development and maintenance.