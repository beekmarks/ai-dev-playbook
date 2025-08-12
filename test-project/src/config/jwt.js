const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * JWT Configuration and Utilities
 * Implements secure JWT token generation and verification
 */

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Validate JWT secret on startup
if (!JWT_SECRET || JWT_SECRET === 'your-super-secure-jwt-secret-key-change-this-in-production') {
  console.error('❌ JWT_SECRET must be set to a secure value in production');
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

/**
 * Generate JWT token for authenticated user
 * @param {Object} payload - User data to encode in token
 * @returns {string} JWT token
 */
const generateToken = (payload) => {
  try {
    // Remove sensitive data from payload
    const tokenPayload = {
      id: payload.id,
      email: payload.email,
      // Don't include password or other sensitive data
    };

    return jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'task-management-api',
      audience: 'task-management-client'
    });
  } catch (error) {
    console.error('Error generating JWT token:', error);
    throw new Error('Token generation failed');
  }
};

/**
 * Verify and decode JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'task-management-api',
      audience: 'task-management-client'
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else {
      throw new Error('Token verification failed');
    }
  }
};

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} JWT token or null if not found
 */
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) {
    return null;
  }

  // Expected format: "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
};

module.exports = {
  generateToken,
  verifyToken,
  extractTokenFromHeader
};
