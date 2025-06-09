const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

// Configuração explícita para SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: msg => logger.debug(msg)
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    // Don't exit process, just log the error
    logger.info('Continuing without database connection...');
  }
};

testConnection();

module.exports = sequelize;





