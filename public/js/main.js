document.addEventListener('DOMContentLoaded', () => {
  // Flash message auto-dismiss
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach(alert => {
    setTimeout(() => {
      alert.style.display = 'none';
    }, 5000);
  });
});