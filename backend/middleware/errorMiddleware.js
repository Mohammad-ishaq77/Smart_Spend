const { errorResponse } = require('../utils/responseHandler');

const errorHandler = (err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server Error';
  const errors = err.errors || null;
  return errorResponse(res, statusCode, message, errors);
};

module.exports = { errorHandler };
