# E2E Testing for UI Standardization

This directory contains comprehensive End-to-End (E2E) tests for the UI standardization project, covering all requirements specified in task 8.3.

## Requirements Coverage

This test suite addresses the following requirements:
- **6.1, 6.2, 6.3, 6.4, 6.5**: Navigation and menu standardization across all user roles
- **4.1, 4.2, 4.3, 4.4**: Responsive design standardization and mobile-first approach

## Test Categories

### 1. Navigation Consistency Tests (`navigation-consistency.test.js`)
- **Purpose**: Verify navigation behavior and consistency across different user roles
- **Coverage**:
  - Desktop navigation for all user roles (Customer, Operator, Admin, Trip Manager)
  - Mobile navigation patterns and responsive behavior
  - Navigation state persistence across page transitions
  - Hover states and interactive feedback
  - Navigation accessibility (keyboard support, ARIA attributes)
  - Navigation performance and responsiveness

### 2. Responsive Behavior Tests (`responsive-behavior.test.js`)
- **Purpose**: Test responsive design and mobile navigation patterns
- **Coverage**:
  - Viewport adaptation across all breakpoints (mobile, tablet, desktop, ultrawide)
  - Mobile navigation patterns (hamburger menu, drawer, gestures)
  - Touch interactions and touch-friendly button sizes
  - Content reflow and text scaling
  - Image and media responsiveness
  - Layout adaptation for different screen sizes

### 3. Cross-Browser Consistency Tests (`cross-browser-consistency.test.js`)
- **Purpose**: Ensure UI consistency across different browsers and platforms
- **Coverage**:
  - UI component rendering across Chromium, Firefox, and WebKit
  - Font rendering and fallback handling
  - CSS Grid and Flexbox support verification
  - Form element consistency across browsers
  - Animation and transition support
  - JavaScript functionality consistency
  - Performance consistency across browsers

### 4. Performance Tests (`performance.test.js`)
- **Purpose**: Test page load times and interaction responsiveness
- **Coverage**:
  - Page load performance measurement
  - Critical resource loading times
  - Concurrent user simulation
  - Interaction responsiveness (button clicks, form inputs, scrolling)
  - Navigation performance between pages
  - Mobile menu performance
  - Resource loading efficiency (images, CSS, JavaScript)
  - Memory and CPU performance monitoring

### 5. Accessibility Tests (`accessibility.test.js`)
- **Purpose**: Test keyboard navigation and screen reader support
- **Coverage**:
  - WCAG 2.1 AA compliance verification
  - Keyboard navigation support (Tab, Enter, Space, Arrow keys, Escape)
  - Screen reader support (ARIA labels, descriptions, live regions)
  - Color contrast requirements
  - Focus management in modals and interactive elements
  - Form accessibility (labels, validation messages)
  - Heading hierarchy and landmark roles

## Test Infrastructure

### Configuration Files
- `playwright.config.js`: Main Playwright configuration with browser projects and test settings
- `test-suite.js`: Test suite runner and health checks
- `helpers/test-utils.js`: Common utility functions and test helpers

### Test Data and Utilities
- **Mock Users**: Predefined user accounts for different roles
- **Viewport Configurations**: Standard viewport sizes for responsive testing
- **Performance Thresholds**: Acceptable performance limits for different operations
- **Helper Functions**: Reusable functions for login, navigation, performance measurement, etc.

## Running Tests

### Prerequisites
1. Install Playwright browsers:
   ```bash
   npm run test:e2e:install
   ```

2. Ensure the development server is running:
   ```bash
   npm run dev
   ```

### Test Execution Commands

```bash
# Run all E2E tests
npm run test:e2e

# Run tests with UI mode (interactive)
npm run test:e2e:ui

# Run tests in headed mode (visible browser)
npm run test:e2e:headed

# Debug tests step by step
npm run test:e2e:debug

# View test report
npm run test:e2e:report
```

### Running Specific Test Categories

```bash
# Navigation tests only
npx playwright test navigation-consistency

# Responsive behavior tests only
npx playwright test responsive-behavior

# Cross-browser tests only
npx playwright test cross-browser-consistency

# Performance tests only
npx playwright test performance

# Accessibility tests only
npx playwright test accessibility
```

### Running Tests for Specific Browsers

```bash
# Chrome only
npx playwright test --project=chromium

# Firefox only
npx playwright test --project=firefox

# Safari only
npx playwright test --project=webkit

# Mobile Chrome
npx playwright test --project="Mobile Chrome"

# Mobile Safari
npx playwright test --project="Mobile Safari"
```

## Test Results and Reporting

### Output Locations
- **Test Results**: `test-results/` directory
- **Screenshots**: `test-results/screenshots/` directory
- **Videos**: `test-results/videos/` directory (on failure)
- **HTML Report**: `playwright-report/` directory
- **JSON Report**: `test-results/e2e-results.json`
- **JUnit Report**: `test-results/e2e-results.xml`

### Performance Metrics
Tests automatically collect and report:
- Page load times
- Interaction response times
- Navigation performance
- Resource loading times
- Memory usage patterns
- Frame rates during animations

### Accessibility Reports
Accessibility tests generate:
- WCAG compliance reports
- Color contrast analysis
- Keyboard navigation verification
- Screen reader compatibility checks
- Focus management validation

## Test Data Requirements

### Test Attributes
Components should include `data-testid` attributes for reliable element selection:

```jsx
// Navigation elements
<nav data-testid="main-navigation">
  <button data-testid="mobile-menu-button">Menu</button>
  <div data-testid="mobile-menu">...</div>
  <a data-testid="nav-item" href="/dashboard">Dashboard</a>
</nav>

// Form elements
<form data-testid="login-form">
  <input data-testid="email-input" type="email" />
  <input data-testid="password-input" type="password" />
  <button data-testid="login-button" type="submit">Login</button>
</form>

// Layout elements
<div data-testid="main-layout">
  <header data-testid="header">...</header>
  <main data-testid="main-content">...</main>
</div>
```

### Mock Data
Tests use predefined mock users and data to ensure consistent test conditions across all test runs.

## Continuous Integration

### CI/CD Integration
The test suite is designed to run in CI/CD pipelines with:
- Parallel test execution
- Retry mechanisms for flaky tests
- Multiple output formats (HTML, JSON, JUnit)
- Screenshot and video capture on failures
- Performance regression detection

### Environment Variables
Configure tests using environment variables:
- `CI=true`: Enables CI-specific settings
- `BASE_URL`: Override default application URL
- `HEADLESS=false`: Run tests in headed mode
- `SLOW_MO=1000`: Add delays for debugging

## Troubleshooting

### Common Issues

1. **Tests failing due to timing**:
   - Increase timeouts in `playwright.config.js`
   - Use `waitForLoadState('networkidle')` for dynamic content

2. **Element not found errors**:
   - Verify `data-testid` attributes are present
   - Check element visibility and timing

3. **Performance test failures**:
   - Adjust performance thresholds in test files
   - Consider system load during test execution

4. **Accessibility test failures**:
   - Review WCAG guidelines
   - Check color contrast and keyboard navigation
   - Verify ARIA attributes are properly set

### Debug Mode
Use debug mode to step through tests interactively:
```bash
npm run test:e2e:debug
```

This opens the Playwright Inspector for step-by-step debugging.

## Best Practices

### Test Writing
1. Use descriptive test names that explain what is being tested
2. Include requirement references in test descriptions
3. Use page object patterns for complex interactions
4. Implement proper wait strategies for dynamic content
5. Take screenshots on failures for debugging

### Performance Testing
1. Set realistic performance thresholds
2. Account for system variations in CI environments
3. Test both cold and warm page loads
4. Monitor resource usage patterns

### Accessibility Testing
1. Test with actual assistive technologies when possible
2. Verify keyboard navigation paths
3. Check color contrast programmatically
4. Test focus management in dynamic content

### Maintenance
1. Update test data attributes when components change
2. Review and adjust performance thresholds regularly
3. Keep accessibility standards up to date
4. Monitor test flakiness and improve stability

## Contributing

When adding new tests:
1. Follow the existing test structure and naming conventions
2. Include proper requirement references
3. Add appropriate test data attributes to components
4. Update this documentation with new test coverage
5. Ensure tests are stable and not flaky

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Axe Accessibility Testing](https://www.deque.com/axe/)
- [Web Performance Best Practices](https://web.dev/performance/)