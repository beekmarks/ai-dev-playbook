const { verifyToken, extractTokenFromHeader } = require('../config/jwt');
const { ApiError } = require('../utils/errorHandler');
const logger = require('../utils/logger');

/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user information to request object
 */

/**
 * Middleware to authenticate JWT tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticateToken = (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      logger.logSecurity('Missing authentication token', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        url: req.url
      });
      
      throw new ApiError('Access token is required', 401, 'MISSING_TOKEN');
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Attach user information to request object
    req.user = {
      id: decoded.id,
      email: decoded.email
    };

    logger.logAuth('Token authenticated', {
      userId: decoded.id,
      email: decoded.email,
      ip: req.ip
    });

    next();
  } catch (error) {
    logger.logSecurity('Authentication failed', {
      error: error.message,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.url
    });

    if (error instanceof ApiError) {
      return next(error);
    }

    // Handle JWT-specific errors
    if (error.message.includes('Token') || error.message.includes('JWT')) {
      return next(new ApiError(error.message, 401, 'INVALID_TOKEN'));
    }

    return next(new ApiError('Authentication failed', 401, 'AUTHENTICATION_ERROR'));
  }
};

/**
 * Optional authentication middleware
 * Attaches user info if token is valid, but doesn't fail if no token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      // No token provided, continue without authentication
      return next();
    }

    // Verify token if provided
    const decoded = verifyToken(token);
    req.user = {
      id: decoded.id,
      email: decoded.email
    };

    logger.logAuth('Optional token authenticated', {
      userId: decoded.id,
      email: decoded.email,
      ip: req.ip
    });

    next();
  } catch (error) {
    // Log the error but don't fail the request
    logger.logSecurity('Optional authentication failed', {
      error: error.message,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.url
    });

    // Continue without authentication
    next();
  }
};

/**
 * Middleware to check if user owns the resource
 * Should be used after authenticateToken middleware
 * @param {string} paramName - Name of the parameter containing the user ID
 * @returns {Function} Express middleware function
 */
const requireOwnership = (paramName = 'userId') => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new ApiError('Authentication required', 401, 'AUTHENTICATION_REQUIRED');
      }

      const resourceUserId = parseInt(req.params[paramName]);
      const currentUserId = req.user.id;

      if (resourceUserId !== currentUserId) {
        logger.logSecurity('Unauthorized resource access attempt', {
          currentUserId,
          requestedUserId: resourceUserId,
          ip: req.ip,
          url: req.url
        });

        throw new ApiError('Access denied: insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS');
      }

      next();
    } catch (error) {
      if (error instanceof ApiError) {
        return next(error);
      }
      return next(new ApiError('Authorization check failed', 500, 'AUTHORIZATION_ERROR'));
    }
  };
};

/**
 * Middleware to validate task ownership
 * Checks if the authenticated user owns the specified task
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requireTaskOwnership = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError('Authentication required', 401, 'AUTHENTICATION_REQUIRED');
    }

    const taskId = parseInt(req.params.id);
    const userId = req.user.id;

    // This will be implemented when we create the task service
    // For now, we'll store the taskId for later validation
    req.taskId = taskId;
    req.userId = userId;

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError('Task ownership validation failed', 500, 'OWNERSHIP_VALIDATION_ERROR'));
  }
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireOwnership,
  requireTaskOwnership
};
