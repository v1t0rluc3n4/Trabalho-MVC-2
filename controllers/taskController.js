const Task = require('../models/Task');
const Category = require('../models/Category');

const taskController = {
  // Renderizar página principal com lista de tarefas
  index: async (req, res) => {
    try {
      const userId = 1; // Simulando usuário logado
      const tasks = await Task.findByUser(userId);
      const categories = await Category.findAll();
      res.render('tasks/index', { tasks, categories });
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
      res.status(500).render('error', { message: 'Erro interno do servidor' });
    }
  },

  // Renderizar formulário de nova tarefa
  create: async (req, res) => {
    try {
      const categories = await Category.findAll();
      res.render('tasks/create', { categories });
    } catch (error) {
      console.error('Erro ao carregar formulário:', error);
      res.status(500).render('error', { message: 'Erro interno do servidor' });
    }
  },

  // Processar criação de nova tarefa
  store: async (req, res) => {
    try {
      const { title, description, category_id } = req.body;
      const userId = 1; // Simulando usuário logado
      
      await Task.create({
        title,
        description,
        status: 'pendente',
        user_id: userId,
        category_id: category_id || null
      });

      res.redirect('/tasks');
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      res.status(500).render('error', { message: 'Erro ao criar tarefa' });
    }
  },

  // Renderizar formulário de edição
  edit: async (req, res) => {
    try {
      const { id } = req.params;
      const task = await Task.findById(id);
      const categories = await Category.findAll();
      
      if (!task) {
        return res.status(404).render('error', { message: 'Tarefa não encontrada' });
      }

      res.render('tasks/edit', { task, categories });
    } catch (error) {
      console.error('Erro ao buscar tarefa:', error);
      res.status(500).render('error', { message: 'Erro interno do servidor' });
    }
  },

  // Processar atualização de tarefa
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, status, category_id } = req.body;
      
      await Task.update(id, {
        title,
        description,
        status,
        category_id: category_id || null
      });

      res.redirect('/tasks');
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      res.status(500).render('error', { message: 'Erro ao atualizar tarefa' });
    }
  },

  // Excluir tarefa
  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      await Task.delete(id);
      res.redirect('/tasks');
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      res.status(500).render('error', { message: 'Erro ao excluir tarefa' });
    }
  },

  // API Routes para integração via fetch
  apiIndex: async (req, res) => {
    try {
      const userId = 1; // Simulando usuário logado
      const tasks = await Task.findByUser(userId);
      res.json(tasks);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  apiStore: async (req, res) => {
    try {
      const { title, description, category_id } = req.body;
      const userId = 1; // Simulando usuário logado
      
      const task = await Task.create({
        title,
        description,
        status: 'pendente',
        user_id: userId,
        category_id: category_id || null
      });

      res.json(task);
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      res.status(500).json({ error: 'Erro ao criar tarefa' });
    }
  },

  apiUpdate: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, status, category_id } = req.body;
      
      const task = await Task.update(id, {
        title,
        description,
        status,
        category_id: category_id || null
      });

      res.json(task);
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      res.status(500).json({ error: 'Erro ao atualizar tarefa' });
    }
  },

  apiDestroy: async (req, res) => {
    try {
      const { id } = req.params;
      await Task.delete(id);
      res.json({ message: 'Tarefa excluída com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      res.status(500).json({ error: 'Erro ao excluir tarefa' });
    }
  }
};

module.exports = taskController;