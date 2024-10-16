import { LOGIN_API_ENDPOINT } from "./api.mjs";
import { storeAccessToken } from "./accesstoken.mjs";
import { setupNavbar } from "./navbar.mjs"; // Import the navbar setup function
import { showToast } from "./toast.mjs"; // Import the toast function

// Set up the navbar for login/logout behavior
setupNavbar();

const loginForm = document.querySelector("#login-form");
const emailInput = document.querySelector("#email-input");
const passwordInput = document.querySelector("#password-input");

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Validation check for empty fields
    if (!email || !password) {
      showToast("Please fill out all fields.", "error");
      return;
    }

    // Check if the email ends with '@stud.noroff.no'
    const emailPattern = /^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/;
    if (!emailPattern.test(email)) {
      showToast("Please enter a valid @stud.noroff.no email address.", "error");
      return;
    }

    loginUser(email, password);
  });
}

async function loginUser(email, password) {
  try {
    const customOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    };

    const response = await fetch(LOGIN_API_ENDPOINT, customOptions);
    const json = await response.json();

    if (response.ok) {
      const accessToken = json.data.accessToken;
      storeAccessToken(accessToken);
      console.log("Registration response:", json);

      localStorage.setItem("blogName", json.data.name);

      localStorage.setItem("justLoggedIn", "true");
      showToast("Login successful!", "success");

      setTimeout(() => {
        window.location.href = "../index.html";
      }, 1500);
    } else {
      // Handle login error (e.g., invalid credentials)
      const errorMessage =
        json.errors && json.errors.length > 0
          ? json.errors[0].message
          : "Login failed. Please check your credentials.";

      showToast(`Error: ${errorMessage}`, "error");
    }
  } catch (error) {
    console.error("Login failed:", error);
    showToast("An error occurred during login. Please try again.", "error");
  }
}

function getBlogName() {
  const blogName = localStorage.getItem("blogName");
  if (!blogName) {
    console.error("Blog name not found. Redirecting to login.");
    window.location.href = "./login.html";
    return null;
  }
  return blogName;
}
