const User = require('../models/User');

class UserController {
  static async showProfile(req, res) {
    if (!req.session.user) return res.redirect('/auth/login');
    try {
      const user = await User.findById(req.session.user.id);
      res.render('user/profile', { user, error: null });
    } catch (error) {
      res.render('user/profile', { user: null, error: 'Erro ao carregar perfil' });
    }
  }

  static async updateProfile(req, res) {
    if (!req.session.user) return res.redirect('/auth/login');
    const { username, email } = req.body;
    try {
      const user = await User.findById(req.session.user.id);
      if (!user) {
        return res.render('user/profile', { user, error: 'Usuário não encontrado' });
      }
      // Atualizar apenas username e email (senha requer endpoint separado)
      const query = `
        UPDATE users
        SET username = $1, email = $2, updated_at = NOW()
        WHERE id = $3
        RETURNING *
      `;
      const result = await pool.query(query, [username, email, req.session.user.id]);
      req.session.user = { id: result.rows[0].id, username: result.rows[0].username };
      res.render('user/profile', { user: result.rows[0], error: null, success: 'Perfil atualizado com sucesso' });
    } catch (error) {
      res.render('user/profile', { user: req.session.user, error: 'Erro ao atualizar perfil' });
    }
  }
}

module.exports = UserController;