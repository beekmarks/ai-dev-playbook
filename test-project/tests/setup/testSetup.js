/**
 * Test Setup and Configuration
 * Configures test environment with database isolation and cleanup
 */

const { pool, testConnection, closePool } = require('../../src/config/database');
const { runMigrations } = require('../../src/database/migrate');
const logger = require('../../src/utils/logger');

// Suppress logs during testing
logger.info = jest.fn();
logger.warn = jest.fn();
logger.error = jest.fn();
logger.debug = jest.fn();
logger.logAuth = jest.fn();
logger.logSecurity = jest.fn();
logger.logRequest = jest.fn();

/**
 * Setup test database before all tests
 */
const setupTestDatabase = async () => {
  try {
    // Ensure we're using test database
    if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.includes('test')) {
      throw new Error('Test database not configured. Please set DATABASE_URL to test database.');
    }

    // Test connection
    await testConnection();
    
    // Run migrations
    await runMigrations();
    
    console.log('✅ Test database setup complete');
  } catch (error) {
    console.error('❌ Test database setup failed:', error.message);
    throw error;
  }
};

/**
 * Clean up test database after all tests
 */
const teardownTestDatabase = async () => {
  try {
    await closePool();
    console.log('✅ Test database cleanup complete');
  } catch (error) {
    console.error('❌ Test database cleanup failed:', error.message);
  }
};

/**
 * Clear all data from test tables
 */
const clearTestData = async () => {
  try {
    // Delete in correct order due to foreign key constraints
    await pool.query('DELETE FROM tasks');
    await pool.query('DELETE FROM users');
    await pool.query('DELETE FROM migrations WHERE filename LIKE \'%seed%\'');
    
    // Reset sequences
    await pool.query('ALTER SEQUENCE tasks_id_seq RESTART WITH 1');
    await pool.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
  } catch (error) {
    console.error('Failed to clear test data:', error.message);
    throw error;
  }
};

/**
 * Create test user for authentication tests
 * @param {Object} userData - User data override
 * @returns {Object} Created user data
 */
const createTestUser = async (userData = {}) => {
  const bcrypt = require('bcryptjs');
  
  const defaultUser = {
    email: 'test@example.com',
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User'
  };
  
  const user = { ...defaultUser, ...userData };
  const passwordHash = await bcrypt.hash(user.password, 12);
  
  const query = `
    INSERT INTO users (email, password_hash, first_name, last_name)
    VALUES ($1, $2, $3, $4)
    RETURNING id, email, first_name, last_name, created_at
  `;
  
  const result = await pool.query(query, [
    user.email,
    passwordHash,
    user.firstName,
    user.lastName
  ]);
  
  return {
    ...result.rows[0],
    password: user.password // Include original password for testing
  };
};

/**
 * Create test task for task-related tests
 * @param {number} userId - User ID who owns the task
 * @param {Object} taskData - Task data override
 * @returns {Object} Created task data
 */
const createTestTask = async (userId, taskData = {}) => {
  const defaultTask = {
    title: 'Test Task',
    description: 'This is a test task',
    priority: 'medium',
    status: 'pending',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
  };
  
  const task = { ...defaultTask, ...taskData };
  
  const query = `
    INSERT INTO tasks (user_id, title, description, priority, status, due_date)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, user_id, title, description, priority, status, due_date, created_at, updated_at
  `;
  
  const result = await pool.query(query, [
    userId,
    task.title,
    task.description,
    task.priority,
    task.status,
    task.dueDate
  ]);
  
  return result.rows[0];
};

/**
 * Generate JWT token for test user
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
const generateTestToken = (user) => {
  const { generateToken } = require('../../src/config/jwt');
  return generateToken({
    id: user.id,
    email: user.email
  });
};

module.exports = {
  setupTestDatabase,
  teardownTestDatabase,
  clearTestData,
  createTestUser,
  createTestTask,
  generateTestToken
};
