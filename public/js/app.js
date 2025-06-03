// JavaScript principal do Gerenciador de Tarefas

// Aguardar carregamento do DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('Gerenciador de Tarefas carregado!');
    initializeApp();
});

// Inicializar aplicação
function initializeApp() {
    setupEventListeners();
    setupTooltips();
    setupFormValidation();
}

// Configurar event listeners globais
function setupEventListeners() {
    // Confirmação para exclusão de tarefas
    const deleteButtons = document.querySelectorAll('[data-action="delete"]');
    deleteButtons.forEach(button => {
        button.addEventListener('click', confirmDelete);
    });
    
    // Auto-hide para alertas
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        if (alert.classList.contains('alert-success')) {
            setTimeout(() => {
                fadeOut(alert);
            }, 5000);
        }
    });
}

// Configurar tooltips do Bootstrap
function setupTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Configurar validação de formulários
function setupFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });
}

// Funções utilitárias

// Confirmar exclusão
function confirmDelete(event) {
    event.preventDefault();
    const itemName = event.target.dataset.itemName || 'este item';
    
    if (confirm(`Tem certeza que deseja excluir ${itemName}?`)) {
        // Se for um formulário, submeter
        const form = event.target.closest('form');
        if (form) {
            form.submit();
        } else {
            // Se for um link, navegar
            window.location.href = event.target.href;
        }
    }
}

// Fade out de elementos
function fadeOut(element, callback) {
    element.style.transition = 'opacity 0.5s ease';
    element.style.opacity = '0';
    
    setTimeout(() => {
        element.style.display = 'none';
        if (callback) callback();
    }, 500);
}

// Fade in de elementos
function fadeIn(element, display = 'block') {
    element.style.display = display;
    element.style.opacity = '0';
    element.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        element.style.opacity = '1';
    }, 10);
}

// Mostrar loading
function showLoading(element) {
    element.classList.add('loading');
    element.disabled = true;
}

// Esconder loading
function hideLoading(element) {
    element.classList.remove('loading');
    element.disabled = false;
}

// Toast notifications
function showToast(message, type = 'info') {
    const toastContainer = getOrCreateToastContainer();
    
    const toastHtml = `
        <div class="toast align-items-center text-bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    
    const toastElement = toastContainer.lastElementChild;
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
    
    // Remover elemento após esconder
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

// Obter ou criar container de toasts
function getOrCreateToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        container.style.zIndex = '1100';
        document.body.appendChild(container);
    }
    return container;
}

// Funções para API
async function apiRequest(url, options = {}) {
    try {
        showLoading(document.body);
        
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || `Erro ${response.status}`);
        }
        
        return data;
    } catch (error) {
        console.error('Erro na requisição:', error);
        showToast(`Erro: ${error.message}`, 'danger');
        throw error;
    } finally {
        hideLoading(document.body);
    }
}

// Criar tarefa via API
async function createTask(taskData) {
    try {
        const task = await apiRequest('/tasks/api', {
            method: 'POST',
            body: JSON.stringify(taskData)
        });
        
        showToast('Tarefa criada com sucesso!', 'success');
        return task;
    } catch (error) {
        console.error('Erro ao criar tarefa:', error);
    }
}

// Atualizar tarefa via API
async function updateTask(taskId, taskData) {
    try {
        const task = await apiRequest(`/tasks/api/${taskId}`, {
            method: 'PUT',
            body: JSON.stringify(taskData)
        });
        
        showToast('Tarefa atualizada com sucesso!', 'success');
        return task;
    } catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
    }
}

// Excluir tarefa via API
async function deleteTask(taskId) {
    try {
        await apiRequest(`/tasks/api/${taskId}`, {
            method: 'DELETE'
        });
        
        showToast('Tarefa excluída com sucesso!', 'success');
        return true;
    } catch (error) {
        console.error('Erro ao excluir tarefa:', error);
        return false;
    }
}

// Buscar tarefas via API
async function fetchTasks() {
    try {
        const tasks = await apiRequest('/tasks/api');
        return tasks;
    } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
        return [];
    }
}

// Debounce function para otimizar buscas
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Função para filtrar tarefas com debounce
const debouncedFilter = debounce(function(filterValue) {
    filterTasks(filterValue);
}, 300);

// Filtrar tarefas
function filterTasks(filterValue) {
    const taskCards = document.querySelectorAll('.task-card');
    let visibleCount = 0;
    
    taskCards.forEach(card => {
        const title = card.querySelector('.card-title')?.textContent?.toLowerCase() || '';
        const description = card.querySelector('.card-text')?.textContent?.toLowerCase() || '';
        const category = card.querySelector('.text-muted')?.textContent?.toLowerCase() || '';
        
        const searchText = filterValue.toLowerCase();
        const isVisible = title.includes(searchText) || 
                         description.includes(searchText) || 
                         category.includes(searchText);        if (isVisible) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Atualizar contador de tarefas visíveis
    const counter = document.getElementById('tasks-counter');
    if (counter) {
        counter.textContent = `${visibleCount} tarefa${visibleCount !== 1 ? 's' : ''} encontrada${visibleCount !== 1 ? 's' : ''}`;
    }
}

// Configurar filtro de busca
function setupSearchFilter() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            debouncedFilter(event.target.value);
        });
    }
}

// Atualizar interface com lista de tarefas
async function renderTasks() {
    const taskList = document.getElementById('task-list');
    if (!taskList) return;

    try {
        const tasks = await fetchTasks();
        taskList.innerHTML = '';

        if (tasks.length === 0) {
            taskList.innerHTML = '<p class="text-muted">Nenhuma tarefa encontrada.</p>';
            return;
        }

        tasks.forEach(task => {
            const taskCard = createTaskCard(task);
            taskList.appendChild(taskCard);
        });

        // Reaplicar event listeners para botões de exclusão
        setupEventListeners();
        // Atualizar contador
        filterTasks('');
    } catch (error) {
        console.error('Erro ao renderizar tarefas:', error);
        showToast('Erro ao carregar tarefas', 'danger');
    }
}

// Criar card de tarefa
function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'task-card card mb-3';
    card.dataset.taskId = task.id;

    card.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${task.title}</h5>
            <p class="card-text">${task.description || 'Sem descrição'}</p>
            <p class="text-muted">Categoria: ${task.category || 'N/A'}</p>
            <div class="d-flex justify-content-end gap-2">
                <button class="btn btn-sm btn-primary" data-action="edit" data-task-id="${task.id}" data-bs-toggle="modal" data-bs-target="#editTaskModal">Editar</button>
                <button class="btn btn-sm btn-danger" data-action="delete" data-task-id="${task.id}" data-item-name="${task.title}">Excluir</button>
            </div>
        </div>
    `;

    return card;
}

// Configurar modal de edição
function setupEditModal() {
    const editModal = document.getElementById('editTaskModal');
    if (!editModal) return;

    editModal.addEventListener('show.bs.modal', async (event) => {
        const button = event.relatedTarget;
        const taskId = button.dataset.taskId;

        try {
            const task = await apiRequest(`/tasks/api/${taskId}`);
            const form = editModal.querySelector('form');
            
            form.querySelector('#edit-task-id').value = task.id;
            form.querySelector('#edit-task-title').value = task.title;
            form.querySelector('#edit-task-description').value = task.description || '';
            form.querySelector('#edit-task-category').value = task.category || '';
        } catch (error) {
            console.error('Erro ao carregar dados da tarefa:', error);
            showToast('Erro ao carregar tarefa para edição', 'danger');
        }
    });

    // Configurar submit do formulário de edição
    const editForm = editModal.querySelector('form');
    if (editForm) {
        editForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            if (!editForm.checkValidity()) {
                editForm.classList.add('was-validated');
                return;
            }

            const taskId = editForm.querySelector('#edit-task-id').value;
            const taskData = {
                title: editForm.querySelector('#edit-task-title').value,
                description: editForm.querySelector('#edit-task-description').value,
                category: editForm.querySelector('#edit-task-category').value
            };

            try {
                await updateTask(taskId, taskData);
                bootstrap.Modal.getInstance(editModal).hide();
                renderTasks();
            } catch (error) {
                showToast('Erro ao salvar alterações', 'danger');
            }
        });
    }
}

// Configurar formulário de nova tarefa
function setupNewTaskForm() {
    const newTaskForm = document.getElementById('new-task-form');
    if (!newTaskForm) return;

    newTaskForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!newTaskForm.checkValidity()) {
            newTaskForm.classList.add('was-validated');
            return;
        }

        const taskData = {
            title: newTaskForm.querySelector('#new-task-title').value,
            description: newTaskForm.querySelector('#new-task-description').value,
            category: newTaskForm.querySelector('#new-task-category').value
        };

        try {
            await createTask(taskData);
            newTaskForm.reset();
            newTaskForm.classList.remove('was-validated');
            renderTasks();
        } catch (error) {
            showToast('Erro ao criar nova tarefa', 'danger');
        }
    });
}

// Inicializar tudo
function initializeApp() {
    setupEventListeners();
    setupTooltips();
    setupFormValidation();
    setupSearchFilter();
    setupEditModal();
    setupNewTaskForm();
    renderTasks();
}