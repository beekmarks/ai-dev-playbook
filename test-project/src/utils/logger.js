/**
 * Logging Utility
 * Provides structured logging with different levels and request tracking
 */

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const CURRENT_LOG_LEVEL = LOG_LEVELS[LOG_LEVEL.toUpperCase()] || LOG_LEVELS.INFO;

/**
 * Format log message with timestamp and level
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} meta - Additional metadata
 * @returns {string} Formatted log message
 */
const formatMessage = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level: level.toUpperCase(),
    message,
    ...meta
  };
  
  return JSON.stringify(logEntry);
};

/**
 * Log error messages
 * @param {string} message - Error message
 * @param {Object} meta - Additional metadata (error object, request info, etc.)
 */
const error = (message, meta = {}) => {
  if (CURRENT_LOG_LEVEL >= LOG_LEVELS.ERROR) {
    console.error(formatMessage('error', message, meta));
  }
};

/**
 * Log warning messages
 * @param {string} message - Warning message
 * @param {Object} meta - Additional metadata
 */
const warn = (message, meta = {}) => {
  if (CURRENT_LOG_LEVEL >= LOG_LEVELS.WARN) {
    console.warn(formatMessage('warn', message, meta));
  }
};

/**
 * Log info messages
 * @param {string} message - Info message
 * @param {Object} meta - Additional metadata
 */
const info = (message, meta = {}) => {
  if (CURRENT_LOG_LEVEL >= LOG_LEVELS.INFO) {
    console.log(formatMessage('info', message, meta));
  }
};

/**
 * Log debug messages
 * @param {string} message - Debug message
 * @param {Object} meta - Additional metadata
 */
const debug = (message, meta = {}) => {
  if (CURRENT_LOG_LEVEL >= LOG_LEVELS.DEBUG) {
    console.log(formatMessage('debug', message, meta));
  }
};

/**
 * Log HTTP request information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {number} duration - Request duration in milliseconds
 */
const logRequest = (req, res, duration) => {
  const logData = {
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    duration: `${duration}ms`,
    userAgent: req.get('User-Agent'),
    ip: req.ip || req.connection.remoteAddress,
    userId: req.user ? req.user.id : null
  };

  if (res.statusCode >= 400) {
    error('HTTP Request Error', logData);
  } else {
    info('HTTP Request', logData);
  }
};

/**
 * Log authentication events
 * @param {string} event - Authentication event type
 * @param {Object} details - Event details
 */
const logAuth = (event, details = {}) => {
  info(`Authentication Event: ${event}`, {
    event,
    ...details,
    timestamp: new Date().toISOString()
  });
};

/**
 * Log security events
 * @param {string} event - Security event type
 * @param {Object} details - Event details
 */
const logSecurity = (event, details = {}) => {
  warn(`Security Event: ${event}`, {
    event,
    ...details,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  error,
  warn,
  info,
  debug,
  logRequest,
  logAuth,
  logSecurity
};
