const Task = require('../models/Task');

class TaskController {
  static async index(req, res) {
    if (!req.session.user) return res.redirect('/auth/login');
    const { status, priority, sort } = req.query;
    try {
      const tasks = await Task.findByUserId(req.session.user.id, { status, priority, sort });
      const stats = await Task.getStats(req.session.user.id);
      res.render('tasks/index', { tasks, stats, user: req.session.user });
    } catch (error) {
      res.render('tasks/index', { tasks: [], stats: {}, error: 'Erro ao carregar tarefas' });
    }
  }

  static showCreate(req, res) {
    if (!req.session.user) return res.redirect('/auth/login');
    res.render('tasks/create', { error: null });
  }

  static async create(req, res) {
    if (!req.session.user) return res.redirect('/auth/login');
    const { title, description, status, priority, due_date } = req.body;
    try {
      await Task.create({
        user_id: req.session.user.id,
        title,
        description,
        status,
        priority,
        due_date,
      });
      res.redirect('/tasks');
    } catch (error) {
      res.render('tasks/create', { error: 'Erro ao criar tarefa' });
    }
  }

  static async showEdit(req, res) {
    if (!req.session.user) return res.redirect('/auth/login');
    try {
      const task = await Task.findById(req.params.id);
      if (!task || task.user_id !== req.session.user.id) {
        return res.redirect('/tasks');
      }
      res.render('tasks/edit', { task, error: null });
    } catch (error) {
      res.redirect('/tasks');
    }
  }

  static async update(req, res) {
    if (!req.session.user) return res.redirect('/auth/login');
    const { title, description, status, priority, due_date } = req.body;
    try {
      const task = await Task.findById(req.params.id);
      if (!task || task.user_id !== req.session.user.id) {
        return res.redirect('/tasks');
      }
      await Task.update(req.params.id, { title, description, status, priority, due_date });
      res.redirect('/tasks');
    } catch (error) {
      res.render('tasks/edit', { task: req.body, error: 'Erro ao atualizar tarefa' });
    }
  }

  static async delete(req, res) {
    if (!req.session.user) return res.redirect('/auth/login');
    try {
      const task = await Task.findById(req.params.id);
      if (!task || task.user_id !== req.session.user.id) {
        return res.redirect('/tasks');
      }
      await Task.delete(req.params.id);
      res.redirect('/tasks');
    } catch (error) {
      res.redirect('/tasks');
    }
  }
}

module.exports = TaskController;