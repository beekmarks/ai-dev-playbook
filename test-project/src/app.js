const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

// Import middleware
const { 
  corsOptions, 
  generalLimiter, 
  helmetConfig, 
  requestLogger, 
  securityHeaders, 
  sanitizeInput 
} = require('./middleware/security');
const { errorHandler, notFoundHandler } = require('./utils/errorHandler');
const logger = require('./utils/logger');

// Import routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

// Import database
const { testConnection } = require('./config/database');

/**
 * Express Application Setup
 * Configures middleware, routes, and error handling
 */

const app = express();

// Trust proxy for accurate IP addresses (important for rate limiting)
app.set('trust proxy', 1);

// Security middleware
if (process.env.HELMET_ENABLED !== 'false') {
  app.use(helmet(helmetConfig));
}
app.use(cors(corsOptions));
app.use(securityHeaders);

// Rate limiting
app.use(generalLimiter);

// Request parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization
app.use(sanitizeInput);

// Request logging
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Task Management API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Task Management API v1.0.0',
    documentation: {
      authentication: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile',
        updateProfile: 'PUT /api/auth/profile',
        logout: 'POST /api/auth/logout',
        verify: 'GET /api/auth/verify'
      },
      tasks: {
        create: 'POST /api/tasks',
        getAll: 'GET /api/tasks',
        getById: 'GET /api/tasks/:id',
        update: 'PUT /api/tasks/:id',
        delete: 'DELETE /api/tasks/:id',
        statistics: 'GET /api/tasks/stats'
      }
    },
    features: [
      'JWT Authentication',
      'Rate Limiting',
      'Input Validation',
      'Error Handling',
      'Security Headers',
      'Request Logging',
      'CORS Protection'
    ]
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// 404 handler for undefined routes
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

/**
 * Initialize database connection and start server
 */
const initializeApp = async () => {
  try {
    // Test database connection
    await testConnection();
    logger.info('Database connection established');

    // Start server
    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => {
      logger.info(`Task Management API server started`, {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
      });
    });

    // Graceful shutdown handling
    const gracefulShutdown = async (signal) => {
      logger.info(`Received ${signal}, starting graceful shutdown`);
      
      server.close(async () => {
        logger.info('HTTP server closed');
        
        try {
          const { closePool } = require('./config/database');
          await closePool();
          logger.info('Database connections closed');
          process.exit(0);
        } catch (error) {
          logger.error('Error during graceful shutdown', { error: error.message });
          process.exit(1);
        }
      });

      // Force close after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    return server;

  } catch (error) {
    logger.error('Failed to initialize application', {
      error: error.message,
      stack: error.stack
    });
    process.exit(1);
  }
};

// Export app for testing
module.exports = { app, initializeApp };
