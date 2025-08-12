const express = require('express');
const { asyncHandler } = require('../utils/errorHandler');
const { validate } = require('../utils/validators');
const { 
  taskCreationSchema, 
  taskUpdateSchema, 
  taskQuerySchema, 
  idParamSchema 
} = require('../utils/validators');
const { authenticateToken } = require('../middleware/auth');
const taskService = require('../services/taskService');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * Task Routes
 * Handles CRUD operations for tasks
 * All routes require authentication
 */

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private
 */
router.post('/',
  authenticateToken,
  validate(taskCreationSchema),
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const taskData = req.body;

    logger.info('Task creation request', { userId, taskData });

    const newTask = await taskService.createTask(userId, taskData);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: {
        task: newTask
      }
    });
  })
);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks for the authenticated user
 * @access  Private
 */
router.get('/',
  authenticateToken,
  validate(taskQuerySchema, 'query'),
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const filters = req.query;

    logger.info('Tasks retrieval request', { userId, filters });

    const result = await taskService.getUserTasks(userId, filters);

    res.json({
      success: true,
      message: 'Tasks retrieved successfully',
      data: {
        tasks: result.tasks,
        pagination: result.pagination
      }
    });
  })
);

/**
 * @route   GET /api/tasks/stats
 * @desc    Get task statistics for the authenticated user
 * @access  Private
 */
router.get('/stats',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const userId = req.user.id;

    logger.info('Task statistics request', { userId });

    const stats = await taskService.getTaskStatistics(userId);

    res.json({
      success: true,
      message: 'Task statistics retrieved successfully',
      data: {
        statistics: stats
      }
    });
  })
);

/**
 * @route   GET /api/tasks/:id
 * @desc    Get a specific task by ID
 * @access  Private
 */
router.get('/:id',
  authenticateToken,
  validate(idParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const taskId = req.params.id;

    logger.info('Single task retrieval request', { userId, taskId });

    const task = await taskService.getTaskById(taskId, userId);

    res.json({
      success: true,
      message: 'Task retrieved successfully',
      data: {
        task
      }
    });
  })
);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a specific task
 * @access  Private
 */
router.put('/:id',
  authenticateToken,
  validate(idParamSchema, 'params'),
  validate(taskUpdateSchema),
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const taskId = req.params.id;
    const updateData = req.body;

    logger.info('Task update request', { userId, taskId, updateData });

    const updatedTask = await taskService.updateTask(taskId, userId, updateData);

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: {
        task: updatedTask
      }
    });
  })
);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a specific task
 * @access  Private
 */
router.delete('/:id',
  authenticateToken,
  validate(idParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const taskId = req.params.id;

    logger.info('Task deletion request', { userId, taskId });

    await taskService.deleteTask(taskId, userId);

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  })
);

module.exports = router;
