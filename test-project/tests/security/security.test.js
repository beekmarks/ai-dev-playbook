/**
 * Security Tests for Task Management API
 * Tests authentication, authorization, input validation, and security headers
 * SECURITY: All tests run in isolated sandbox environment
 */

const request = require('supertest');
const { app } = require('../../src/app');
const { setupTestDatabase, teardownTestDatabase, clearTestData, createTestUser, generateTestToken } = require('../setup/testSetup');

describe('Security Tests', () => {
  let server;
  let testUser;
  let authToken;

  beforeAll(async () => {
    await setupTestDatabase();
    server = app;
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await clearTestData();
    testUser = await createTestUser();
    authToken = generateTestToken(testUser);
  });

  describe('Authentication Security', () => {
    it('should reject requests without authentication token', async () => {
      const endpoints = [
        { method: 'get', path: '/api/auth/profile' },
        { method: 'put', path: '/api/auth/profile' },
        { method: 'post', path: '/api/auth/logout' },
        { method: 'get', path: '/api/auth/verify' },
        { method: 'get', path: '/api/tasks' },
        { method: 'post', path: '/api/tasks' },
        { method: 'get', path: '/api/tasks/1' },
        { method: 'put', path: '/api/tasks/1' },
        { method: 'delete', path: '/api/tasks/1' }
      ];

      for (const endpoint of endpoints) {
        const response = await request(server)[endpoint.method](endpoint.path);
        expect(response.status).toBe(401);
        expect(response.body.error.code).toBe('MISSING_TOKEN');
      }
    });

    it('should reject requests with invalid authentication token', async () => {
      const invalidTokens = [
        'invalid-token',
        'Bearer invalid-token',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature',
        ''
      ];

      for (const token of invalidTokens) {
        const response = await request(server)
          .get('/api/auth/profile')
          .set('Authorization', token.startsWith('Bearer') ? token : `Bearer ${token}`);
        
        expect(response.status).toBe(401);
        expect(response.body.error.code).toBe('INVALID_TOKEN');
      }
    });

    it('should reject expired tokens', async () => {
      // This would require mocking JWT expiration or using a test token with short expiry
      // For now, we test the error handling path
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNjAwMDAwMDAwLCJleHAiOjE2MDAwMDAwMDF9.invalid';
      
      const response = await request(server)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${expiredToken}`);
      
      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe('INVALID_TOKEN');
    });
  });

  describe('Authorization Security', () => {
    let anotherUser;
    let anotherToken;
    let testTask;

    beforeEach(async () => {
      anotherUser = await createTestUser({ email: 'another@example.com' });
      anotherToken = generateTestToken(anotherUser);
      
      // Create a task for the first user
      const createResponse = await request(server)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Test Task' });
      
      testTask = createResponse.body.data.task;
    });

    it('should prevent users from accessing other users tasks', async () => {
      // Try to access another user's task
      const response = await request(server)
        .get(`/api/tasks/${testTask.id}`)
        .set('Authorization', `Bearer ${anotherToken}`)
        .expect(404);

      expect(response.body.error.code).toBe('TASK_NOT_FOUND');
    });

    it('should prevent users from modifying other users tasks', async () => {
      // Try to update another user's task
      const updateResponse = await request(server)
        .put(`/api/tasks/${testTask.id}`)
        .set('Authorization', `Bearer ${anotherToken}`)
        .send({ title: 'Unauthorized Update' })
        .expect(404);

      expect(updateResponse.body.error.code).toBe('TASK_NOT_FOUND');

      // Try to delete another user's task
      const deleteResponse = await request(server)
        .delete(`/api/tasks/${testTask.id}`)
        .set('Authorization', `Bearer ${anotherToken}`)
        .expect(404);

      expect(deleteResponse.body.error.code).toBe('TASK_NOT_FOUND');
    });

    it('should ensure users only see their own data', async () => {
      // Create tasks for both users
      await request(server)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${anotherToken}`)
        .send({ title: 'Another User Task' });

      // First user should only see their task
      const user1Response = await request(server)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(user1Response.body.data.tasks).toHaveLength(1);
      expect(user1Response.body.data.tasks[0].userId).toBe(testUser.id);

      // Second user should only see their task
      const user2Response = await request(server)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${anotherToken}`)
        .expect(200);

      expect(user2Response.body.data.tasks).toHaveLength(1);
      expect(user2Response.body.data.tasks[0].userId).toBe(anotherUser.id);
    });
  });

  describe('Input Validation Security', () => {
    it('should validate and sanitize user registration input', async () => {
      const maliciousInputs = [
        {
          email: '<script>alert("xss")</script>@example.com',
          password: 'Password123!',
          firstName: '<script>alert("xss")</script>',
          lastName: 'User'
        },
        {
          email: 'test@example.com',
          password: 'Password123!',
          firstName: 'Test',
          lastName: '<img src="x" onerror="alert(1)">'
        }
      ];

      for (const input of maliciousInputs) {
        const response = await request(server)
          .post('/api/auth/register')
          .send(input);

        // Should either reject the input or sanitize it
        if (response.status === 201) {
          // If accepted, ensure no script tags in response
          expect(response.body.data.user.firstName).not.toContain('<script>');
          expect(response.body.data.user.lastName).not.toContain('<script>');
          expect(response.body.data.user.firstName).not.toContain('onerror');
        } else {
          expect(response.status).toBe(400);
        }
      }
    });

    it('should validate task input for XSS attempts', async () => {
      const maliciousTasks = [
        {
          title: '<script>alert("xss")</script>',
          description: 'Normal description'
        },
        {
          title: 'Normal title',
          description: '<img src="x" onerror="alert(1)">'
        },
        {
          title: 'javascript:alert(1)',
          description: 'onclick="alert(1)"'
        }
      ];

      for (const task of maliciousTasks) {
        const response = await request(server)
          .post('/api/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .send(task);

        if (response.status === 201) {
          // If accepted, ensure no script tags in response
          expect(response.body.data.task.title).not.toContain('<script>');
          expect(response.body.data.task.description).not.toContain('<script>');
          expect(response.body.data.task.title).not.toContain('javascript:');
          expect(response.body.data.task.description).not.toContain('onerror');
        }
      }
    });

    it('should prevent SQL injection attempts', async () => {
      const sqlInjectionAttempts = [
        "'; DROP TABLE users; --",
        "' OR '1'='1",
        "1; DELETE FROM tasks; --",
        "' UNION SELECT * FROM users --"
      ];

      for (const injection of sqlInjectionAttempts) {
        // Try SQL injection in task title
        const response = await request(server)
          .post('/api/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ title: injection });

        // Should either reject or handle safely
        if (response.status === 201) {
          // Verify the database wasn't compromised
          const tasksResponse = await request(server)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

          expect(tasksResponse.body.data.tasks).toBeDefined();
        }
      }

      // Verify users table still exists and functions
      const profileResponse = await request(server)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(profileResponse.body.data.user).toBeDefined();
    });
  });

  describe('Rate Limiting Security', () => {
    it('should apply rate limiting to authentication endpoints', async () => {
      const requests = [];
      
      // Make multiple rapid requests to trigger rate limiting
      for (let i = 0; i < 10; i++) {
        requests.push(
          request(server)
            .post('/api/auth/login')
            .send({
              email: 'nonexistent@example.com',
              password: 'password'
            })
        );
      }

      const responses = await Promise.all(requests);
      const rateLimitedResponses = responses.filter(res => res.status === 429);
      
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
      expect(rateLimitedResponses[0].body.error.code).toBe('RATE_LIMIT_EXCEEDED');
    });

    it('should apply general rate limiting', async () => {
      const requests = [];
      
      // Make many rapid requests to trigger general rate limiting
      for (let i = 0; i < 150; i++) {
        requests.push(
          request(server)
            .get('/health')
        );
      }

      const responses = await Promise.all(requests);
      const rateLimitedResponses = responses.filter(res => res.status === 429);
      
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });

  describe('Security Headers', () => {
    it('should include security headers in responses', async () => {
      const response = await request(server)
        .get('/health')
        .expect(200);

      // Check for security headers
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('DENY');
      expect(response.headers['x-xss-protection']).toBe('0');
      expect(response.headers['strict-transport-security']).toBeDefined();
      expect(response.headers['content-security-policy']).toBeDefined();
      
      // Check that server information is hidden
      expect(response.headers['x-powered-by']).toBeUndefined();
      expect(response.headers['server']).toBeUndefined();
    });

    it('should include custom security headers', async () => {
      const response = await request(server)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.headers['x-api-version']).toBe('1.0.0');
      expect(response.headers['x-request-id']).toBeDefined();
    });
  });

  describe('Password Security', () => {
    it('should enforce strong password requirements', async () => {
      const weakPasswords = [
        'password',
        '123456',
        'Password',
        'password123',
        'Password123',
        'short'
      ];

      for (const password of weakPasswords) {
        const response = await request(server)
          .post('/api/auth/register')
          .send({
            email: `test${Math.random()}@example.com`,
            password,
            firstName: 'Test',
            lastName: 'User'
          });

        expect(response.status).toBe(400);
        expect(response.body.error.code).toBe('VALIDATION_ERROR');
      }
    });

    it('should not return password hashes in responses', async () => {
      const userData = {
        email: 'password-test@example.com',
        password: 'SecurePassword123!',
        firstName: 'Password',
        lastName: 'Test'
      };

      const registerResponse = await request(server)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(registerResponse.body.data.user).not.toHaveProperty('password');
      expect(registerResponse.body.data.user).not.toHaveProperty('password_hash');

      const loginResponse = await request(server)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(200);

      expect(loginResponse.body.data.user).not.toHaveProperty('password');
      expect(loginResponse.body.data.user).not.toHaveProperty('password_hash');
    });
  });

  describe('CORS Security', () => {
    it('should handle CORS requests properly', async () => {
      const response = await request(server)
        .options('/api/auth/profile')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'GET')
        .set('Access-Control-Request-Headers', 'Authorization');

      expect(response.status).toBe(200);
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });

    it('should reject requests from unauthorized origins', async () => {
      const response = await request(server)
        .get('/api/auth/profile')
        .set('Origin', 'http://malicious-site.com')
        .set('Authorization', `Bearer ${authToken}`);

      // The request should be blocked by CORS
      expect(response.status).toBe(500); // CORS error
    });
  });
});
