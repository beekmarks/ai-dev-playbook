const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
const { generateToken } = require('../config/jwt');
const { ApiError } = require('../utils/errorHandler');
const logger = require('../utils/logger');

/**
 * User Service
 * Handles user-related business logic and database operations
 */

/**
 * Create a new user account
 * @param {Object} userData - User registration data
 * @returns {Object} Created user data with token
 */
const createUser = async (userData) => {
  const { email, password, firstName, lastName } = userData;
  
  try {
    // Check if user already exists
    const existingUserQuery = 'SELECT id FROM users WHERE email = $1';
    const existingUser = await pool.query(existingUserQuery, [email]);
    
    if (existingUser.rows.length > 0) {
      logger.logAuth('Registration attempt with existing email', { email });
      throw new ApiError('User with this email already exists', 409, 'USER_EXISTS');
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const insertUserQuery = `
      INSERT INTO users (email, password_hash, first_name, last_name)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, first_name, last_name, created_at
    `;
    
    const result = await pool.query(insertUserQuery, [
      email,
      passwordHash,
      firstName,
      lastName
    ]);

    const newUser = result.rows[0];

    // Generate JWT token
    const token = generateToken({
      id: newUser.id,
      email: newUser.email
    });

    logger.logAuth('User registered successfully', {
      userId: newUser.id,
      email: newUser.email
    });

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        createdAt: newUser.created_at
      },
      token
    };

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    logger.error('User creation failed', {
      error: error.message,
      email
    });
    
    throw new ApiError('Failed to create user account', 500, 'USER_CREATION_FAILED');
  }
};

/**
 * Authenticate user login
 * @param {Object} loginData - User login credentials
 * @returns {Object} User data with token
 */
const authenticateUser = async (loginData) => {
  const { email, password } = loginData;
  
  try {
    // Find user by email
    const userQuery = `
      SELECT id, email, password_hash, first_name, last_name, created_at
      FROM users 
      WHERE email = $1
    `;
    
    const result = await pool.query(userQuery, [email]);
    
    if (result.rows.length === 0) {
      logger.logAuth('Login attempt with non-existent email', { email });
      throw new ApiError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const user = result.rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      logger.logAuth('Login attempt with invalid password', {
        userId: user.id,
        email: user.email
      });
      throw new ApiError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email
    });

    logger.logAuth('User authenticated successfully', {
      userId: user.id,
      email: user.email
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        createdAt: user.created_at
      },
      token
    };

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    logger.error('User authentication failed', {
      error: error.message,
      email
    });
    
    throw new ApiError('Authentication failed', 500, 'AUTHENTICATION_FAILED');
  }
};

/**
 * Get user profile by ID
 * @param {number} userId - User ID
 * @returns {Object} User profile data
 */
const getUserProfile = async (userId) => {
  try {
    const userQuery = `
      SELECT id, email, first_name, last_name, created_at, updated_at
      FROM users 
      WHERE id = $1
    `;
    
    const result = await pool.query(userQuery, [userId]);
    
    if (result.rows.length === 0) {
      throw new ApiError('User not found', 404, 'USER_NOT_FOUND');
    }

    const user = result.rows[0];

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    logger.error('Failed to get user profile', {
      error: error.message,
      userId
    });
    
    throw new ApiError('Failed to retrieve user profile', 500, 'PROFILE_RETRIEVAL_FAILED');
  }
};

/**
 * Update user profile
 * @param {number} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Object} Updated user profile
 */
const updateUserProfile = async (userId, updateData) => {
  const { firstName, lastName } = updateData;
  
  try {
    // Check if user exists
    const existingUser = await getUserProfile(userId);
    
    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (firstName !== undefined) {
      updates.push(`first_name = $${paramCount++}`);
      values.push(firstName);
    }

    if (lastName !== undefined) {
      updates.push(`last_name = $${paramCount++}`);
      values.push(lastName);
    }

    if (updates.length === 0) {
      return existingUser; // No updates needed
    }

    // Add updated_at timestamp
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(userId); // Add userId as the last parameter

    const updateQuery = `
      UPDATE users 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, email, first_name, last_name, created_at, updated_at
    `;

    const result = await pool.query(updateQuery, values);
    const updatedUser = result.rows[0];

    logger.info('User profile updated', {
      userId: updatedUser.id,
      updatedFields: Object.keys(updateData)
    });

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
      createdAt: updatedUser.created_at,
      updatedAt: updatedUser.updated_at
    };

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    logger.error('Failed to update user profile', {
      error: error.message,
      userId,
      updateData
    });
    
    throw new ApiError('Failed to update user profile', 500, 'PROFILE_UPDATE_FAILED');
  }
};

/**
 * Check if user exists by ID
 * @param {number} userId - User ID
 * @returns {boolean} True if user exists
 */
const userExists = async (userId) => {
  try {
    const query = 'SELECT 1 FROM users WHERE id = $1';
    const result = await pool.query(query, [userId]);
    return result.rows.length > 0;
  } catch (error) {
    logger.error('Failed to check user existence', {
      error: error.message,
      userId
    });
    return false;
  }
};

module.exports = {
  createUser,
  authenticateUser,
  getUserProfile,
  updateUserProfile,
  userExists
};
