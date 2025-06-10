const express = require('express');
const session = require('express-session');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();
const pool = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Rotas
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/user', userRoutes);

// Rota inicial
app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/tasks');
  } else {
    res.redirect('/auth/login');
  }
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  // Verifica se a view 'error' existe, caso contrário, envia uma resposta de texto
  res.status(500).send('Algo deu errado! Erro interno do servidor.');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});

// Adicione isso no início do arquivo para ver erros de conexão com o banco
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conexão com o banco de dados estabelecida com sucesso');
  }
});



