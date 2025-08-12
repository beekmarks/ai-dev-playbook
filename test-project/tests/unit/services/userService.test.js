/**
 * Unit Tests for User Service
 * Tests user registration, authentication, and profile management
 */

const userService = require('../../../src/services/userService');
const { pool } = require('../../../src/config/database');
const { ApiError } = require('../../../src/utils/errorHandler');
const { setupTestDatabase, teardownTestDatabase, clearTestData } = require('../../setup/testSetup');

describe('UserService', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await clearTestData();
  });

  describe('createUser', () => {
    const validUserData = {
      email: 'test@example.com',
      password: 'TestPassword123!',
      firstName: 'John',
      lastName: 'Doe'
    };

    it('should create a new user successfully', async () => {
      const result = await userService.createUser(validUserData);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe(validUserData.email);
      expect(result.user.firstName).toBe(validUserData.firstName);
      expect(result.user.lastName).toBe(validUserData.lastName);
      expect(result.user).not.toHaveProperty('password');
      expect(typeof result.token).toBe('string');
    });

    it('should hash the password before storing', async () => {
      await userService.createUser(validUserData);

      const query = 'SELECT password_hash FROM users WHERE email = $1';
      const result = await pool.query(query, [validUserData.email]);
      
      expect(result.rows[0].password_hash).not.toBe(validUserData.password);
      expect(result.rows[0].password_hash).toMatch(/^\$2[aby]\$/);
    });

    it('should throw error for duplicate email', async () => {
      await userService.createUser(validUserData);

      await expect(userService.createUser(validUserData))
        .rejects
        .toThrow(ApiError);
      
      await expect(userService.createUser(validUserData))
        .rejects
        .toThrow('User with this email already exists');
    });

    it('should handle database errors gracefully', async () => {
      // Mock pool.query to simulate database error
      const originalQuery = pool.query;
      pool.query = jest.fn().mockRejectedValue(new Error('Database connection failed'));

      await expect(userService.createUser(validUserData))
        .rejects
        .toThrow(ApiError);

      pool.query = originalQuery;
    });
  });

  describe('authenticateUser', () => {
    const userData = {
      email: 'auth@example.com',
      password: 'AuthPassword123!',
      firstName: 'Auth',
      lastName: 'User'
    };

    beforeEach(async () => {
      await userService.createUser(userData);
    });

    it('should authenticate user with valid credentials', async () => {
      const result = await userService.authenticateUser({
        email: userData.email,
        password: userData.password
      });

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe(userData.email);
      expect(typeof result.token).toBe('string');
    });

    it('should throw error for non-existent email', async () => {
      await expect(userService.authenticateUser({
        email: 'nonexistent@example.com',
        password: userData.password
      })).rejects.toThrow('Invalid email or password');
    });

    it('should throw error for invalid password', async () => {
      await expect(userService.authenticateUser({
        email: userData.email,
        password: 'WrongPassword123!'
      })).rejects.toThrow('Invalid email or password');
    });

    it('should handle empty password', async () => {
      await expect(userService.authenticateUser({
        email: userData.email,
        password: ''
      })).rejects.toThrow('Invalid email or password');
    });
  });

  describe('getUserProfile', () => {
    let testUser;

    beforeEach(async () => {
      const userData = {
        email: 'profile@example.com',
        password: 'ProfilePassword123!',
        firstName: 'Profile',
        lastName: 'User'
      };
      const result = await userService.createUser(userData);
      testUser = result.user;
    });

    it('should retrieve user profile successfully', async () => {
      const profile = await userService.getUserProfile(testUser.id);

      expect(profile.id).toBe(testUser.id);
      expect(profile.email).toBe(testUser.email);
      expect(profile.firstName).toBe(testUser.firstName);
      expect(profile.lastName).toBe(testUser.lastName);
      expect(profile).toHaveProperty('createdAt');
      expect(profile).not.toHaveProperty('password');
    });

    it('should throw error for non-existent user', async () => {
      await expect(userService.getUserProfile(99999))
        .rejects
        .toThrow('User not found');
    });

    it('should handle invalid user ID', async () => {
      await expect(userService.getUserProfile('invalid'))
        .rejects
        .toThrow();
    });
  });

  describe('updateUserProfile', () => {
    let testUser;

    beforeEach(async () => {
      const userData = {
        email: 'update@example.com',
        password: 'UpdatePassword123!',
        firstName: 'Update',
        lastName: 'User'
      };
      const result = await userService.createUser(userData);
      testUser = result.user;
    });

    it('should update user profile successfully', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name'
      };

      const updatedProfile = await userService.updateUserProfile(testUser.id, updateData);

      expect(updatedProfile.firstName).toBe(updateData.firstName);
      expect(updatedProfile.lastName).toBe(updateData.lastName);
      expect(updatedProfile.email).toBe(testUser.email);
      expect(updatedProfile).toHaveProperty('updatedAt');
    });

    it('should update partial profile data', async () => {
      const updateData = { firstName: 'OnlyFirst' };

      const updatedProfile = await userService.updateUserProfile(testUser.id, updateData);

      expect(updatedProfile.firstName).toBe(updateData.firstName);
      expect(updatedProfile.lastName).toBe(testUser.lastName); // Unchanged
    });

    it('should return existing profile when no updates provided', async () => {
      const updatedProfile = await userService.updateUserProfile(testUser.id, {});

      expect(updatedProfile.firstName).toBe(testUser.firstName);
      expect(updatedProfile.lastName).toBe(testUser.lastName);
    });

    it('should throw error for non-existent user', async () => {
      await expect(userService.updateUserProfile(99999, { firstName: 'Test' }))
        .rejects
        .toThrow('User not found');
    });
  });

  describe('userExists', () => {
    let testUser;

    beforeEach(async () => {
      const userData = {
        email: 'exists@example.com',
        password: 'ExistsPassword123!',
        firstName: 'Exists',
        lastName: 'User'
      };
      const result = await userService.createUser(userData);
      testUser = result.user;
    });

    it('should return true for existing user', async () => {
      const exists = await userService.userExists(testUser.id);
      expect(exists).toBe(true);
    });

    it('should return false for non-existent user', async () => {
      const exists = await userService.userExists(99999);
      expect(exists).toBe(false);
    });

    it('should handle database errors gracefully', async () => {
      const originalQuery = pool.query;
      pool.query = jest.fn().mockRejectedValue(new Error('Database error'));

      const exists = await userService.userExists(testUser.id);
      expect(exists).toBe(false);

      pool.query = originalQuery;
    });
  });
});
