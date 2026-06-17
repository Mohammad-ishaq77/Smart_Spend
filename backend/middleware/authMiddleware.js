const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/responseHandler');

exports.protect = async (req, res, next) => {
  let token;
  // Check for Bearer token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return errorResponse(res, 401, 'Not authorized, token missing');

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user to request (without password)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return errorResponse(res, 401, 'Not authorized, user not found');
    req.user = user;
    next();
  } catch (err) {
    return errorResponse(res, 401, 'Not authorized, token invalid');
  }
};
