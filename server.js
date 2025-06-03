const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const methodOverride = require('method-override');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
const homeRoutes = require('./routes/index');
const taskRoutes = require('./routes/taskroutes');

app.use('/', homeRoutes);
app.use('/tasks', taskRoutes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { message: 'Algo deu errado!' });
});

// Rota 404
app.use((req, res) => {
  res.status(404).render('error', { message: 'Página não encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;