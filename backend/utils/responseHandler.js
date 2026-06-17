const successResponse = (res, statusCode = 200, message = 'Success', data = null, pagination = null) => {
  const response = { success: true, message };
  if (data !== null) response.data = data;
  if (pagination) {
    response.page = pagination.page;
    response.limit = pagination.limit;
    response.totalPages = pagination.totalPages;
    response.totalRecords = pagination.totalRecords;
  }
  return res.status(statusCode).json(response);
};

const errorResponse = (res, statusCode = 500, message = 'Error', errors = null) => {
  const response = { success: false, message };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
};

module.exports = { successResponse, errorResponse };
