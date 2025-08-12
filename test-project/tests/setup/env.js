/**
 * Test Environment Configuration
 * Sets up environment variables for testing
 */

// Ensure we're in test environment
process.env.NODE_ENV = 'test';

// Database configuration for testing
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://testuser:testpass@localhost:5432/taskdb_test';

// JWT configuration for testing
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.JWT_EXPIRES_IN = '1h';

// Security configuration for testing
process.env.BCRYPT_SALT_ROUNDS = '10'; // Reduced for faster tests
process.env.RATE_LIMIT_WINDOW_MS = '60000';
process.env.RATE_LIMIT_MAX_REQUESTS = '1000'; // Higher limit for tests

// CORS configuration for testing
process.env.ALLOWED_ORIGINS = 'http://localhost:3000,http://localhost:3001';

// Logging configuration for testing
process.env.LOG_LEVEL = 'error'; // Reduce log noise during tests

// Disable helmet in tests for easier testing
process.env.HELMET_ENABLED = 'false';

// Sandbox mode
process.env.SANDBOX_MODE = 'true';
process.env.NO_INTERNET = 'true';
process.env.OFFLINE_MODE = 'true';
