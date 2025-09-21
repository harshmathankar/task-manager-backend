const express = require('express');
const { body, param, query } = require('express-validator');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Validation rules
const taskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be true or false')
];

const updateTaskValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be true or false')
];

const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid task ID')
];

const queryValidation = [
  query('completed')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('Completed must be true or false'),
  
  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  
  query('sort')
    .optional()
    .isIn(['-createdAt', 'createdAt', '-updatedAt', 'updatedAt', 'title', '-title', 'dueDate', '-dueDate'])
    .withMessage('Invalid sort parameter')
];

// Routes
router.get('/', queryValidation, taskController.getTasks);
router.post('/', taskValidation, taskController.createTask);
router.get('/:id', idValidation, taskController.getTask);
router.put('/:id', idValidation, updateTaskValidation, taskController.updateTask);
router.delete('/:id', idValidation, taskController.deleteTask);

module.exports = router;
