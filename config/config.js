module.exports = {
  development: {
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
  },
  test: {
    dialect: 'sqlite',
    storage: './database-test.sqlite',
    logging: false
  },
  production: {
    dialect: 'sqlite',
    storage: './database-production.sqlite',
    logging: false
  }
};
