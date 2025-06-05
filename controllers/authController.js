const { User } = require('../models');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const logger = require('../utils/logger');
const { AuthService } = require('../services/AuthService');

class AuthController {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const user = await AuthService.register({ name, email, password });
      req.flash('success', 'Registration successful! Please log in.');
      res.redirect('/login');
    } catch (error) {
      logger.error('Error registering user:', error);
      req.flash('error', error.message || 'Registration failed');
      res.redirect('/register');
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { user, token } = await AuthService.login({ email, password });

      // Set JWT token in cookie
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.APP_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });

      req.flash('success', 'Login successful!');
      res.redirect('/tasks');
    } catch (error) {
      logger.error('Error logging in:', error);
      req.flash('error', 'Invalid credentials');
      res.redirect('/login');
    }
  }

  async logout(req, res, next) {
    try {
      res.clearCookie('jwt');
      req.session.destroy((err) => {
        if (err) {
          logger.error('Error logging out:', err);
          return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error logging out'));
        }
        req.flash('success', 'Logged out successfully');
        res.redirect('/login');
      });
    } catch (error) {
      next(error);
    }
  }

  async getRegisterPage(req, res) {
    res.render('auth/register', { title: 'Register' });
  }

  async getLoginPage(req, res) {
    res.render('auth/login', { title: 'Login' });
  }
}

module.exports = new AuthController();