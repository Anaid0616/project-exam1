import { getAccessToken, removeAccessToken } from "./accesstoken.mjs";
import { showToast } from "./toast.mjs";
import { hamburgerMenu } from "./hamburger.mjs";

export function setupNavbar() {
  // Hamburger menu initialization
  hamburgerMenu();

  const isLoggedIn = !!getAccessToken(); // Check if the user is logged in by checking for a valid token

  const loginLink = document.getElementById("login-link");
  const registerLink = document.getElementById("register-link");

  // Check if the user has just logged in/out
  const justLoggedIn = localStorage.getItem("justLoggedIn");
  const justLoggedOut = localStorage.getItem("justLoggedOut");

  if (isLoggedIn) {
    // User is logged in, change "Login" to "Logout"
    if (loginLink) {
      loginLink.textContent = "Logout"; // Change the text to "Logout"
      loginLink.href = "#"; // Prevent navigating to the login page
      loginLink.addEventListener("click", handleLogout); // Attach click event for logout
    }

    // Show the login toast only once, immediately after login
    if (justLoggedIn) {
      showToast("You are now logged in!");
      localStorage.removeItem("justLoggedIn");
    }

    // Optionally hide the "Register" link if the user is logged in
    if (registerLink) {
      registerLink.style.display = "none";
    } else {
      // User is not logged in, keep "Login" and "Register" as they are
      if (loginLink) {
        loginLink.textContent = "Login";
        loginLink.href = "../account/login.html";

        // Show the logout toast only if the user has just logged out
        if (justLoggedOut) {
          showToast("You have been logged out successfully!");
          localStorage.removeItem("justLoggedOut");
        }
      }

      if (registerLink) {
        registerLink.style.display = "block";
      }
    }
  }

  function handleLogout(event) {
    event.preventDefault();
    removeAccessToken();
    localStorage.removeItem("blogName"); // Clear the stored blog name on logout
    localStorage.setItem("justLoggedOut", "true");
    window.location.href = "./index.html";
  }
}
