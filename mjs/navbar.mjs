import { getAccessToken, removeAccessToken } from './accesstoken.mjs';
import { showToast } from './toast.mjs';
import { hamburgerMenu } from './hamburger.mjs';

export function setupNavbar() {
  hamburgerMenu();

  const isLoggedIn = !!getAccessToken();
  const loginLink = document.getElementById('login-link');
  const registerLink = document.getElementById('register-link');

  const justLoggedIn = localStorage.getItem('justLoggedIn');
  const justLoggedOut = localStorage.getItem('justLoggedOut');

  if (isLoggedIn) {
    // logged in
    if (loginLink) {
      loginLink.textContent = 'Logout';
      loginLink.href = '#';
      loginLink.addEventListener('click', handleLogout);
    }
    if (registerLink) {
      registerLink.style.display = 'none';
    }
    if (justLoggedIn) {
      showToast('You are now logged in!');
      localStorage.removeItem('justLoggedIn');
    }
  } else {
    // Logged out
    if (loginLink) {
      loginLink.textContent = 'Login';
      // Reset href and remove previous event listener if any
    }
    if (registerLink) {
      registerLink.style.display = 'block';
    }
    if (justLoggedOut) {
      showToast('You have been logged out successfully!');
      localStorage.removeItem('justLoggedOut');
    }
  }

  function handleLogout(event) {
    event.preventDefault();
    removeAccessToken();
    localStorage.removeItem('blogName');
    localStorage.setItem('justLoggedOut', 'true');

    const homeUrl = `${window.location.origin}/index.html`;
    window.location.href = homeUrl;
  }
}
