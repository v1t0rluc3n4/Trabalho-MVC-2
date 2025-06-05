const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const logger = require('../utils/logger');

const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    logger.error('Validation error:', error.details);
    next(new ApiError(httpStatus.BAD_REQUEST, 'Validation error', error.details.map(err => err.message)));
  }
};

module.exports = validate;