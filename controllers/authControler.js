const User = require('../models/User');
const bcrypt = require('bcrypt');

class AuthController {
  static showLogin(req, res) {
    res.render('auth/login', { error: null });
  }

  static showRegister(req, res) {
    res.render('auth/register', { error: null });
  }

  static async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await User.findByEmail(email);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.render('auth/login', { error: 'Email ou senha inválidos' });
      }
      req.session.user = { id: user.id, username: user.username };
      res.redirect('/tasks');
    } catch (error) {
      res.render('auth/login', { error: 'Erro ao fazer login' });
    }
  }

  static async register(req, res) {
    const { username, email, password } = req.body;
    try {
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.render('auth/register', { error: 'Email já cadastrado' });
      }
      if (password.length < 6) {
        return res.render('auth/register', { error: 'A senha deve ter pelo menos 6 caracteres' });
      }
      const user = await User.create({ username, email, password });
      req.session.user = { id: user.id, username: user.username };
      res.redirect('/tasks');
    } catch (error) {
      res.render('auth/register', { error: 'Erro ao cadastrar usuário' });
    }
  }

  static logout(req, res) {
    req.session.destroy();
    res.redirect('/auth/login');
  }
}

module.exports = AuthController;