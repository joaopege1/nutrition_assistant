# Test Suite Documentation

This directory contains comprehensive unit and integration tests for the RCU App backend API.

## Test Structure

```
test/
├── __init__.py              # Test package initialization
├── conftest.py              # Pytest fixtures and configuration
├── test_auth.py             # Authentication router tests
├── test_food.py             # Food entry router tests
├── test_users.py            # User management router tests
├── test_admin.py            # Admin router tests
└── test_integration.py      # Integration tests
```

## Setup

### Install Dependencies

```bash
pip install -r requirements-test.txt
```

### Required Packages

- `pytest` - Testing framework
- `pytest-asyncio` - Async support for pytest
- `httpx` - HTTP client for testing FastAPI
- `pytest-cov` - Test coverage reporting

## Running Tests

### Run All Tests

```bash
pytest
```

### Run Specific Test Files

```bash
# Run only authentication tests
pytest test/test_auth.py

# Run only food entry tests
pytest test/test_food.py

# Run only integration tests
pytest test/test_integration.py
```

### Run Tests by Marker

```bash
# Run only unit tests
pytest -m unit

# Run only integration tests
pytest -m integration

# Run only auth-related tests
pytest -m auth

# Run only admin-related tests
pytest -m admin
```

### Run with Coverage

```bash
# Run all tests with coverage report
pytest --cov=. --cov-report=html --cov-report=term

# View HTML coverage report
open htmlcov/index.html
```

### Verbose Output

```bash
# Run with verbose output
pytest -v

# Run with extra verbose output (show all test names)
pytest -vv
```

### Run Specific Test

```bash
# Run a specific test class
pytest test/test_auth.py::TestUserCreation

# Run a specific test method
pytest test/test_auth.py::TestUserCreation::test_create_user_success
```

## Test Categories

### Unit Tests (`@pytest.mark.unit`)

Unit tests focus on testing individual components in isolation:

- **Authentication Tests** - User creation, login, token validation
- **Food Entry Tests** - CRUD operations for food entries
- **User Tests** - User profile and password management
- **Admin Tests** - Admin-specific operations

### Integration Tests (`@pytest.mark.integration`)

Integration tests verify complete workflows:

- **User Registration & Login Flow** - Complete signup to login process
- **Food Entry Workflow** - Full CRUD cycle
- **Admin User Management** - Admin managing users and roles
- **Admin Food Moderation** - Admin reviewing and updating food entries
- **Multi-User Scenarios** - Testing data isolation between users
- **Authentication Flow** - Token validation across endpoints
- **Data Validation** - Input validation testing

## Test Fixtures

The `conftest.py` file provides several fixtures:

- `db_session` - Fresh in-memory database for each test
- `client` - FastAPI test client
- `test_user` - Pre-created regular user
- `test_admin` - Pre-created admin user
- `user_token` - JWT token for regular user
- `admin_token` - JWT token for admin user
- `auth_headers` - Authorization headers for regular user
- `admin_headers` - Authorization headers for admin user
- `sample_food_entry` - Single food entry
- `multiple_food_entries` - Multiple food entries for different users

## Writing New Tests

### Example Unit Test

```python
@pytest.mark.unit
@pytest.mark.food
def test_create_food_entry(client, auth_headers):
    """Test creating a food entry."""
    response = client.post(
        "/food_entry/",
        json={
            "user": "testuser",
            "food": "Apple",
            "quantity": 5,
            "is_safe": True,
            "date": datetime.now().isoformat()
        },
        headers=auth_headers
    )
    assert response.status_code == 201
```

### Example Integration Test

```python
@pytest.mark.integration
def test_complete_workflow(client):
    """Test complete user workflow."""
    # 1. Create user
    signup_response = client.post("/auth/", json={...})
    
    # 2. Login
    login_response = client.post("/auth/tokens", data={...})
    
    # 3. Use token to access protected endpoint
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    protected_response = client.get("/users/", headers=headers)
    
    assert protected_response.status_code == 200
```

## Test Database

Tests use an in-memory SQLite database that is:
- Created fresh for each test
- Isolated from the production database
- Automatically cleaned up after each test

## Continuous Integration

These tests are designed to run in CI/CD pipelines. Example GitHub Actions workflow:

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
        with:
          python-version: '3.11'
      - run: pip install -r requirements.txt
      - run: pip install -r requirements-test.txt
      - run: pytest --cov=. --cov-report=xml
```

## Best Practices

1. **Use Fixtures** - Leverage pytest fixtures for common setup
2. **Test Isolation** - Each test should be independent
3. **Descriptive Names** - Test names should describe what they test
4. **Assert Messages** - Use clear assertion messages
5. **Mark Tests** - Use markers to categorize tests
6. **Clean Data** - Clean up test data (fixtures handle this automatically)

## Coverage Goals

- **Overall Coverage**: Target 80%+ code coverage
- **Critical Paths**: 100% coverage for authentication and authorization
- **Edge Cases**: Include tests for error conditions and edge cases

## Troubleshooting

### Tests Failing Locally

1. Ensure all dependencies are installed: `pip install -r requirements-test.txt`
2. Check that you're in the project root directory
3. Verify database permissions (tests use in-memory DB)

### Import Errors

Make sure you're running pytest from the project root:
```bash
cd /path/to/rcu_app
pytest
```

### Fixture Not Found

Ensure `conftest.py` is in the `test/` directory and properly configured.

## Contributing

When adding new features:
1. Write tests first (TDD approach)
2. Ensure all tests pass before committing
3. Add appropriate markers to new tests
4. Update this README if adding new test categories

