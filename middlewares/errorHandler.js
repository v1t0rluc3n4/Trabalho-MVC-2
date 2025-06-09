const logger = require('../utils/logger');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Ensure error is an instance of ApiError
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || 'An unexpected error occurred';
    error = new ApiError(statusCode, message, error.errors || [], true, error.stack);
  }

  // Log the error
  logger.error(`Error: ${error.message}`, {
    statusCode: error.statusCode,
    stack: error.stack,
    errors: error.errors
  });

  // Handle API vs Web responses
  if (req.path.startsWith('/api')) {
    return res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
      errors: error.errors,
      stack: process.env.APP_ENV === 'development' ? error.stack : undefined
    });
  }

  // Web response
  req.flash('error', error.message);
  res.status(error.statusCode).redirect(req.headers.referer || '/');
};

module.exports = errorHandler;