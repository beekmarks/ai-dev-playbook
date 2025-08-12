const express = require('express');
const { asyncHandler } = require('../utils/errorHandler');
const { validate } = require('../utils/validators');
const { userRegistrationSchema, userLoginSchema } = require('../utils/validators');
const { authLimiter } = require('../middleware/security');
const { authenticateToken } = require('../middleware/auth');
const userService = require('../services/userService');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * Authentication Routes
 * Handles user registration, login, and profile management
 */

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', 
  authLimiter,
  validate(userRegistrationSchema),
  asyncHandler(async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    logger.info('User registration attempt', { email });

    const result = await userService.createUser({
      email,
      password,
      firstName,
      lastName
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: result.user,
        token: result.token
      }
    });
  })
);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return token
 * @access  Public
 */
router.post('/login',
  authLimiter,
  validate(userLoginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    logger.info('User login attempt', { email });

    const result = await userService.authenticateUser({
      email,
      password
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        token: result.token
      }
    });
  })
);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const userId = req.user.id;

    logger.info('Profile request', { userId });

    const userProfile = await userService.getUserProfile(userId);

    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user: userProfile
      }
    });
  })
);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update current user profile
 * @access  Private
 */
router.put('/profile',
  authenticateToken,
  validate({
    firstName: require('joi').string().min(1).max(100).pattern(/^[a-zA-Z\s]+$/).optional(),
    lastName: require('joi').string().min(1).max(100).pattern(/^[a-zA-Z\s]+$/).optional()
  }),
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const updateData = req.body;

    logger.info('Profile update request', { userId, updateData });

    const updatedProfile = await userService.updateUserProfile(userId, updateData);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedProfile
      }
    });
  })
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post('/logout',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const userId = req.user.id;

    logger.logAuth('User logout', { userId });

    // Since we're using JWT tokens, logout is handled client-side
    // This endpoint is mainly for logging purposes
    res.json({
      success: true,
      message: 'Logout successful'
    });
  })
);

/**
 * @route   GET /api/auth/verify
 * @desc    Verify token validity
 * @access  Private
 */
router.get('/verify',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // Token is valid if we reach this point
    const userProfile = await userService.getUserProfile(userId);

    res.json({
      success: true,
      message: 'Token is valid',
      data: {
        user: userProfile
      }
    });
  })
);

module.exports = router;
