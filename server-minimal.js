// server-minimal.js - Versão mínima para testar apenas a conexão com SQLite
require('dotenv').config();
const express = require('express');
const { Sequelize } = require('sequelize');
const app = express();

// Configuração explícita para SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: console.log
});

// Teste a conexão
sequelize.authenticate()
  .then(() => console.log('Database connection established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

// Rota básica
app.get('/', (req, res) => {
  res.send('Servidor funcionando com SQLite!');
});

// Start server
const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});