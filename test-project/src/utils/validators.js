const Joi = require('joi');

/**
 * Input Validation Schemas
 * Provides comprehensive validation schemas for all API endpoints
 */

/**
 * User registration validation schema
 */
const userRegistrationSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .max(255)
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.max': 'Email must not exceed 255 characters',
      'any.required': 'Email is required'
    }),
  
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password must not exceed 128 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'Password is required'
    }),
  
  firstName: Joi.string()
    .min(1)
    .max(100)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      'string.min': 'First name must be at least 1 character long',
      'string.max': 'First name must not exceed 100 characters',
      'string.pattern.base': 'First name can only contain letters and spaces',
      'any.required': 'First name is required'
    }),
  
  lastName: Joi.string()
    .min(1)
    .max(100)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      'string.min': 'Last name must be at least 1 character long',
      'string.max': 'Last name must not exceed 100 characters',
      'string.pattern.base': 'Last name can only contain letters and spaces',
      'any.required': 'Last name is required'
    })
});

/**
 * User login validation schema
 */
const userLoginSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .max(255)
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.max': 'Email must not exceed 255 characters',
      'any.required': 'Email is required'
    }),
  
  password: Joi.string()
    .min(1)
    .max(128)
    .required()
    .messages({
      'string.min': 'Password is required',
      'string.max': 'Password must not exceed 128 characters',
      'any.required': 'Password is required'
    })
});

/**
 * Task creation validation schema
 */
const taskCreationSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(255)
    .required()
    .messages({
      'string.min': 'Title must be at least 1 character long',
      'string.max': 'Title must not exceed 255 characters',
      'any.required': 'Title is required'
    }),
  
  description: Joi.string()
    .max(2000)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Description must not exceed 2000 characters'
    }),
  
  priority: Joi.string()
    .valid('low', 'medium', 'high')
    .default('medium')
    .messages({
      'any.only': 'Priority must be one of: low, medium, high'
    }),
  
  status: Joi.string()
    .valid('pending', 'in-progress', 'completed')
    .default('pending')
    .messages({
      'any.only': 'Status must be one of: pending, in-progress, completed'
    }),
  
  dueDate: Joi.date()
    .iso()
    .min('now')
    .optional()
    .messages({
      'date.format': 'Due date must be a valid ISO 8601 date string',
      'date.min': 'Due date cannot be in the past'
    })
});

/**
 * Task update validation schema (all fields optional)
 */
const taskUpdateSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(255)
    .optional()
    .messages({
      'string.min': 'Title must be at least 1 character long',
      'string.max': 'Title must not exceed 255 characters'
    }),
  
  description: Joi.string()
    .max(2000)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Description must not exceed 2000 characters'
    }),
  
  priority: Joi.string()
    .valid('low', 'medium', 'high')
    .optional()
    .messages({
      'any.only': 'Priority must be one of: low, medium, high'
    }),
  
  status: Joi.string()
    .valid('pending', 'in-progress', 'completed')
    .optional()
    .messages({
      'any.only': 'Status must be one of: pending, in-progress, completed'
    }),
  
  dueDate: Joi.date()
    .iso()
    .optional()
    .allow(null)
    .messages({
      'date.format': 'Due date must be a valid ISO 8601 date string'
    })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

/**
 * Task query parameters validation schema
 */
const taskQuerySchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'in-progress', 'completed')
    .optional()
    .messages({
      'any.only': 'Status filter must be one of: pending, in-progress, completed'
    }),
  
  priority: Joi.string()
    .valid('low', 'medium', 'high')
    .optional()
    .messages({
      'any.only': 'Priority filter must be one of: low, medium, high'
    }),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(50)
    .optional()
    .messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit must not exceed 100'
    }),
  
  offset: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .optional()
    .messages({
      'number.base': 'Offset must be a number',
      'number.integer': 'Offset must be an integer',
      'number.min': 'Offset must be at least 0'
    })
});

/**
 * ID parameter validation schema
 */
const idParamSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'ID must be a number',
      'number.integer': 'ID must be an integer',
      'number.positive': 'ID must be a positive number',
      'any.required': 'ID is required'
    })
});

/**
 * Validation middleware factory
 * @param {Object} schema - Joi validation schema
 * @param {string} property - Request property to validate (body, query, params)
 * @returns {Function} Express middleware function
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // Return all validation errors
      stripUnknown: true, // Remove unknown properties
      convert: true // Convert values to appropriate types
    });

    if (error) {
      const validationError = new Error('Validation failed');
      validationError.name = 'ValidationError';
      validationError.details = error.details;
      return next(validationError);
    }

    // Replace the original data with validated and sanitized data
    req[property] = value;
    next();
  };
};

module.exports = {
  userRegistrationSchema,
  userLoginSchema,
  taskCreationSchema,
  taskUpdateSchema,
  taskQuerySchema,
  idParamSchema,
  validate
};
