const express = require('express');
const router = express.Router();
const {
	createExpense,
	getExpenses,
	getExpenseById,
	updateExpense,
	deleteExpense,
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');
const { createExpenseRules, updateExpenseRules, expenseQueryRules } = require('../middleware/validators');

// All expense routes require authentication
router.use(protect);

// Create expense
router.post('/', createExpenseRules, createExpense);

// List expenses for logged-in user
router.get('/', expenseQueryRules, getExpenses);

// Get single expense
router.get('/:id', getExpenseById);

// Update expense
router.put('/:id', updateExpenseRules, updateExpense);

// Delete expense
router.delete('/:id', deleteExpense);

module.exports = router;
