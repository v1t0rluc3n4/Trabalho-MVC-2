const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const logger = require('../utils/logger');

class Task extends Model {}

Task.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Title is required'
      },
      len: {
        args: [3, 100],
        msg: 'Title must be between 3 and 100 characters'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
    defaultValue: 'pending',
    allowNull: false
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium',
    allowNull: false
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
    validate: {
      isDate: {
        msg: 'Invalid date format'
      },
      isAfter: {
        args: new Date().toISOString(),
        msg: 'Due date must be in the future'
      }
    }
  }
}, {
  sequelize,
  modelName: 'task',
  timestamps: true,
  paranoid: true, // Soft delete
  defaultScope: {
    attributes: { exclude: ['deletedAt'] }
  }
});

module.exports = Task;
