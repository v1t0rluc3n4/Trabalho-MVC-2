// Serviço de usuário - exemplo
const User = require('../models/User');
const db = require('../config/database');

function getAllUsers(callback) {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return callback(err);
    const users = results.map(row => new User(row.id, row.nome, row.email));
    callback(null, users);
  });
}
module.exports = { getAllUsers };
