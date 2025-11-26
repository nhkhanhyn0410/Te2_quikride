# Backend Testing Setup - Vé xe nhanh

## Overview

This directory contains all backend tests for the Vé xe nhanh project. The testing framework uses **Jest** with **Supertest** for API testing.

## Test Structure

```
backend/tests/
├── setup.js                    # Global test configuration
├── unit/                       # Unit tests
│   ├── services/              # Service layer tests
│   │   └── auth.service.test.js
│   └── middleware/            # Middleware tests
│       └── auth.middleware.test.js
├── integration/               # Integration tests (TODO)
└── e2e/                      # End-to-end tests (TODO)
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage
```bash
npm test -- --coverage
```

### Run specific test file
```bash
npm test -- auth.service.test.js
```

## Test Coverage

Current coverage focuses on authentication module (Phase 1.7):
- ✅ Authentication Service (`auth.service.js`)
- ✅ Authentication Middleware (`auth.middleware.js`)

Coverage thresholds are currently set low (9%) as we're only testing authentication. These will be increased as more tests are added in future phases.

## Writing Tests

### Example: Service Test

```javascript
const AuthService = require('../../../src/services/auth.service');
const User = require('../../../src/models/User');

jest.mock('../../../src/models/User');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should login successfully with valid credentials', async () => {
    // Setup mock
    const mockUser = {
      _id: '123',
      email: 'test@example.com',
      comparePassword: jest.fn().mockResolvedValue(true),
    };

    User.findByEmailOrPhone = jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    });

    // Execute
    const result = await AuthService.login('test@example.com', 'password');

    // Assert
    expect(result.user).toBeDefined();
    expect(result.accessToken).toBeDefined();
  });
});
```

### Example: Middleware Test

```javascript
const { authenticate } = require('../../../src/middleware/auth.middleware');

describe('authenticate', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  it('should return 401 if no token provided', async () => {
    await authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
```

## Test Environment

Tests run with the following environment variables (from `tests/setup.js`):
- `NODE_ENV=test`
- `JWT_SECRET=test-jwt-secret-key-for-testing-purposes-only`
- `JWT_ACCESS_EXPIRES=1d`
- `JWT_REFRESH_EXPIRES=7d`
- `SESSION_TIMEOUT_MINUTES=30`

## Best Practices

1. **Isolation**: Each test should be independent and not rely on other tests
2. **Mocking**: Mock external dependencies (database, services) to test logic in isolation
3. **Clear**: Use descriptive test names that explain what is being tested
4. **AAA Pattern**: Arrange, Act, Assert
5. **Clean up**: Use `beforeEach` and `afterEach` to reset state between tests

## Test Results Summary

**Backend Tests (Phase 1.7)**
- Test Suites: 2 passed
- Tests: 40 passed
- Coverage:
  - auth.middleware.js: 90.66% statements
  - auth.service.js: 35.25% statements

## Next Steps

- [ ] Add integration tests for API endpoints
- [ ] Add tests for other controllers and services
- [ ] Increase coverage thresholds as more tests are added
- [ ] Add E2E tests for critical user flows
