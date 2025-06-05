const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { isProduction } = require('../utils/helpers');

const securityMiddleware = (app) => {
  // Helmet for security headers
  app.use(helmet());

  // Rate limiting
  if (isProduction()) {
    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // limit each IP to 100 requests per windowMs
      })
    );
  }

  // CORS configuration
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.APP_URL);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
};

module.exports = securityMiddleware;
