const { User } = require('../models');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const logger = require('../utils/logger');

class AuthService {
  async register({ name, email, password }) {
    try {
      const user = await User.create({ name, email, password });
      return user;
    } catch (error) {
      logger.error('Error in AuthService.register:', error);
      throw new ApiError(httpStatus.BAD_REQUEST, 'Registration failed', error.errors);
    }
  }

  async login({ email, password }) {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user || !(await user.comparePassword(password))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
      }

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
      });

      return { user, token };
    } catch (error) {
      logger.error('Error in AuthService.login:', error);
      throw error;
    }
  }
}

module.exports = new AuthService();