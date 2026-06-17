const Expense = require('../models/Expense');
const { successResponse, errorResponse } = require('../utils/responseHandler');

// Create a new expense for the logged-in user
exports.createExpense = async (req, res) => {
  try {
    const { title, description, amount, category, paymentMethod, date } = req.body;
    const expense = await Expense.create({
      user: req.user._id,
      title,
      description,
      amount,
      category,
      paymentMethod,
      date,
    });
    return successResponse(res, 201, 'Expense created successfully', expense);
  } catch (err) {
    console.error(err);
    return errorResponse(res, 500, 'Server Error');
  }
};

// Get all expenses for the logged-in user
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });
    return successResponse(res, 200, 'Expenses retrieved successfully', expenses);
  } catch (err) {
    console.error(err);
    return errorResponse(res, 500, 'Server Error');
  }
};

// Get single expense by id (ownership verified)
exports.getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findOne({ _id: id, user: req.user._id });
    if (!expense) return errorResponse(res, 404, 'Expense not found');
    return successResponse(res, 200, 'Expense retrieved successfully', expense);
  } catch (err) {
    console.error(err);
    return errorResponse(res, 500, 'Server Error');
  }
};

// Update expense (only owner can update)
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findOne({ _id: id, user: req.user._id });
    if (!expense) return errorResponse(res, 403, 'Not authorized to update this expense');

    // Apply updates
    const updates = req.body;
    Object.assign(expense, updates);
    await expense.save();
    return successResponse(res, 200, 'Expense updated successfully', expense);
  } catch (err) {
    console.error(err);
    return errorResponse(res, 500, 'Server Error');
  }
};

// Delete expense (only owner can delete)
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findOne({ _id: id, user: req.user._id });
    if (!expense) return errorResponse(res, 403, 'Not authorized to delete this expense');
    await Expense.findByIdAndDelete(id);
    return successResponse(res, 200, 'Expense deleted successfully');
  } catch (err) {
    console.error(err);
    return errorResponse(res, 500, 'Server Error');
  }
};
