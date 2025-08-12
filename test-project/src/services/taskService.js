const { pool } = require('../config/database');
const { ApiError } = require('../utils/errorHandler');
const logger = require('../utils/logger');

/**
 * Task Service
 * Handles task-related business logic and database operations
 */

/**
 * Create a new task
 * @param {number} userId - User ID who owns the task
 * @param {Object} taskData - Task creation data
 * @returns {Object} Created task data
 */
const createTask = async (userId, taskData) => {
  const { title, description, priority = 'medium', status = 'pending', dueDate } = taskData;
  
  try {
    const insertTaskQuery = `
      INSERT INTO tasks (user_id, title, description, priority, status, due_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, user_id, title, description, priority, status, due_date, created_at, updated_at
    `;
    
    const result = await pool.query(insertTaskQuery, [
      userId,
      title,
      description || null,
      priority,
      status,
      dueDate || null
    ]);

    const newTask = result.rows[0];

    logger.info('Task created successfully', {
      taskId: newTask.id,
      userId: newTask.user_id,
      title: newTask.title
    });

    return {
      id: newTask.id,
      userId: newTask.user_id,
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      status: newTask.status,
      dueDate: newTask.due_date,
      createdAt: newTask.created_at,
      updatedAt: newTask.updated_at
    };

  } catch (error) {
    logger.error('Task creation failed', {
      error: error.message,
      userId,
      taskData
    });
    
    throw new ApiError('Failed to create task', 500, 'TASK_CREATION_FAILED');
  }
};

/**
 * Get tasks for a user with optional filtering
 * @param {number} userId - User ID
 * @param {Object} filters - Filter options (status, priority, limit, offset)
 * @returns {Object} Tasks data with pagination info
 */
const getUserTasks = async (userId, filters = {}) => {
  const { status, priority, limit = 50, offset = 0 } = filters;
  
  try {
    // Build dynamic query
    let whereConditions = ['user_id = $1'];
    let queryParams = [userId];
    let paramCount = 2;

    if (status) {
      whereConditions.push(`status = $${paramCount++}`);
      queryParams.push(status);
    }

    if (priority) {
      whereConditions.push(`priority = $${paramCount++}`);
      queryParams.push(priority);
    }

    const whereClause = whereConditions.join(' AND ');

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM tasks 
      WHERE ${whereClause}
    `;
    
    const countResult = await pool.query(countQuery, queryParams.slice(0, paramCount - 1));
    const totalTasks = parseInt(countResult.rows[0].total);

    // Get tasks with pagination
    const tasksQuery = `
      SELECT id, user_id, title, description, priority, status, due_date, created_at, updated_at
      FROM tasks 
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramCount++} OFFSET $${paramCount++}
    `;
    
    queryParams.push(limit, offset);
    const tasksResult = await pool.query(tasksQuery, queryParams);

    const tasks = tasksResult.rows.map(task => ({
      id: task.id,
      userId: task.user_id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.due_date,
      createdAt: task.created_at,
      updatedAt: task.updated_at
    }));

    logger.info('Tasks retrieved successfully', {
      userId,
      totalTasks,
      returnedTasks: tasks.length,
      filters
    });

    return {
      tasks,
      pagination: {
        total: totalTasks,
        limit,
        offset,
        hasMore: offset + limit < totalTasks
      }
    };

  } catch (error) {
    logger.error('Failed to get user tasks', {
      error: error.message,
      userId,
      filters
    });
    
    throw new ApiError('Failed to retrieve tasks', 500, 'TASKS_RETRIEVAL_FAILED');
  }
};

/**
 * Get a specific task by ID
 * @param {number} taskId - Task ID
 * @param {number} userId - User ID (for ownership verification)
 * @returns {Object} Task data
 */
const getTaskById = async (taskId, userId) => {
  try {
    const taskQuery = `
      SELECT id, user_id, title, description, priority, status, due_date, created_at, updated_at
      FROM tasks 
      WHERE id = $1 AND user_id = $2
    `;
    
    const result = await pool.query(taskQuery, [taskId, userId]);
    
    if (result.rows.length === 0) {
      throw new ApiError('Task not found', 404, 'TASK_NOT_FOUND');
    }

    const task = result.rows[0];

    return {
      id: task.id,
      userId: task.user_id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.due_date,
      createdAt: task.created_at,
      updatedAt: task.updated_at
    };

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    logger.error('Failed to get task by ID', {
      error: error.message,
      taskId,
      userId
    });
    
    throw new ApiError('Failed to retrieve task', 500, 'TASK_RETRIEVAL_FAILED');
  }
};

/**
 * Update a task
 * @param {number} taskId - Task ID
 * @param {number} userId - User ID (for ownership verification)
 * @param {Object} updateData - Data to update
 * @returns {Object} Updated task data
 */
const updateTask = async (taskId, userId, updateData) => {
  try {
    // First verify task exists and belongs to user
    await getTaskById(taskId, userId);

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    const allowedFields = ['title', 'description', 'priority', 'status', 'dueDate'];
    const dbFieldMap = {
      title: 'title',
      description: 'description',
      priority: 'priority',
      status: 'status',
      dueDate: 'due_date'
    };

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        updates.push(`${dbFieldMap[field]} = $${paramCount++}`);
        values.push(updateData[field]);
      }
    }

    if (updates.length === 0) {
      // No updates needed, return current task
      return await getTaskById(taskId, userId);
    }

    // Add updated_at timestamp
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    
    // Add WHERE conditions
    values.push(taskId, userId);

    const updateQuery = `
      UPDATE tasks 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount++} AND user_id = $${paramCount++}
      RETURNING id, user_id, title, description, priority, status, due_date, created_at, updated_at
    `;

    const result = await pool.query(updateQuery, values);
    const updatedTask = result.rows[0];

    logger.info('Task updated successfully', {
      taskId: updatedTask.id,
      userId: updatedTask.user_id,
      updatedFields: Object.keys(updateData)
    });

    return {
      id: updatedTask.id,
      userId: updatedTask.user_id,
      title: updatedTask.title,
      description: updatedTask.description,
      priority: updatedTask.priority,
      status: updatedTask.status,
      dueDate: updatedTask.due_date,
      createdAt: updatedTask.created_at,
      updatedAt: updatedTask.updated_at
    };

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    logger.error('Failed to update task', {
      error: error.message,
      taskId,
      userId,
      updateData
    });
    
    throw new ApiError('Failed to update task', 500, 'TASK_UPDATE_FAILED');
  }
};

/**
 * Delete a task
 * @param {number} taskId - Task ID
 * @param {number} userId - User ID (for ownership verification)
 * @returns {boolean} Success status
 */
const deleteTask = async (taskId, userId) => {
  try {
    // First verify task exists and belongs to user
    await getTaskById(taskId, userId);

    const deleteQuery = `
      DELETE FROM tasks 
      WHERE id = $1 AND user_id = $2
    `;
    
    const result = await pool.query(deleteQuery, [taskId, userId]);

    if (result.rowCount === 0) {
      throw new ApiError('Task not found or access denied', 404, 'TASK_NOT_FOUND');
    }

    logger.info('Task deleted successfully', {
      taskId,
      userId
    });

    return true;

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    logger.error('Failed to delete task', {
      error: error.message,
      taskId,
      userId
    });
    
    throw new ApiError('Failed to delete task', 500, 'TASK_DELETION_FAILED');
  }
};

/**
 * Get task statistics for a user
 * @param {number} userId - User ID
 * @returns {Object} Task statistics
 */
const getTaskStatistics = async (userId) => {
  try {
    const statsQuery = `
      SELECT 
        COUNT(*) as total_tasks,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_tasks,
        COUNT(CASE WHEN status = 'in-progress' THEN 1 END) as in_progress_tasks,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks,
        COUNT(CASE WHEN priority = 'high' THEN 1 END) as high_priority_tasks,
        COUNT(CASE WHEN due_date < CURRENT_TIMESTAMP AND status != 'completed' THEN 1 END) as overdue_tasks
      FROM tasks 
      WHERE user_id = $1
    `;
    
    const result = await pool.query(statsQuery, [userId]);
    const stats = result.rows[0];

    return {
      totalTasks: parseInt(stats.total_tasks),
      pendingTasks: parseInt(stats.pending_tasks),
      inProgressTasks: parseInt(stats.in_progress_tasks),
      completedTasks: parseInt(stats.completed_tasks),
      highPriorityTasks: parseInt(stats.high_priority_tasks),
      overdueTasks: parseInt(stats.overdue_tasks)
    };

  } catch (error) {
    logger.error('Failed to get task statistics', {
      error: error.message,
      userId
    });
    
    throw new ApiError('Failed to retrieve task statistics', 500, 'STATS_RETRIEVAL_FAILED');
  }
};

module.exports = {
  createTask,
  getUserTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStatistics
};
