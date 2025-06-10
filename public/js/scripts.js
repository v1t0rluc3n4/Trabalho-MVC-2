document.addEventListener('DOMContentLoaded', () => {
  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', currentTheme);
      localStorage.setItem('tm_theme', currentTheme);
    });

    // Apply saved theme
    const savedTheme = localStorage.getItem('tm_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  // Filters
  const statusFilter = document.getElementById('statusFilter');
  const priorityFilter = document.getElementById('priorityFilter');
  const sortFilter = document.getElementById('sortFilter');

  if (statusFilter && priorityFilter && sortFilter) {
    [statusFilter, priorityFilter, sortFilter].forEach(filter => {
      filter.addEventListener('change', () => {
        const params = new URLSearchParams({
          status: statusFilter.value,
          priority: priorityFilter.value,
          sort: sortFilter.value,
        });
        window.location.href = `/tasks?${params.toString()}`;
      });
    });
  }

  // Auto-dismiss alerts
  const alerts = document.querySelectorAll('.alert.show');
  alerts.forEach(alert => {
    setTimeout(() => {
      alert.classList.remove('show');
      setTimeout(() => alert.remove(), 300);
    }, 5000);
  });

  // Modal close on click outside
  const modal = document.getElementById('taskModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        window.location.href = '/tasks';
      }
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      window.location.href = '/tasks';
    }
  });
});