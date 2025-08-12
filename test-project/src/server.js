#!/usr/bin/env node

/**
 * Task Management API Server
 * Entry point for the application
 */

const { initializeApp } = require('./app');
const logger = require('./utils/logger');

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', {
    error: error.message,
    stack: error.stack
  });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', {
    reason: reason instanceof Error ? reason.message : reason,
    stack: reason instanceof Error ? reason.stack : undefined,
    promise: promise
  });
  process.exit(1);
});

// Initialize and start the application
initializeApp().catch((error) => {
  logger.error('Application initialization failed', {
    error: error.message,
    stack: error.stack
  });
  process.exit(1);
});
