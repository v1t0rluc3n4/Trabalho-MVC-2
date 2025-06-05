const { Task } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const logger = require('../utils/logger');

class TaskService {
  async getAllTasks(userId) {
    try {
      return await Task.findAll({
        where: { userId },
        order: [['priority', 'DESC'], ['dueDate', 'ASC']]
      });
    } catch (error) {
      logger.error('Error in TaskService.getAllTasks:', error);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error fetching tasks');
    }
  }

  async getTaskById(id, userId) {
    try {
      const task = await Task.findOne({ where: { id, userId } });
      if (!task) throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
      return task;
    } catch (error) {
      logger.error('Error in TaskService.getTaskById:', error);
      throw error;
    }
  }

  async createTask(data, userId) {
    try {
      return await Task.create({ ...data, userId });
    } catch (error) {
      logger.error('Error in TaskService.createTask:', error);
      throw new ApiError(httpStatus.BAD_REQUEST, 'Error creating task', error.errors);
    }
  }

  async updateTask(id, data, userId) {
    try {
      const task = await Task.findOne({ where: { id, userId } });
      if (!task) throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
      return await task.update(data);
    } catch (error) {
      logger.error('Error in TaskService.updateTask:', error);
      throw error;
    }
  }

  async deleteTask(id, userId) {
    try {
      const task = await Task.findOne({ where: { id, userId } });
      if (!task) throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
      await task.destroy();
    } catch (error) {
      logger.error('Error in TaskService.deleteTask:', error);
      throw error;
    }
  }
}

module.exports = new TaskService();