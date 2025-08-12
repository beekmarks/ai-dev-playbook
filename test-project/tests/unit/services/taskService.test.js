/**
 * Unit Tests for Task Service
 * Tests task CRUD operations, filtering, and statistics
 */

const taskService = require('../../../src/services/taskService');
const { ApiError } = require('../../../src/utils/errorHandler');
const { setupTestDatabase, teardownTestDatabase, clearTestData, createTestUser, createTestTask } = require('../../setup/testSetup');

describe('TaskService', () => {
  let testUser;

  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await clearTestData();
    testUser = await createTestUser();
  });

  describe('createTask', () => {
    const validTaskData = {
      title: 'Test Task',
      description: 'This is a test task',
      priority: 'high',
      status: 'pending',
      dueDate: new Date('2025-12-31T23:59:59Z')
    };

    it('should create a new task successfully', async () => {
      const result = await taskService.createTask(testUser.id, validTaskData);

      expect(result.userId).toBe(testUser.id);
      expect(result.title).toBe(validTaskData.title);
      expect(result.description).toBe(validTaskData.description);
      expect(result.priority).toBe(validTaskData.priority);
      expect(result.status).toBe(validTaskData.status);
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });

    it('should create task with default values', async () => {
      const minimalTaskData = { title: 'Minimal Task' };
      
      const result = await taskService.createTask(testUser.id, minimalTaskData);

      expect(result.title).toBe(minimalTaskData.title);
      expect(result.priority).toBe('medium');
      expect(result.status).toBe('pending');
      expect(result.description).toBeNull();
      expect(result.dueDate).toBeNull();
    });

    it('should handle missing required fields', async () => {
      await expect(taskService.createTask(testUser.id, {}))
        .rejects
        .toThrow();
    });

    it('should handle invalid user ID', async () => {
      await expect(taskService.createTask(99999, validTaskData))
        .rejects
        .toThrow();
    });
  });

  describe('getUserTasks', () => {
    beforeEach(async () => {
      // Create test tasks with different properties
      await createTestTask(testUser.id, { title: 'Task 1', priority: 'high', status: 'pending' });
      await createTestTask(testUser.id, { title: 'Task 2', priority: 'medium', status: 'in-progress' });
      await createTestTask(testUser.id, { title: 'Task 3', priority: 'low', status: 'completed' });
      await createTestTask(testUser.id, { title: 'Task 4', priority: 'high', status: 'pending' });
    });

    it('should retrieve all user tasks', async () => {
      const result = await taskService.getUserTasks(testUser.id);

      expect(result.tasks).toHaveLength(4);
      expect(result.pagination.total).toBe(4);
      expect(result.pagination.hasMore).toBe(false);
    });

    it('should filter tasks by status', async () => {
      const result = await taskService.getUserTasks(testUser.id, { status: 'pending' });

      expect(result.tasks).toHaveLength(2);
      expect(result.tasks.every(task => task.status === 'pending')).toBe(true);
    });

    it('should filter tasks by priority', async () => {
      const result = await taskService.getUserTasks(testUser.id, { priority: 'high' });

      expect(result.tasks).toHaveLength(2);
      expect(result.tasks.every(task => task.priority === 'high')).toBe(true);
    });

    it('should handle pagination', async () => {
      const result = await taskService.getUserTasks(testUser.id, { limit: 2, offset: 0 });

      expect(result.tasks).toHaveLength(2);
      expect(result.pagination.limit).toBe(2);
      expect(result.pagination.offset).toBe(0);
      expect(result.pagination.hasMore).toBe(true);
    });

    it('should return empty array for user with no tasks', async () => {
      const anotherUser = await createTestUser({ email: 'another@example.com' });
      const result = await taskService.getUserTasks(anotherUser.id);

      expect(result.tasks).toHaveLength(0);
      expect(result.pagination.total).toBe(0);
    });
  });

  describe('getTaskById', () => {
    let testTask;

    beforeEach(async () => {
      testTask = await createTestTask(testUser.id);
    });

    it('should retrieve task by ID', async () => {
      const result = await taskService.getTaskById(testTask.id, testUser.id);

      expect(result.id).toBe(testTask.id);
      expect(result.userId).toBe(testUser.id);
      expect(result.title).toBe(testTask.title);
    });

    it('should throw error for non-existent task', async () => {
      await expect(taskService.getTaskById(99999, testUser.id))
        .rejects
        .toThrow('Task not found');
    });

    it('should throw error for task owned by different user', async () => {
      const anotherUser = await createTestUser({ email: 'another@example.com' });
      
      await expect(taskService.getTaskById(testTask.id, anotherUser.id))
        .rejects
        .toThrow('Task not found');
    });
  });

  describe('updateTask', () => {
    let testTask;

    beforeEach(async () => {
      testTask = await createTestTask(testUser.id);
    });

    it('should update task successfully', async () => {
      const updateData = {
        title: 'Updated Task',
        priority: 'high',
        status: 'in-progress'
      };

      const result = await taskService.updateTask(testTask.id, testUser.id, updateData);

      expect(result.title).toBe(updateData.title);
      expect(result.priority).toBe(updateData.priority);
      expect(result.status).toBe(updateData.status);
      expect(result.updatedAt).not.toBe(testTask.updatedAt);
    });

    it('should update partial task data', async () => {
      const updateData = { title: 'Only Title Updated' };

      const result = await taskService.updateTask(testTask.id, testUser.id, updateData);

      expect(result.title).toBe(updateData.title);
      expect(result.priority).toBe(testTask.priority); // Unchanged
      expect(result.status).toBe(testTask.status); // Unchanged
    });

    it('should return existing task when no updates provided', async () => {
      const result = await taskService.updateTask(testTask.id, testUser.id, {});

      expect(result.title).toBe(testTask.title);
      expect(result.priority).toBe(testTask.priority);
    });

    it('should throw error for non-existent task', async () => {
      await expect(taskService.updateTask(99999, testUser.id, { title: 'Updated' }))
        .rejects
        .toThrow('Task not found');
    });

    it('should throw error for task owned by different user', async () => {
      const anotherUser = await createTestUser({ email: 'another@example.com' });
      
      await expect(taskService.updateTask(testTask.id, anotherUser.id, { title: 'Updated' }))
        .rejects
        .toThrow('Task not found');
    });
  });

  describe('deleteTask', () => {
    let testTask;

    beforeEach(async () => {
      testTask = await createTestTask(testUser.id);
    });

    it('should delete task successfully', async () => {
      const result = await taskService.deleteTask(testTask.id, testUser.id);

      expect(result).toBe(true);

      // Verify task is deleted
      await expect(taskService.getTaskById(testTask.id, testUser.id))
        .rejects
        .toThrow('Task not found');
    });

    it('should throw error for non-existent task', async () => {
      await expect(taskService.deleteTask(99999, testUser.id))
        .rejects
        .toThrow('Task not found');
    });

    it('should throw error for task owned by different user', async () => {
      const anotherUser = await createTestUser({ email: 'another@example.com' });
      
      await expect(taskService.deleteTask(testTask.id, anotherUser.id))
        .rejects
        .toThrow('Task not found');
    });
  });

  describe('getTaskStatistics', () => {
    beforeEach(async () => {
      // Create tasks with different statuses and priorities
      await createTestTask(testUser.id, { priority: 'high', status: 'pending' });
      await createTestTask(testUser.id, { priority: 'medium', status: 'in-progress' });
      await createTestTask(testUser.id, { priority: 'low', status: 'completed' });
      await createTestTask(testUser.id, { priority: 'high', status: 'completed' });
      
      // Create overdue task
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // Yesterday
      await createTestTask(testUser.id, { 
        priority: 'medium', 
        status: 'pending', 
        dueDate: pastDate 
      });
    });

    it('should return correct task statistics', async () => {
      const stats = await taskService.getTaskStatistics(testUser.id);

      expect(stats.totalTasks).toBe(5);
      expect(stats.pendingTasks).toBe(2);
      expect(stats.inProgressTasks).toBe(1);
      expect(stats.completedTasks).toBe(2);
      expect(stats.highPriorityTasks).toBe(2);
      expect(stats.overdueTasks).toBe(1);
    });

    it('should return zero statistics for user with no tasks', async () => {
      const anotherUser = await createTestUser({ email: 'another@example.com' });
      const stats = await taskService.getTaskStatistics(anotherUser.id);

      expect(stats.totalTasks).toBe(0);
      expect(stats.pendingTasks).toBe(0);
      expect(stats.inProgressTasks).toBe(0);
      expect(stats.completedTasks).toBe(0);
      expect(stats.highPriorityTasks).toBe(0);
      expect(stats.overdueTasks).toBe(0);
    });
  });
});
