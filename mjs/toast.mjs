// toast.mjs
export function showToast(message) {
  let toast = document.getElementById("toast");

  // If the toast element doesn't exist, create it dynamically
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.classList.add("toast");
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  // Hide the toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
