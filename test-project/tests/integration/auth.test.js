/**
 * Integration Tests for Authentication API
 * Tests complete authentication workflows with database integration
 */

const request = require('supertest');
const { app } = require('../../src/app');
const { setupTestDatabase, teardownTestDatabase, clearTestData } = require('../setup/testSetup');

describe('Authentication API Integration', () => {
  let server;

  beforeAll(async () => {
    await setupTestDatabase();
    server = app;
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await clearTestData();
  });

  describe('POST /api/auth/register', () => {
    const validRegistrationData = {
      email: 'test@example.com',
      password: 'TestPassword123!',
      firstName: 'John',
      lastName: 'Doe'
    };

    it('should register a new user successfully', async () => {
      const response = await request(server)
        .post('/api/auth/register')
        .send(validRegistrationData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.email).toBe(validRegistrationData.email);
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should validate required fields', async () => {
      const response = await request(server)
        .post('/api/auth/register')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should validate email format', async () => {
      const response = await request(server)
        .post('/api/auth/register')
        .send({
          ...validRegistrationData,
          email: 'invalid-email'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should validate password strength', async () => {
      const response = await request(server)
        .post('/api/auth/register')
        .send({
          ...validRegistrationData,
          password: 'weak'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should prevent duplicate email registration', async () => {
      // First registration
      await request(server)
        .post('/api/auth/register')
        .send(validRegistrationData)
        .expect(201);

      // Second registration with same email
      const response = await request(server)
        .post('/api/auth/register')
        .send(validRegistrationData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('USER_EXISTS');
    });

    it('should apply rate limiting', async () => {
      // Make multiple rapid requests to trigger rate limiting
      const requests = Array(6).fill().map(() =>
        request(server)
          .post('/api/auth/register')
          .send({
            ...validRegistrationData,
            email: `test${Math.random()}@example.com`
          })
      );

      const responses = await Promise.all(requests);
      const rateLimitedResponse = responses.find(res => res.status === 429);
      
      expect(rateLimitedResponse).toBeDefined();
      expect(rateLimitedResponse.body.error.code).toBe('RATE_LIMIT_EXCEEDED');
    });
  });

  describe('POST /api/auth/login', () => {
    const userData = {
      email: 'login@example.com',
      password: 'LoginPassword123!',
      firstName: 'Login',
      lastName: 'User'
    };

    beforeEach(async () => {
      // Register user for login tests
      await request(server)
        .post('/api/auth/register')
        .send(userData);
    });

    it('should login with valid credentials', async () => {
      const response = await request(server)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.email).toBe(userData.email);
    });

    it('should reject invalid email', async () => {
      const response = await request(server)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: userData.password
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
    });

    it('should reject invalid password', async () => {
      const response = await request(server)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: 'WrongPassword123!'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
    });

    it('should validate input format', async () => {
      const response = await request(server)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: ''
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/auth/profile', () => {
    let authToken;
    let userData;

    beforeEach(async () => {
      userData = {
        email: 'profile@example.com',
        password: 'ProfilePassword123!',
        firstName: 'Profile',
        lastName: 'User'
      };

      const registerResponse = await request(server)
        .post('/api/auth/register')
        .send(userData);

      authToken = registerResponse.body.data.token;
    });

    it('should get user profile with valid token', async () => {
      const response = await request(server)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.firstName).toBe(userData.firstName);
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should reject request without token', async () => {
      const response = await request(server)
        .get('/api/auth/profile')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('MISSING_TOKEN');
    });

    it('should reject request with invalid token', async () => {
      const response = await request(server)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INVALID_TOKEN');
    });
  });

  describe('PUT /api/auth/profile', () => {
    let authToken;
    let userData;

    beforeEach(async () => {
      userData = {
        email: 'update@example.com',
        password: 'UpdatePassword123!',
        firstName: 'Update',
        lastName: 'User'
      };

      const registerResponse = await request(server)
        .post('/api/auth/register')
        .send(userData);

      authToken = registerResponse.body.data.token;
    });

    it('should update user profile successfully', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name'
      };

      const response = await request(server)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.firstName).toBe(updateData.firstName);
      expect(response.body.data.user.lastName).toBe(updateData.lastName);
      expect(response.body.data.user.email).toBe(userData.email);
    });

    it('should validate profile update data', async () => {
      const response = await request(server)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          firstName: '', // Invalid: empty string
          lastName: 'Valid'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should require authentication', async () => {
      const response = await request(server)
        .put('/api/auth/profile')
        .send({ firstName: 'Test' })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('MISSING_TOKEN');
    });
  });

  describe('GET /api/auth/verify', () => {
    let authToken;

    beforeEach(async () => {
      const userData = {
        email: 'verify@example.com',
        password: 'VerifyPassword123!',
        firstName: 'Verify',
        lastName: 'User'
      };

      const registerResponse = await request(server)
        .post('/api/auth/register')
        .send(userData);

      authToken = registerResponse.body.data.token;
    });

    it('should verify valid token', async () => {
      const response = await request(server)
        .get('/api/auth/verify')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Token is valid');
      expect(response.body.data).toHaveProperty('user');
    });

    it('should reject invalid token', async () => {
      const response = await request(server)
        .get('/api/auth/verify')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INVALID_TOKEN');
    });
  });

  describe('POST /api/auth/logout', () => {
    let authToken;

    beforeEach(async () => {
      const userData = {
        email: 'logout@example.com',
        password: 'LogoutPassword123!',
        firstName: 'Logout',
        lastName: 'User'
      };

      const registerResponse = await request(server)
        .post('/api/auth/register')
        .send(userData);

      authToken = registerResponse.body.data.token;
    });

    it('should logout successfully', async () => {
      const response = await request(server)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logout successful');
    });

    it('should require authentication', async () => {
      const response = await request(server)
        .post('/api/auth/logout')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('MISSING_TOKEN');
    });
  });
});
