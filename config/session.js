require('dotenv').config();
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./database');
const { isProduction } = require('../utils/helpers');

module.exports = {
  sessionConfig: {
    secret: process.env.SESSION_SECRET,
    store: new SequelizeStore({
      db: sequelize,
      tableName: 'sessions',
      checkExpirationInterval: 15 * 60 * 1000,
      expiration: 24 * 60 * 60 * 1000
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProduction(),
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    }
  }
};