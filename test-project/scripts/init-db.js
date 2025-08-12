#!/usr/bin/env node

/**
 * Database Initialization Script
 * Runs migrations and optionally seeds the database
 */

const { runMigrations, seedDatabase } = require('../src/database/migrate');
const { testConnection, closePool } = require('../src/config/database');
const logger = require('../src/utils/logger');

const initializeDatabase = async () => {
  try {
    logger.info('Starting database initialization');
    
    // Test database connection
    await testConnection();
    
    // Run migrations
    await runMigrations();
    
    // Seed database if requested
    const shouldSeed = process.argv.includes('--seed') || process.env.SEED_DATABASE === 'true';
    if (shouldSeed) {
      await seedDatabase();
    }
    
    logger.info('Database initialization completed successfully');
    
  } catch (error) {
    logger.error('Database initialization failed', {
      error: error.message,
      stack: error.stack
    });
    process.exit(1);
  } finally {
    await closePool();
  }
};

// Run if called directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };
