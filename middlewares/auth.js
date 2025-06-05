const jwt = require('jsonwebtoken');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const logger = require('../utils/logger');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to access this resource')
      );
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorize
};
