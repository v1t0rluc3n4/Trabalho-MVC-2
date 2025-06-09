// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const logger = require('./utils/logger');
const securityMiddleware = require('./config/security');
const { sessionConfig } = require('./config/session');

const app = express();

// Database connection - USANDO EXPLICITAMENTE SQLITE
const sequelize = require('./config/sqlite-database');

// Teste a conexão
sequelize.authenticate()
  .then(() => console.log('Database connection established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

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
app.use(session(sessionConfig));
app.use(flash());

// Middleware global para flash messages
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use('/', require('./routes/web/auth'));
app.use('/tasks', require('./routes/web/tasks'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/tasks', require('./routes/api/tasks'));

// Error handling
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

// Start server
const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.APP_ENV}`);
});




