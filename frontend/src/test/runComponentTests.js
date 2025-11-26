/**
 * Component Test Runner
 * Script to run all UI standardization component tests
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Test configuration
const TEST_CONFIG = {
  testMatch: [
    '<rootDir>/src/components/ui/**/*.test.{js,jsx}',
    '<rootDir>/src/test/integration/**/*.test.{js,jsx}',
    '<rootDir>/src/test/performance/**/*.test.{js,jsx}',
  ],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup/testSetup.js'],
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    'src/components/ui/**/*.{js,jsx}',
    '!src/components/ui/**/*.stories.{js,jsx}',
    '!src/components/ui/**/*.demo.{js,jsx}',
    '!src/components/ui/**/index.js',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  verbose: true,
  bail: false,
  maxWorkers: '50%',
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  log('\n' + '='.repeat(60), 'cyan');
  log(`  ${title}`, 'bright');
  log('='.repeat(60), 'cyan');
}

function logSubsection(title) {
  log(`\n${'-'.repeat(40)}`, 'blue');
  log(`  ${title}`, 'blue');
  log('-'.repeat(40), 'blue');
}

// Test categories
const testCategories = [
  {
    name: 'Unit Tests - Button Components',
    pattern: 'src/components/ui/buttons/**/*.test.jsx',
    description: 'Testing individual button components'
  },
  {
    name: 'Unit Tests - Form Components',
    pattern: 'src/components/ui/forms/**/*.test.jsx',
    description: 'Testing form input and validation components'
  },
  {
    name: 'Unit Tests - Panel Components',
    pattern: 'src/components/ui/__tests__/*Panel*.test.jsx',
    description: 'Testing panel and layout components'
  },
  {
    name: 'Unit Tests - Data Display Components',
    pattern: 'src/components/ui/data-display/**/*.test.jsx',
    description: 'Testing tables, charts, and data visualization'
  },
  {
    name: 'Unit Tests - Card Components',
    pattern: 'src/components/ui/cards/**/*.test.jsx',
    description: 'Testing card and container components'
  },
  {
    name: 'Unit Tests - Modal Components',
    pattern: 'src/components/ui/modals/**/*.test.jsx',
    description: 'Testing modal and dialog components'
  },
  {
    name: 'Unit Tests - Responsive Components',
    pattern: 'src/components/ui/responsive/**/*.test.jsx',
    description: 'Testing responsive layout and utility components'
  },
  {
    name: 'Unit Tests - Media Components',
    pattern: 'src/components/ui/media/**/*.test.jsx',
    description: 'Testing image, video, and media components'
  },
  {
    name: 'Integration Tests',
    pattern: 'src/test/integration/**/*.test.jsx',
    description: 'Testing component integration and workflows'
  },
  {
    name: 'Accessibility Tests',
    pattern: 'src/components/ui/**/*.accessibility.test.jsx',
    description: 'Testing WCAG compliance and accessibility'
  },
  {
    name: 'Performance Tests',
    pattern: 'src/test/performance/**/*.test.js',
    description: 'Testing component performance and optimization'
  }
];

// Function to run tests for a specific category
function runTestCategory(category) {
  logSubsection(`Running: ${category.name}`);
  log(category.description, 'yellow');
  
  try {
    const command = `npm test -- --testPathPattern="${category.pattern}" --passWithNoTests`;
    log(`Command: ${command}`, 'blue');
    
    const result = execSync(command, {
      cwd: process.cwd(),
      stdio: 'inherit',
      encoding: 'utf8'
    });
    
    log(`✅ ${category.name} - PASSED`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${category.name} - FAILED`, 'red');
    log(`Error: ${error.message}`, 'red');
    return false;
  }
}

// Function to run all tests
function runAllTests() {
  logSection('UI Standardization Component Tests');
  
  const results = {
    passed: 0,
    failed: 0,
    categories: []
  };
  
  // Run each test category
  for (const category of testCategories) {
    const success = runTestCategory(category);
    results.categories.push({
      name: category.name,
      success
    });
    
    if (success) {
      results.passed++;
    } else {
      results.failed++;
    }
  }
  
  // Summary
  logSection('Test Results Summary');
  
  results.categories.forEach(result => {
    const status = result.success ? '✅ PASSED' : '❌ FAILED';
    const color = result.success ? 'green' : 'red';
    log(`${status} - ${result.name}`, color);
  });
  
  log(`\nTotal Categories: ${results.passed + results.failed}`, 'bright');
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  
  const successRate = ((results.passed / (results.passed + results.failed)) * 100).toFixed(1);
  log(`Success Rate: ${successRate}%`, successRate >= 80 ? 'green' : 'yellow');
  
  return results.failed === 0;
}

// Function to run coverage report
function runCoverageReport() {
  logSection('Generating Coverage Report');
  
  try {
    const command = 'npm test -- --coverage --watchAll=false --testPathPattern="src/components/ui"';
    log(`Command: ${command}`, 'blue');
    
    execSync(command, {
      cwd: process.cwd(),
      stdio: 'inherit',
      encoding: 'utf8'
    });
    
    log('✅ Coverage report generated successfully', 'green');
    log('📊 Check coverage/lcov-report/index.html for detailed report', 'cyan');
    return true;
  } catch (error) {
    log('❌ Failed to generate coverage report', 'red');
    log(`Error: ${error.message}`, 'red');
    return false;
  }
}

// Function to validate test setup
function validateTestSetup() {
  logSection('Validating Test Setup');
  
  const requiredFiles = [
    'src/test/setup/testSetup.js',
    'package.json',
    'jest.config.js'
  ];
  
  let allValid = true;
  
  for (const file of requiredFiles) {
    if (fs.existsSync(path.join(process.cwd(), file))) {
      log(`✅ ${file} - Found`, 'green');
    } else {
      log(`❌ ${file} - Missing`, 'red');
      allValid = false;
    }
  }
  
  // Check if required dependencies are installed
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = [
    '@testing-library/react',
    '@testing-library/jest-dom',
    '@testing-library/user-event',
    'jest-axe'
  ];
  
  for (const dep of requiredDeps) {
    if (packageJson.devDependencies?.[dep] || packageJson.dependencies?.[dep]) {
      log(`✅ ${dep} - Installed`, 'green');
    } else {
      log(`❌ ${dep} - Missing`, 'red');
      allValid = false;
    }
  }
  
  return allValid;
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'all';
  
  switch (command) {
    case 'validate':
      validateTestSetup();
      break;
    case 'coverage':
      runCoverageReport();
      break;
    case 'category':
      const categoryName = args[1];
      const category = testCategories.find(c => 
        c.name.toLowerCase().includes(categoryName?.toLowerCase())
      );
      if (category) {
        runTestCategory(category);
      } else {
        log('❌ Category not found', 'red');
        log('Available categories:', 'yellow');
        testCategories.forEach(c => log(`  - ${c.name}`, 'blue'));
      }
      break;
    case 'all':
    default:
      if (validateTestSetup()) {
        const success = runAllTests();
        if (success) {
          log('\n🎉 All tests passed! Running coverage report...', 'green');
          runCoverageReport();
        } else {
          log('\n⚠️  Some tests failed. Fix issues before generating coverage.', 'yellow');
          process.exit(1);
        }
      } else {
        log('\n❌ Test setup validation failed. Please fix setup issues.', 'red');
        process.exit(1);
      }
      break;
  }
}

// Help text
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  log('UI Component Test Runner', 'bright');
  log('\nUsage:', 'yellow');
  log('  node runComponentTests.js [command]', 'blue');
  log('\nCommands:', 'yellow');
  log('  all (default) - Run all test categories', 'blue');
  log('  validate      - Validate test setup', 'blue');
  log('  coverage      - Generate coverage report only', 'blue');
  log('  category <name> - Run specific test category', 'blue');
  log('\nExamples:', 'yellow');
  log('  node runComponentTests.js', 'blue');
  log('  node runComponentTests.js validate', 'blue');
  log('  node runComponentTests.js category button', 'blue');
  process.exit(0);
}

// Run main function
main();