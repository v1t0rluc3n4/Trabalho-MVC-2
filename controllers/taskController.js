const { Task, User } = require('../models');
const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

class TaskController {
  async getAllTasks(req, res, next) {
    try {
      const tasks = await Task.findAll({
        where: { userId: req.user.id },
        order: [
          ['priority', 'DESC'],
          ['dueDate', 'ASC']
        ]
      });
      res.json(tasks);
    } catch (error) {
      logger.error('Error fetching tasks:', error);
      next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error fetching tasks'));
    }
  }

  async getTaskById(req, res, next) {
    try {
      const task = await Task.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      });

      if (!task) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
      }

      res.json(task);
    } catch (error) {
      next(error);
    }
  }

  async createTask(req, res, next) {
    try {
      const { title, description, status, priority, dueDate } = req.body;

      const task = await Task.create({
        title,
        description,
        status,
        priority,
        dueDate,
        userId: req.user.id
      });

      res.status(httpStatus.CREATED).json(task);
    } catch (error) {
      next(new ApiError(httpStatus.BAD_REQUEST, 'Error creating task', error.errors));
    }
  }

  async updateTask(req, res, next) {
    try {
      const task = await Task.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      });

      if (!task) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
      }

      const updatedTask = await task.update(req.body);
      res.json(updatedTask);
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req, res, next) {
    try {
      const task = await Task.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      });

      if (!task) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
      }

      await task.destroy();
      res.status(httpStatus.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TaskController();