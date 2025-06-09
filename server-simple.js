// server-simple.js - Versão simplificada para testar a conexão com o banco de dados
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