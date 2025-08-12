/**
 * Performance and Load Tests for Task Management API
 * Tests API performance under various load conditions
 * SECURITY: All tests run in isolated sandbox environment
 */

const request = require('supertest');
const { app } = require('../../src/app');
const { setupTestDatabase, teardownTestDatabase, clearTestData, createTestUser, generateTestToken } = require('../setup/testSetup');

describe('Performance Tests', () => {
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

  describe('Response Time Tests', () => {
    it('should respond to health check within acceptable time', async () => {
      const startTime = Date.now();
      
      const response = await request(server)
        .get('/health')
        .expect(200);
      
      const responseTime = Date.now() - startTime;
      
      expect(responseTime).toBeLessThan(100); // Should respond within 100ms
      expect(response.body.success).toBe(true);
    });

    it('should handle authentication within acceptable time', async () => {
      const userData = {
        email: 'perf-test@example.com',
        password: 'PerfTest123!',
        firstName: 'Perf',
        lastName: 'Test'
      };

      const startTime = Date.now();
      
      const response = await request(server)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);
      
      const responseTime = Date.now() - startTime;
      
      expect(responseTime).toBeLessThan(1000); // Should complete within 1 second
      expect(response.body.success).toBe(true);
    });

    it('should handle task operations within acceptable time', async () => {
      const taskData = { title: 'Performance Test Task' };
      
      // Create task
      const createStart = Date.now();
      const createResponse = await request(server)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData)
        .expect(201);
      const createTime = Date.now() - createStart;
      
      expect(createTime).toBeLessThan(500);
      
      const taskId = createResponse.body.data.task.id;
      
      // Read task
      const readStart = Date.now();
      await request(server)
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      const readTime = Date.now() - readStart;
      
      expect(readTime).toBeLessThan(200);
      
      // Update task
      const updateStart = Date.now();
      await request(server)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'completed' })
        .expect(200);
      const updateTime = Date.now() - updateStart;
      
      expect(updateTime).toBeLessThan(300);
    });
  });

  describe('Concurrent Request Tests', () => {
    it('should handle multiple concurrent authentication requests', async () => {
      const concurrentUsers = 10;
      const requests = [];
      
      for (let i = 0; i < concurrentUsers; i++) {
        const userData = {
          email: `concurrent${i}@example.com`,
          password: 'Concurrent123!',
          firstName: 'Concurrent',
          lastName: `User${i}`
        };
        
        requests.push(
          request(server)
            .post('/api/auth/register')
            .send(userData)
        );
      }
      
      const startTime = Date.now();
      const responses = await Promise.all(requests);
      const totalTime = Date.now() - startTime;
      
      // All requests should succeed
      expect(responses.every(res => res.status === 201)).toBe(true);
      
      // Should complete within reasonable time
      expect(totalTime).toBeLessThan(5000); // 5 seconds for 10 concurrent registrations
    });

    it('should handle multiple concurrent task operations', async () => {
      const concurrentTasks = 20;
      const createRequests = [];
      
      // Create multiple tasks concurrently
      for (let i = 0; i < concurrentTasks; i++) {
        createRequests.push(
          request(server)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ title: `Concurrent Task ${i}` })
        );
      }
      
      const startTime = Date.now();
      const createResponses = await Promise.all(createRequests);
      const createTime = Date.now() - startTime;
      
      // All creates should succeed
      expect(createResponses.every(res => res.status === 201)).toBe(true);
      expect(createTime).toBeLessThan(3000); // Should complete within 3 seconds
      
      // Now read all tasks concurrently
      const taskIds = createResponses.map(res => res.body.data.task.id);
      const readRequests = taskIds.map(id =>
        request(server)
          .get(`/api/tasks/${id}`)
          .set('Authorization', `Bearer ${authToken}`)
      );
      
      const readStartTime = Date.now();
      const readResponses = await Promise.all(readRequests);
      const readTime = Date.now() - readStartTime;
      
      // All reads should succeed
      expect(readResponses.every(res => res.status === 200)).toBe(true);
      expect(readTime).toBeLessThan(2000); // Should complete within 2 seconds
    });
  });

  describe('Database Performance Tests', () => {
    it('should handle large task lists efficiently', async () => {
      // Create a large number of tasks
      const taskCount = 100;
      const createPromises = [];
      
      for (let i = 0; i < taskCount; i++) {
        createPromises.push(
          request(server)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
              title: `Task ${i}`,
              priority: i % 3 === 0 ? 'high' : i % 3 === 1 ? 'medium' : 'low',
              status: i % 3 === 0 ? 'pending' : i % 3 === 1 ? 'in-progress' : 'completed'
            })
        );
      }
      
      await Promise.all(createPromises);
      
      // Test pagination performance
      const startTime = Date.now();
      const response = await request(server)
        .get('/api/tasks?limit=50&offset=0')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      const queryTime = Date.now() - startTime;
      
      expect(queryTime).toBeLessThan(500); // Should query within 500ms
      expect(response.body.data.tasks).toHaveLength(50);
      expect(response.body.data.pagination.total).toBe(taskCount);
      
      // Test filtering performance
      const filterStart = Date.now();
      const filterResponse = await request(server)
        .get('/api/tasks?status=pending&priority=high')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      const filterTime = Date.now() - filterStart;
      
      expect(filterTime).toBeLessThan(300); // Should filter within 300ms
      expect(filterResponse.body.data.tasks.every(task => 
        task.status === 'pending' && task.priority === 'high'
      )).toBe(true);
    });

    it('should handle statistics calculation efficiently', async () => {
      // Create tasks with various statuses
      const taskPromises = [];
      const statuses = ['pending', 'in-progress', 'completed'];
      const priorities = ['low', 'medium', 'high'];
      
      for (let i = 0; i < 50; i++) {
        taskPromises.push(
          request(server)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
              title: `Stats Task ${i}`,
              status: statuses[i % 3],
              priority: priorities[i % 3]
            })
        );
      }
      
      await Promise.all(taskPromises);
      
      // Test statistics performance
      const startTime = Date.now();
      const response = await request(server)
        .get('/api/tasks/stats')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      const statsTime = Date.now() - startTime;
      
      expect(statsTime).toBeLessThan(200); // Should calculate stats within 200ms
      expect(response.body.data.statistics.totalTasks).toBe(50);
      expect(response.body.data.statistics.pendingTasks).toBeGreaterThan(0);
      expect(response.body.data.statistics.inProgressTasks).toBeGreaterThan(0);
      expect(response.body.data.statistics.completedTasks).toBeGreaterThan(0);
    });
  });

  describe('Memory Usage Tests', () => {
    it('should handle large payloads without memory issues', async () => {
      // Test with large task description
      const largeDescription = 'A'.repeat(1900); // Near the 2000 char limit
      
      const response = await request(server)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Large Payload Test',
          description: largeDescription
        })
        .expect(201);
      
      expect(response.body.data.task.description).toBe(largeDescription);
    });

    it('should handle multiple large requests', async () => {
      const requests = [];
      
      for (let i = 0; i < 10; i++) {
        const largeDescription = `Large description ${i} `.repeat(100);
        
        requests.push(
          request(server)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
              title: `Large Task ${i}`,
              description: largeDescription
            })
        );
      }
      
      const responses = await Promise.all(requests);
      
      expect(responses.every(res => res.status === 201)).toBe(true);
      
      // Verify all tasks were created
      const allTasksResponse = await request(server)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(allTasksResponse.body.data.tasks).toHaveLength(10);
    });
  });

  describe('Rate Limiting Performance', () => {
    it('should maintain performance under rate limiting', async () => {
      const requests = [];
      
      // Make requests up to but not exceeding rate limit
      for (let i = 0; i < 50; i++) {
        requests.push(
          request(server)
            .get('/health')
        );
      }
      
      const startTime = Date.now();
      const responses = await Promise.all(requests);
      const totalTime = Date.now() - startTime;
      
      // Most requests should succeed (some might be rate limited)
      const successfulRequests = responses.filter(res => res.status === 200);
      expect(successfulRequests.length).toBeGreaterThan(40);
      
      // Should complete within reasonable time
      expect(totalTime).toBeLessThan(2000);
    });
  });
});
