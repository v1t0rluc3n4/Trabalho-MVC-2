const Joi = require('joi');

const taskSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().allow('').optional(),
  status: Joi.string().valid('pending', 'in_progress', 'completed').required(),
  priority: Joi.string().valid('low', 'medium', 'high').required(),
  dueDate: Joi.date().greater('now').allow(null).optional()
});

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

module.exports = {
  taskSchema,
  registerSchema,
  loginSchema
};