/**
 * Integration Tests for Tasks API
 * Tests complete task management workflows with authentication and database integration
 */

const request = require('supertest');
const { app } = require('../../src/app');
const { setupTestDatabase, teardownTestDatabase, clearTestData, createTestUser, generateTestToken } = require('../setup/testSetup');

describe('Tasks API Integration', () => {
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

  describe('POST /api/tasks', () => {
    const validTaskData = {
      title: 'Test Task',
      description: 'This is a test task',
      priority: 'high',
      status: 'pending',
      dueDate: '2025-12-31T23:59:59Z'
    };

    it('should create a new task successfully', async () => {
      const response = await request(server)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validTaskData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task created successfully');
      expect(response.body.data.task.title).toBe(validTaskData.title);
      expect(response.body.data.task.userId).toBe(testUser.id);
      expect(response.body.data.task).toHaveProperty('id');
      expect(response.body.data.task).toHaveProperty('createdAt');
    });

    it('should create task with minimal data', async () => {
      const minimalTask = { title: 'Minimal Task' };

      const response = await request(server)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(minimalTask)
        .expect(201);

      expect(response.body.data.task.title).toBe(minimalTask.title);
      expect(response.body.data.task.priority).toBe('medium');
      expect(response.body.data.task.status).toBe('pending');
    });

    it('should validate required fields', async () => {
      const response = await request(server)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should validate field constraints', async () => {
      const response = await request(server)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: '', // Invalid: empty title
          priority: 'invalid', // Invalid priority
          status: 'invalid' // Invalid status
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should require authentication', async () => {
      const response = await request(server)
        .post('/api/tasks')
        .send(validTaskData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('MISSING_TOKEN');
    });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      // Create test tasks
      const tasks = [
        { title: 'Task 1', priority: 'high', status: 'pending' },
        { title: 'Task 2', priority: 'medium', status: 'in-progress' },
        { title: 'Task 3', priority: 'low', status: 'completed' },
        { title: 'Task 4', priority: 'high', status: 'pending' }
      ];

      for (const task of tasks) {
        await request(server)
          .post('/api/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .send(task);
      }
    });

    it('should retrieve all user tasks', async () => {
      const response = await request(server)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tasks).toHaveLength(4);
      expect(response.body.data.pagination.total).toBe(4);
      expect(response.body.data.pagination.hasMore).toBe(false);
    });

    it('should filter tasks by status', async () => {
      const response = await request(server)
        .get('/api/tasks?status=pending')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.tasks).toHaveLength(2);
      expect(response.body.data.tasks.every(task => task.status === 'pending')).toBe(true);
    });

    it('should filter tasks by priority', async () => {
      const response = await request(server)
        .get('/api/tasks?priority=high')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.tasks).toHaveLength(2);
      expect(response.body.data.tasks.every(task => task.priority === 'high')).toBe(true);
    });

    it('should handle pagination', async () => {
      const response = await request(server)
        .get('/api/tasks?limit=2&offset=0')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.tasks).toHaveLength(2);
      expect(response.body.data.pagination.limit).toBe(2);
      expect(response.body.data.pagination.hasMore).toBe(true);
    });

    it('should validate query parameters', async () => {
      const response = await request(server)
        .get('/api/tasks?status=invalid&priority=invalid&limit=invalid')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should require authentication', async () => {
      const response = await request(server)
        .get('/api/tasks')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('MISSING_TOKEN');
    });

    it('should only return tasks owned by authenticated user', async () => {
      // Create another user with tasks
      const anotherUser = await createTestUser({ email: 'another@example.com' });
      const anotherToken = generateTestToken(anotherUser);

      await request(server)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${anotherToken}`)
        .send({ title: 'Another User Task' });

      // Original user should only see their tasks
      const response = await request(server)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.tasks).toHaveLength(4);
      expect(response.body.data.tasks.every(task => task.userId === testUser.id)).toBe(true);
    });
  });

  describe('GET /api/tasks/stats', () => {
    beforeEach(async () => {
      // Create tasks with different statuses and priorities
      const tasks = [
        { title: 'Task 1', priority: 'high', status: 'pending' },
        { title: 'Task 2', priority: 'medium', status: 'in-progress' },
        { title: 'Task 3', priority: 'low', status: 'completed' },
        { title: 'Task 4', priority: 'high', status: 'completed' },
        { title: 'Task 5', priority: 'medium', status: 'pending', dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Overdue
      ];

      for (const task of tasks) {
        await request(server)
          .post('/api/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .send(task);
      }
    });

    it('should return correct task statistics', async () => {
      const response = await request(server)
        .get('/api/tasks/stats')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.statistics.totalTasks).toBe(5);
      expect(response.body.data.statistics.pendingTasks).toBe(2);
      expect(response.body.data.statistics.inProgressTasks).toBe(1);
      expect(response.body.data.statistics.completedTasks).toBe(2);
      expect(response.body.data.statistics.highPriorityTasks).toBe(2);
      expect(response.body.data.statistics.overdueTasks).toBe(1);
    });

    it('should require authentication', async () => {
      const response = await request(server)
        .get('/api/tasks/stats')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('MISSING_TOKEN');
    });
  });

  describe('GET /api/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      const createResponse = await request(server)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Test Task for Retrieval' });

      taskId = createResponse.body.data.task.id;
    });

    it('should retrieve task by ID', async () => {
      const response = await request(server)
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.task.id).toBe(taskId);
      expect(response.body.data.task.userId).toBe(testUser.id);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(server)
        .get('/api/tasks/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('TASK_NOT_FOUND');
    });

    it('should not allow access to other users tasks', async () => {
      const anotherUser = await createTestUser({ email: 'another@example.com' });
      const anotherToken = generateTestToken(anotherUser);

      const response = await request(server)
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${anotherToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('TASK_NOT_FOUND');
    });

    it('should validate task ID parameter', async () => {
      const response = await request(server)
        .get('/api/tasks/invalid-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      const createResponse = await request(server)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Task to Update', priority: 'low', status: 'pending' });

      taskId = createResponse.body.data.task.id;
    });

    it('should update task successfully', async () => {
      const updateData = {
        title: 'Updated Task',
        priority: 'high',
        status: 'in-progress'
      };

      const response = await request(server)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.task.title).toBe(updateData.title);
      expect(response.body.data.task.priority).toBe(updateData.priority);
      expect(response.body.data.task.status).toBe(updateData.status);
    });

    it('should update partial task data', async () => {
      const updateData = { title: 'Only Title Updated' };

      const response = await request(server)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data.task.title).toBe(updateData.title);
      expect(response.body.data.task.priority).toBe('low'); // Unchanged
    });

    it('should validate update data', async () => {
      const response = await request(server)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: '', // Invalid
          priority: 'invalid', // Invalid
          status: 'invalid' // Invalid
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should not allow updating other users tasks', async () => {
      const anotherUser = await createTestUser({ email: 'another@example.com' });
      const anotherToken = generateTestToken(anotherUser);

      const response = await request(server)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${anotherToken}`)
        .send({ title: 'Unauthorized Update' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('TASK_NOT_FOUND');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      const createResponse = await request(server)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Task to Delete' });

      taskId = createResponse.body.data.task.id;
    });

    it('should delete task successfully', async () => {
      const response = await request(server)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task deleted successfully');

      // Verify task is deleted
      await request(server)
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should not allow deleting other users tasks', async () => {
      const anotherUser = await createTestUser({ email: 'another@example.com' });
      const anotherToken = generateTestToken(anotherUser);

      const response = await request(server)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${anotherToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('TASK_NOT_FOUND');
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(server)
        .delete('/api/tasks/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('TASK_NOT_FOUND');
    });
  });
});
