const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');
require('dotenv').config();

// Configuração para PostgreSQL (Supabase)
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
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






