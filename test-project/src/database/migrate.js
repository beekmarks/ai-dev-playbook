const fs = require('fs').promises;
const path = require('path');
const { pool } = require('../config/database');
const logger = require('../utils/logger');

/**
 * Database Migration Utility
 * Handles running SQL migration files in order
 */

/**
 * Create migrations tracking table if it doesn't exist
 */
const createMigrationsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  await pool.query(createTableQuery);
  logger.info('Migrations table ready');
};

/**
 * Get list of executed migrations
 * @returns {Array} List of executed migration filenames
 */
const getExecutedMigrations = async () => {
  const query = 'SELECT filename FROM migrations ORDER BY id';
  const result = await pool.query(query);
  return result.rows.map(row => row.filename);
};

/**
 * Mark migration as executed
 * @param {string} filename - Migration filename
 */
const markMigrationExecuted = async (filename) => {
  const query = 'INSERT INTO migrations (filename) VALUES ($1)';
  await pool.query(query, [filename]);
};

/**
 * Read and execute SQL file
 * @param {string} filePath - Path to SQL file
 */
const executeSQLFile = async (filePath) => {
  const sql = await fs.readFile(filePath, 'utf8');
  
  // Split by semicolons and execute each statement
  const statements = sql
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
  
  for (const statement of statements) {
    if (statement.trim()) {
      await pool.query(statement);
    }
  }
};

/**
 * Run database migrations
 */
const runMigrations = async () => {
  try {
    logger.info('Starting database migrations');
    
    // Ensure migrations table exists
    await createMigrationsTable();
    
    // Get migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = await fs.readdir(migrationsDir);
    const sqlFiles = migrationFiles
      .filter(file => file.endsWith('.sql'))
      .sort(); // Ensure proper order
    
    // Get already executed migrations
    const executedMigrations = await getExecutedMigrations();
    
    // Run pending migrations
    for (const filename of sqlFiles) {
      if (!executedMigrations.includes(filename)) {
        logger.info(`Running migration: ${filename}`);
        
        const filePath = path.join(migrationsDir, filename);
        await executeSQLFile(filePath);
        await markMigrationExecuted(filename);
        
        logger.info(`Migration completed: ${filename}`);
      } else {
        logger.debug(`Migration already executed: ${filename}`);
      }
    }
    
    logger.info('All migrations completed successfully');
    
  } catch (error) {
    logger.error('Migration failed', {
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
};

/**
 * Seed database with test data
 */
const seedDatabase = async () => {
  try {
    logger.info('Starting database seeding');
    
    const seedsDir = path.join(__dirname, 'seeds');
    const seedFiles = await fs.readdir(seedsDir);
    const sqlFiles = seedFiles
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    for (const filename of sqlFiles) {
      logger.info(`Running seed: ${filename}`);
      
      const filePath = path.join(seedsDir, filename);
      await executeSQLFile(filePath);
      
      logger.info(`Seed completed: ${filename}`);
    }
    
    logger.info('Database seeding completed successfully');
    
  } catch (error) {
    logger.error('Database seeding failed', {
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
};

module.exports = {
  runMigrations,
  seedDatabase
};
