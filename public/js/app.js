// Classe para gerenciar os dados do aplicativo
class TaskManagerDB {
  constructor() {
    this.users = [];
    this.tasks = [];
    this.currentUser = null;
    this.userIdCounter = 1;
    this.taskIdCounter = 1;
    
    // Carregar dados do localStorage
    this.loadData();
  }
  
  // Salvar dados no localStorage
  saveData() {
    localStorage.setItem('taskManagerUsers', JSON.stringify(this.users));
    localStorage.setItem('taskManagerTasks', JSON.stringify(this.tasks));
    localStorage.setItem('taskManagerUserCounter', this.userIdCounter);
    localStorage.setItem('taskManagerTaskCounter', this.taskIdCounter);
    
    if (this.currentUser) {
      localStorage.setItem('taskManagerCurrentUser', JSON.stringify(this.currentUser));
    } else {
      localStorage.removeItem('taskManagerCurrentUser');
    }
  }
  
  // Carregar dados do localStorage
  loadData() {
    const users = localStorage.getItem('taskManagerUsers');
    const tasks = localStorage.getItem('taskManagerTasks');
    const currentUser = localStorage.getItem('taskManagerCurrentUser');
    const userCounter = localStorage.getItem('taskManagerUserCounter');
    const taskCounter = localStorage.getItem('taskManagerTaskCounter');
    
    if (users) this.users = JSON.parse(users);
    if (tasks) this.tasks = JSON.parse(tasks);
    if (currentUser) this.currentUser = JSON.parse(currentUser);
    if (userCounter) this.userIdCounter = parseInt(userCounter);
    if (taskCounter) this.taskIdCounter = parseInt(taskCounter);
  }
  
  // Hash de senha
  hashPassword(password) {
    return CryptoJS.SHA256(password).toString();
  }
  
  // Registrar usuário
  registerUser(username, email, password) {
    // Verificar se email já existe
    if (this.users.some(user => user.email === email)) {
      throw new Error('Este email já está em uso');
    }
    
    const newUser = {
      id: this.userIdCounter++,
      username,
      email,
      password: this.hashPassword(password),
      createdAt: new Date()
    };
    
    this.users.push(newUser);
    this.saveData();
    
    // Retornar usuário sem a senha
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
  
  // Login de usuário
  loginUser(email, password) {
    const user = this.users.find(user => user.email === email);
    
    if (!user || user.password !== this.hashPassword(password)) {
      throw new Error('Email ou senha incorretos');
    }
    
    this.currentUser = {
      id: user.id,
      username: user.username,
      email: user.email
    };
    
    this.saveData();
    return this.currentUser;
  }
  
  // Logout
  logout() {
    this.currentUser = null;
    this.saveData();
  }
  
  // Criar tarefa
  createTask(title, description, status, priority, dueDate) {
    if (!this.currentUser) {
      throw new Error('Usuário não autenticado');
    }
    
    const newTask = {
      id: this.taskIdCounter++,
      userId: this.currentUser.id,
      title,
      description,
      status,
      priority,
      dueDate: dueDate || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.tasks.push(newTask);
    this.saveData();
    return newTask;
  }
  
  // Atualizar tarefa
  updateTask(taskId, updates) {
    if (!this.currentUser) {
      throw new Error('Usuário não autenticado');
    }
    
    const taskIndex = this.tasks.findIndex(task => 
      task.id === taskId && task.userId === this.currentUser.id
    );
    
    if (taskIndex === -1) {
      throw new Error('Tarefa não encontrada');
    }
    
    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    this.saveData();
    return this.tasks[taskIndex];
  }
  
  // Excluir tarefa
  deleteTask(taskId) {
    if (!this.currentUser) {
      throw new Error('Usuário não autenticado');
    }
    
    const taskIndex = this.tasks.findIndex(task => 
      task.id === taskId && task.userId === this.currentUser.id
    );
    
    if (taskIndex === -1) {
      throw new Error('Tarefa não encontrada');
    }
    
    this.tasks.splice(taskIndex, 1);
    this.saveData();
    return true;
  }
  
  // Obter tarefas do usuário atual com filtros
  getTasks(filters = {}) {
    if (!this.currentUser) {
      throw new Error('Usuário não autenticado');
    }
    
    let userTasks = this.tasks.filter(task => task.userId === this.currentUser.id);
    
    // Aplicar filtros
    if (filters.status) {
      userTasks = userTasks.filter(task => task.status === filters.status);
    }
    
    if (filters.priority) {
      userTasks = userTasks.filter(task => task.priority === filters.priority);
    }
    
    // Aplicar ordenação
    if (filters.sortBy) {
      userTasks.sort((a, b) => {
        if (filters.sortBy === 'title') {
          return a.title.localeCompare(b.title);
        } else if (filters.sortBy === 'priority') {
          const priorityOrder = { alta: 0, media: 1, baixa: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        } else if (filters.sortBy === 'due_date') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        } else {
          // Default: created_at
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
      });
    }
    
    return userTasks;
  }
  
  // Obter estatísticas
  getStats() {
    if (!this.currentUser) {
      throw new Error('Usuário não autenticado');
    }
    
    const userTasks = this.tasks.filter(task => task.userId === this.currentUser.id);
    
    return {
      total: userTasks.length,
      completed: userTasks.filter(task => task.status === 'concluida').length,
      pending: userTasks.filter(task => task.status === 'pendente').length,
      inProgress: userTasks.filter(task => task.status === 'em_andamento').length
    };
  }
}

// Inicializar o gerenciador de dados
const db = new TaskManagerDB();

// Estado da aplicação
let currentView = 'tasks';
let currentEditingTask = null;
let currentPage = 1;
const tasksPerPage = 6;

// Elementos DOM
const authContainer = document.getElementById('authContainer');
const appContainer = document.getElementById('appContainer');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');
const logoutBtn = document.getElementById('logoutBtn');
const themeToggle = document.getElementById('themeToggle');
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const navLinks = document.querySelectorAll('.nav-link');
const tasksView = document.getElementById('tasksView');
const statsView = document.getElementById('statsView');
const tasksList = document.getElementById('tasksList');
const newTaskBtn = document.getElementById('newTaskBtn');
const taskModal = document.getElementById('taskModal');
const taskForm = document.getElementById('taskForm');
const modalTitle = document.getElementById('modalTitle');
const closeModal = document.getElementById('closeModal');
const cancelTask = document.getElementById('cancelTask');
const statusFilter = document.getElementById('statusFilter');
const priorityFilter = document.getElementById('priorityFilter');
const sortFilter = document.getElementById('sortFilter');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');

// Funções de utilidade
function showAlert(message, type = 'error', duration = 3000) {
  const alertContainer = document.getElementById('alertContainer');
  const alert = document.createElement('div');
  alert.className = `alert alert-${type} show`;
  alert.textContent = message;
  
  alertContainer.appendChild(alert);
  
  setTimeout(() => {
    alert.classList.remove('show');
    setTimeout(() => {
      alertContainer.removeChild(alert);
    }, 300);
  }, duration);
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}

function getStatusLabel(status) {
  const statusMap = {
    pendente: 'Pendente',
    em_andamento: 'Em Andamento',
    concluida: 'Concluída'
  };
  return statusMap[status] || status;
}

function getPriorityLabel(priority) {
  const priorityMap = {
    baixa: 'Baixa',
    media: 'Média',
    alta: 'Alta'
  };
  return priorityMap[priority] || priority;
}

function getInitials(name) {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

// Funções de interface
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

function showAuth() {
  authContainer.style.display = 'flex';
  appContainer.style.display = 'none';
}

function showApp() {
  authContainer.style.display = 'none';
  appContainer.style.display = 'block';
  
  // Atualizar informações do usuário
  if (db.currentUser) {
    userAvatar.textContent = getInitials(db.currentUser.username);
    userName.textContent = db.currentUser.username;
  }
  
  // Carregar tarefas e estatísticas
  loadTasks();
  updateStats();
}

function switchView(view) {
  currentView = view;
  
  // Atualizar navegação
  navLinks.forEach(link => {
    if (link.dataset.view === view) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
  
  // Mostrar view correta
  if (view === 'tasks') {
    tasksView.style.display = 'block';
    statsView.style.display = 'none';
  } else if (view === 'stats') {
    tasksView.style.display = 'none';
    statsView.style.display = 'block';
    updateStats();
  }
}

function showTaskModal(isEdit = false) {
  modalTitle.textContent = isEdit ? 'Editar Tarefa' : 'Nova Tarefa';
  taskModal.classList.add('active');
  
  if (!isEdit) {
    taskForm.reset();
    document.getElementById('taskStatus').value = 'pendente';
    document.getElementById('taskPriority').value = 'media';
    
    // Definir data mínima para hoje
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('taskDueDate').min = today;
  }
}

function hideTaskModal() {
  taskModal.classList.remove('active');
  currentEditingTask = null;
}

function loadTasks() {
  const filters = {
    status: statusFilter.value,
    priority: priorityFilter.value,
    sortBy: sortFilter.value
  };
  
  try {
    const tasks = db.getTasks(filters);
    renderTasks(tasks);
  } catch (error) {
    showAlert(error.message);
  }
}

function renderTasks(tasks) {
  // Calcular paginação
  const totalPages = Math.ceil(tasks.length / tasksPerPage);
  const startIndex = (currentPage - 1) * tasksPerPage;
  const endIndex = startIndex + tasksPerPage;
  const paginatedTasks = tasks.slice(startIndex, endIndex);
  
  // Atualizar informações de paginação
  pageInfo.textContent = `Página ${currentPage} de ${totalPages || 1}`;
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage >= totalPages;
  
  // Limpar lista
  tasksList.innerHTML = '';
  
  if (paginatedTasks.length === 0) {
    tasksList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-tasks fa-3x"></i>
        <p>Nenhuma tarefa encontrada</p>
        <button id="emptyStateBtn" class="btn btn-primary">
          <i class="fas fa-plus"></i> Criar Tarefa
        </button>
      </div>
    `;
    
    document.getElementById('emptyStateBtn').addEventListener('click', () => {
      showTaskModal(false);
    });
    
    return;
  }
  
  // Renderizar tarefas
  paginatedTasks.forEach(task => {
    const taskCard = document.createElement('div');
    taskCard.className = 'task-card';
    
    const dueDate = task.dueDate ? formatDate(task.dueDate) : 'Sem prazo';
    
    taskCard.innerHTML = `
      <div class="task-header">
        <div class="task-title">${task.title}</div>
        <div class="task-actions">
          <button class="btn btn-icon edit-task" data-id="${task.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-icon delete-task" data-id="${task.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div class="task-meta">
        <span class="task-status status-${task.status}">${getStatusLabel(task.status)}</span>
        <span class="task-priority priority-${task.priority}">${getPriorityLabel(task.priority)}</span>
        <span class="task-date"><i class="far fa-calendar-alt"></i> ${dueDate}</span>
      </div>
      ${task.description ? `<p class="task-description">${task.description}</p>` : ''}
    `;
    
    tasksList.appendChild(taskCard);
    
    // Adicionar event listeners
    taskCard.querySelector('.edit-task').addEventListener('click', () => {
      editTask(task.id);
    });
    
    taskCard.querySelector('.delete-task').addEventListener('click', () => {
      deleteTask(task.id);
    });
  });
}

function editTask(taskId) {
  try {
    const tasks = db.getTasks();
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) {
      throw new Error('Tarefa não encontrada');
    }
    
    currentEditingTask = task;
    
    // Preencher formulário
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description || '';
    document.getElementById('taskStatus').value = task.status;
    document.getElementById('taskPriority').value = task.priority;
    
    if (task.dueDate) {
      document.getElementById('taskDueDate').value = new Date(task.dueDate).toISOString().split('T')[0];
    } else {
      document.getElementById('taskDueDate').value = '';
    }
    
    showTaskModal(true);
  } catch (error) {
    showAlert(error.message);
  }
}

function deleteTask(taskId) {
  if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
    try {
      db.deleteTask(taskId);
      loadTasks();
      updateStats();
      showAlert('Tarefa excluída com sucesso', 'success');
    } catch (error) {
      showAlert(error.message);
    }
  }
}

function updateStats() {
  try {
    const stats = db.getStats();
    
    document.getElementById('statTotal').textContent = stats.total;
    document.getElementById('statCompleted').textContent = stats.completed;
    document.getElementById('statPending').textContent = stats.pending;
    document.getElementById('statProgress').textContent = stats.inProgress;
  } catch (error) {
    showAlert(error.message);
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Carregar tema
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
  
  // Verificar se há usuário logado
  if (db.currentUser) {
    showApp();
  } else {
    showAuth();
  }
  
  // Adicionar dados de demonstração se não houver usuários
  if (db.users.length === 0) {
    try {
      db.registerUser('Usuário Demo', 'demo@example.com', 'senha123');
      
      // Fazer login com o usuário demo
      db.loginUser('demo@example.com', 'senha123');
      
      // Adicionar algumas tarefas de exemplo
      db.createTask(
        'Completar relatório mensal',
        'Finalizar o relatório de vendas do mês de junho',
        'pendente',
        'alta',
        new Date(new Date().setDate(new Date().getDate() + 2))
      );
      
      db.createTask(
        'Reunião com equipe',
        'Discutir os novos projetos e distribuir tarefas',
        'em_andamento',
        'media',
        new Date(new Date().setDate(new Date().getDate() + 1))
      );
      
      db.createTask(
        'Atualizar site',
        'Publicar novos conteúdos e