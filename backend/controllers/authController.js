
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { successResponse, errorResponse } = require('../utils/responseHandler');

// Generate JWT token
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Prevent duplicate registrations
    const existing = await User.findOne({ email });
    if (existing) return errorResponse(res, 400, 'User already exists');

    const user = await User.create({ name, email, password });

    const token = generateToken(user._id);

    // Return user data (password excluded by model) and token
    return successResponse(res, 201, 'User registered successfully', { user, token });
  } catch (err) {
    console.error(err);
    return errorResponse(res, 500, 'Server Error');
  }
};

// Login existing user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return errorResponse(res, 401, 'Invalid email or password');

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return errorResponse(res, 401, 'Invalid email or password');

    const token = generateToken(user._id);
    return successResponse(res, 200, 'Login successful', { user, token });
  } catch (err) {
    console.error(err);
    return errorResponse(res, 500, 'Server Error');
  }
};
