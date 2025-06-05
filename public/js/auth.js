document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('#login-form');
  const registerForm = document.querySelector('#register-form');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = loginForm.querySelector('#email').value;
      const password = loginForm.querySelector('#password').value;

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Login failed');

        window.location.href = '/tasks';
      } catch (error) {
        alert(error.message);
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = registerForm.querySelector('#name').value;
      const email = registerForm.querySelector('#email').value;
      const password = registerForm.querySelector('#password').value;

      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Registration failed');

        window.location.href = '/login';
      } catch (error) {
        alert(error.message);
      }
    });
  }
});