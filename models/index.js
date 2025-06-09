'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const db = {};

// Configuração explícita para SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    try {
      // Modificado para lidar com modelos ES6 Class e CommonJS
      const model = require(path.join(__dirname, file));
      // Verifica se o modelo é uma função (estilo antigo) ou uma classe (ES6)
      if (typeof model === 'function') {
        const modelInstance = model(sequelize, Sequelize.DataTypes);
        db[modelInstance.name] = modelInstance;
      } else {
        // Se for um módulo ES6, assume que exporta a classe diretamente
        db[model.name] = model;
      }
    } catch (error) {
      console.error(`Error loading model ${file}:`, error);
    }
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
