// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const logger = require('./utils/logger');
const securityMiddleware = require('./config/security');

const app = express();

// Database connection
const db = require('./models');
const sequelize = db.sequelize;

// Teste a conexão
sequelize.authenticate()
  .then(() => {
    logger.info('Database connection established successfully.');
    // Sincronizar modelos com o banco de dados
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    logger.info('Database synchronized successfully.');
    startServer();
  })
  .catch(err => {
    logger.error('Unable to connect to the database:', err);
    // Continue mesmo com erro de conexão
    startServer();
  });

function startServer() {
  // Configurações do Express
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(methodOverride('_method'));

  // Segurança
  securityMiddleware(app);

  // Sessão e Flash Messages
  const sessionStore = new (require('connect-session-sequelize')(session.Store))({
    db: sequelize,
    tableName: 'sessions'
  });
  
  // Sincronizar a tabela de sessões
  sessionStore.sync();
  
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
  }));
  
  app.use(flash());

  // Middleware global para flash messages
  app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.user = req.session.user || null;
    next();
  });

  // Rota básica para teste
  app.get('/', (req, res) => {
    res.send('Servidor funcionando com Supabase PostgreSQL!');
  });

  // Error handling
  app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Algo deu errado!');
  });

  // Start server
  const PORT = process.env.APP_PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.APP_ENV}`);
  });
}





