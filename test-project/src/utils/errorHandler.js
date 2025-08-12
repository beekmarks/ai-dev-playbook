const logger = require('./logger');

/**
 * Error Handler Utility
 * Provides centralized error handling with consistent error responses
 */

/**
 * Custom API Error class
 */
class ApiError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Create standardized error response format
 * @param {string} code - Error code
 * @param {string} message - Error message
 * @param {string} details - Additional error details
 * @returns {Object} Standardized error response
 */
const createErrorResponse = (code, message, details = null) => {
  const errorResponse = {
    success: false,
    error: {
      code,
      message
    }
  };

  if (details) {
    errorResponse.error.details = details;
  }

  return errorResponse;
};

/**
 * Handle validation errors from Joi
 * @param {Object} error - Joi validation error
 * @returns {Object} Formatted validation error response
 */
const handleValidationError = (error) => {
  const details = error.details.map(detail => ({
    field: detail.path.join('.'),
    message: detail.message,
    value: detail.context.value
  }));

  return createErrorResponse(
    'VALIDATION_ERROR',
    'Input validation failed',
    details
  );
};

/**
 * Handle database errors
 * @param {Object} error - Database error
 * @returns {Object} Formatted database error response
 */
const handleDatabaseError = (error) => {
  logger.error('Database error', { error: error.message, stack: error.stack });

  // Handle specific PostgreSQL errors
  switch (error.code) {
    case '23505': // Unique violation
      return createErrorResponse(
        'DUPLICATE_ENTRY',
        'Resource already exists',
        'A record with this information already exists'
      );
    case '23503': // Foreign key violation
      return createErrorResponse(
        'INVALID_REFERENCE',
        'Referenced resource does not exist'
      );
    case '23502': // Not null violation
      return createErrorResponse(
        'MISSING_REQUIRED_FIELD',
        'Required field is missing'
      );
    default:
      return createErrorResponse(
        'DATABASE_ERROR',
        'Database operation failed'
      );
  }
};

/**
 * Handle JWT errors
 * @param {Object} error - JWT error
 * @returns {Object} Formatted JWT error response
 */
const handleJWTError = (error) => {
  logger.logSecurity('JWT Error', { error: error.message });

  if (error.message === 'Token has expired') {
    return createErrorResponse(
      'TOKEN_EXPIRED',
      'Authentication token has expired'
    );
  } else if (error.message === 'Invalid token') {
    return createErrorResponse(
      'INVALID_TOKEN',
      'Authentication token is invalid'
    );
  } else {
    return createErrorResponse(
      'AUTHENTICATION_ERROR',
      'Authentication failed'
    );
  }
};

/**
 * Express error handling middleware
 * @param {Object} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error details
  logger.error('API Error', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user ? req.user.id : null
  });

  let response;

  // Handle different types of errors
  if (err.name === 'ValidationError') {
    response = handleValidationError(err);
    return res.status(400).json(response);
  }

  if (err.code && err.code.startsWith('23')) {
    response = handleDatabaseError(err);
    return res.status(400).json(response);
  }

  if (err.message && (err.message.includes('Token') || err.message.includes('JWT'))) {
    response = handleJWTError(err);
    return res.status(401).json(response);
  }

  // Handle custom API errors
  if (err instanceof ApiError) {
    response = createErrorResponse(err.code, err.message);
    return res.status(err.statusCode).json(response);
  }

  // Handle specific HTTP errors
  if (err.statusCode) {
    response = createErrorResponse(
      'HTTP_ERROR',
      err.message || 'HTTP Error'
    );
    return res.status(err.statusCode).json(response);
  }

  // Default server error
  response = createErrorResponse(
    'INTERNAL_ERROR',
    'An unexpected error occurred'
  );
  
  res.status(500).json(response);
};

/**
 * Handle async route errors
 * @param {Function} fn - Async route handler
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Handle 404 errors
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const notFoundHandler = (req, res) => {
  const response = createErrorResponse(
    'NOT_FOUND',
    `Route ${req.originalUrl} not found`
  );
  
  logger.warn('Route not found', {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  res.status(404).json(response);
};

module.exports = {
  ApiError,
  createErrorResponse,
  handleValidationError,
  handleDatabaseError,
  handleJWTError,
  errorHandler,
  asyncHandler,
  notFoundHandler
};
