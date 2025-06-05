document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.querySelector('#task-form');
  const taskList = document.querySelector('#task-list');

  if (taskForm) {
    taskForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(taskForm);
      const task = Object.fromEntries(formData);

      try {
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie('jwt')}`
          },
          body: JSON.stringify(task)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to create task');

        window.location.href = '/tasks';
      } catch (error) {
        alert(error.message);
      }
    });
  }

  if (taskList) {
    // Fetch and display tasks
    const loadTasks = async () => {
      try {
        const response = await fetch('/api/tasks', {
          headers: { 'Authorization': `Bearer ${getCookie('jwt')}` }
        });
        const tasks = await response.json();
        taskList.innerHTML = tasks.map(task => `
          <li>
            <h3>${task.title}</h3>
            <p>${task.description || ''}</p>
            <p>Status: ${task.status}</p>
            <p>Priority: ${task.priority}</p>
            <p>Due: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>
            <a href="/tasks/${task.id}/edit">Edit</a>
            <button onclick="deleteTask(${task.id})">Delete</button>
          </li>
        `).join('');
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };

    loadTasks();
  }

  window.deleteTask = async (taskId) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await fetch(`/api/tasks/${taskId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${getCookie('jwt')}` }
        });

        if (!response.ok) throw new Error('Failed to delete task');
        window.location.reload();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return '';
  }
});