'use strict';

const { Sequelize } = require('sequelize');

// Configuração explícita para SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

const db = {};

// Importar modelos manualmente
const Task = require('./Task')(sequelize, Sequelize.DataTypes);
// Adicione outros modelos conforme necessário
// const User = require('./User')(sequelize, Sequelize.DataTypes);

// Adicionar modelos ao objeto db
db.task = Task;
// db.user = User;

// Configurar associações
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;