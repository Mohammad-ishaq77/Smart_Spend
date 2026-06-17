const { body, query, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/responseHandler');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({ field: e.param, message: e.msg }));
    return errorResponse(res, 400, 'Validation Error', formatted);
  }
  next();
};

const registerRules = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validateRequest,
];

const loginRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validateRequest,
];

const createExpenseRules = [
  body('title').notEmpty().withMessage('Title is required'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
  body('category').notEmpty().withMessage('Category is required'),
  body('paymentMethod').notEmpty().withMessage('Payment method is required'),
  validateRequest,
];

const updateExpenseRules = [
  body('amount').optional().isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
  validateRequest,
];

const expenseQueryRules = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be >= 1'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  validateRequest,
];

module.exports = { registerRules, loginRules, createExpenseRules, updateExpenseRules, expenseQueryRules };
