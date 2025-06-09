'use strict';

const { Sequelize } = require('sequelize');

// Configuração explícita para SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

const db = {};

// Não carregamos nenhum modelo aqui
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;