import { REGISTER_API_ENDPOINT } from "./api.mjs";
import { setupNavbar } from "./navbar.mjs"; // Import the navbar setup function
import { showToast } from "./toast.mjs";

// Set up the navbar for login/logout behavior
setupNavbar();

const registerForm = document.querySelector("#register-form");
const nameInput = document.querySelector("#name-input");
const emailInput = document.querySelector("#email-input");
const passwordInput = document.querySelector("#password-input");

// 1. Get the input values
// 2. Submit the input values to the API
registerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!name || !email || !password) {
    showToast("Please fill out all fields.", "error");
    return;
  }

  // Check if the email ends with '@stud.noroff.no'
  const emailPattern = /^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/;
  if (!emailPattern.test(email)) {
    showToast("Please enter a valid @stud.noroff.no email address.", "error");
    return;
  }

  registerUser(name, email, password); // Pass values to register function
});

async function registerUser(name, email, password) {
  try {
    const customOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    };

    const response = await fetch(REGISTER_API_ENDPOINT, customOptions);
    const json = await response.json();

    if (response.ok) {
      // If registration is successful
      console.log("User registered successfully:", json);
      showToast("Registration successful!", "success");
      setTimeout(() => {
        window.location.href = "/account/login.html";
      }, 2000); // Add a delay for user to see the toast message
    } else {
      // Handle API errors
      if (json.errors && json.errors.length > 0) {
        const errorMessage = json.errors[0].message;
        showToast(`Registration failed: ${errorMessage}`, "error");
      } else {
        // Generic error handling
        showToast("Registration failed. Please try again.", "error");
      }
    }
  } catch (error) {
    showToast(
      "An error occurred during registration. Please try again.",
      "error"
    );
  }
}
