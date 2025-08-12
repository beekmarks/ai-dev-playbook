/**
 * End-to-End Tests for Complete User Workflows
 * Tests complete user journeys from registration to task management
 * SECURITY: All tests run in isolated sandbox environment
 */

const request = require('supertest');
const { app } = require('../../src/app');
const { setupTestDatabase, teardownTestDatabase, clearTestData } = require('../setup/testSetup');

describe('E2E User Workflows', () => {
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

  describe('Complete User Journey: Registration to Task Management', () => {
    const userData = {
      email: 'workflow@example.com',
      password: 'WorkflowPassword123!',
      firstName: 'Workflow',
      lastName: 'User'
    };

    it('should complete full user workflow successfully', async () => {
      // Step 1: User Registration
      const registerResponse = await request(server)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(registerResponse.body.success).toBe(true);
      const { token, user } = registerResponse.body.data;
      expect(token).toBeDefined();
      expect(user.email).toBe(userData.email);

      // Step 2: Verify Token
      const verifyResponse = await request(server)
        .get('/api/auth/verify')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(verifyResponse.body.success).toBe(true);

      // Step 3: Get Initial Profile
      const profileResponse = await request(server)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(profileResponse.body.data.user.email).toBe(userData.email);

      // Step 4: Update Profile
      const updateProfileResponse = await request(server)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'Updated',
          lastName: 'Profile'
        })
        .expect(200);

      expect(updateProfileResponse.body.data.user.firstName).toBe('Updated');

      // Step 5: Create Multiple Tasks
      const tasks = [
        { title: 'High Priority Task', priority: 'high', status: 'pending' },
        { title: 'Medium Priority Task', priority: 'medium', status: 'in-progress' },
        { title: 'Low Priority Task', priority: 'low', status: 'completed' }
      ];

      const createdTasks = [];
      for (const task of tasks) {
        const createResponse = await request(server)
          .post('/api/tasks')
          .set('Authorization', `Bearer ${token}`)
          .send(task)
          .expect(201);

        createdTasks.push(createResponse.body.data.task);
      }

      expect(createdTasks).toHaveLength(3);

      // Step 6: Get All Tasks
      const allTasksResponse = await request(server)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(allTasksResponse.body.data.tasks).toHaveLength(3);
      expect(allTasksResponse.body.data.pagination.total).toBe(3);

      // Step 7: Filter Tasks by Status
      const pendingTasksResponse = await request(server)
        .get('/api/tasks?status=pending')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(pendingTasksResponse.body.data.tasks).toHaveLength(1);
      expect(pendingTasksResponse.body.data.tasks[0].status).toBe('pending');

      // Step 8: Get Task Statistics
      const statsResponse = await request(server)
        .get('/api/tasks/stats')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(statsResponse.body.data.statistics.totalTasks).toBe(3);
      expect(statsResponse.body.data.statistics.pendingTasks).toBe(1);
      expect(statsResponse.body.data.statistics.inProgressTasks).toBe(1);
      expect(statsResponse.body.data.statistics.completedTasks).toBe(1);

      // Step 9: Update a Task
      const taskToUpdate = createdTasks[0];
      const updateTaskResponse = await request(server)
        .put(`/api/tasks/${taskToUpdate.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: 'completed',
          description: 'Task completed successfully'
        })
        .expect(200);

      expect(updateTaskResponse.body.data.task.status).toBe('completed');
      expect(updateTaskResponse.body.data.task.description).toBe('Task completed successfully');

      // Step 10: Get Individual Task
      const individualTaskResponse = await request(server)
        .get(`/api/tasks/${taskToUpdate.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(individualTaskResponse.body.data.task.status).toBe('completed');

      // Step 11: Delete a Task
      const taskToDelete = createdTasks[1];
      await request(server)
        .delete(`/api/tasks/${taskToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      // Step 12: Verify Task Deletion
      await request(server)
        .get(`/api/tasks/${taskToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      // Step 13: Final Task Count
      const finalTasksResponse = await request(server)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(finalTasksResponse.body.data.tasks).toHaveLength(2);

      // Step 14: Logout
      const logoutResponse = await request(server)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(logoutResponse.body.success).toBe(true);
    });
  });

  describe('User Login and Task Management Workflow', () => {
    const userData = {
      email: 'login-workflow@example.com',
      password: 'LoginWorkflow123!',
      firstName: 'Login',
      lastName: 'Workflow'
    };

    it('should handle login workflow with existing user', async () => {
      // Step 1: Register User
      await request(server)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Step 2: Login with Credentials
      const loginResponse = await request(server)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(200);

      const { token } = loginResponse.body.data;
      expect(token).toBeDefined();

      // Step 3: Create Tasks After Login
      const taskData = {
        title: 'Post-Login Task',
        description: 'Created after user login',
        priority: 'medium'
      };

      const createTaskResponse = await request(server)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(taskData)
        .expect(201);

      expect(createTaskResponse.body.data.task.title).toBe(taskData.title);

      // Step 4: Verify Task Ownership
      const tasksResponse = await request(server)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(tasksResponse.body.data.tasks).toHaveLength(1);
      expect(tasksResponse.body.data.tasks[0].userId).toBe(loginResponse.body.data.user.id);
    });
  });

  describe('Multi-User Isolation Workflow', () => {
    const user1Data = {
      email: 'user1@example.com',
      password: 'User1Password123!',
      firstName: 'User',
      lastName: 'One'
    };

    const user2Data = {
      email: 'user2@example.com',
      password: 'User2Password123!',
      firstName: 'User',
      lastName: 'Two'
    };

    it('should maintain proper user isolation', async () => {
      // Step 1: Register Both Users
      const user1RegisterResponse = await request(server)
        .post('/api/auth/register')
        .send(user1Data)
        .expect(201);

      const user2RegisterResponse = await request(server)
        .post('/api/auth/register')
        .send(user2Data)
        .expect(201);

      const user1Token = user1RegisterResponse.body.data.token;
      const user2Token = user2RegisterResponse.body.data.token;

      // Step 2: User 1 Creates Tasks
      await request(server)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ title: 'User 1 Task 1' })
        .expect(201);

      await request(server)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ title: 'User 1 Task 2' })
        .expect(201);

      // Step 3: User 2 Creates Tasks
      await request(server)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${user2Token}`)
        .send({ title: 'User 2 Task 1' })
        .expect(201);

      // Step 4: Verify User 1 Only Sees Their Tasks
      const user1TasksResponse = await request(server)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(200);

      expect(user1TasksResponse.body.data.tasks).toHaveLength(2);
      expect(user1TasksResponse.body.data.tasks.every(task => 
        task.title.startsWith('User 1')
      )).toBe(true);

      // Step 5: Verify User 2 Only Sees Their Tasks
      const user2TasksResponse = await request(server)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${user2Token}`)
        .expect(200);

      expect(user2TasksResponse.body.data.tasks).toHaveLength(1);
      expect(user2TasksResponse.body.data.tasks[0].title).toBe('User 2 Task 1');

      // Step 6: Verify Cross-User Access Denial
      const user1TaskId = user1TasksResponse.body.data.tasks[0].id;
      
      await request(server)
        .get(`/api/tasks/${user1TaskId}`)
        .set('Authorization', `Bearer ${user2Token}`)
        .expect(404);

      await request(server)
        .put(`/api/tasks/${user1TaskId}`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send({ title: 'Unauthorized Update' })
        .expect(404);

      await request(server)
        .delete(`/api/tasks/${user1TaskId}`)
        .set('Authorization', `Bearer ${user2Token}`)
        .expect(404);
    });
  });

  describe('Error Recovery Workflow', () => {
    const userData = {
      email: 'error-recovery@example.com',
      password: 'ErrorRecovery123!',
      firstName: 'Error',
      lastName: 'Recovery'
    };

    it('should handle errors gracefully throughout workflow', async () => {
      // Step 1: Register User
      const registerResponse = await request(server)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      const { token } = registerResponse.body.data;

      // Step 2: Attempt Invalid Operations
      // Invalid task creation
      await request(server)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: '' }) // Invalid title
        .expect(400);

      // Step 3: Create Valid Task After Error
      const validTaskResponse = await request(server)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Valid Task After Error' })
        .expect(201);

      const taskId = validTaskResponse.body.data.task.id;

      // Step 4: Attempt Invalid Updates
      await request(server)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ priority: 'invalid' }) // Invalid priority
        .expect(400);

      // Step 5: Perform Valid Update After Error
      const validUpdateResponse = await request(server)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'completed' })
        .expect(200);

      expect(validUpdateResponse.body.data.task.status).toBe('completed');

      // Step 6: Verify System State Remains Consistent
      const finalTasksResponse = await request(server)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(finalTasksResponse.body.data.tasks).toHaveLength(1);
      expect(finalTasksResponse.body.data.tasks[0].status).toBe('completed');
    });
  });
});
