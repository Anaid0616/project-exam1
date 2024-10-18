// redirectUtils.mjs
export function redirectToHome() {
  // Detect if we are on GitHub Pages (e.g., "username.github.io")
  const isGithubPages = window.location.hostname.includes("github.io");

  // Get the current pathname to check if it's a subdirectory
  const currentPath = window.location.pathname;

  // Check if we are on GitHub Pages or a subdirectory path
  const isSubDirectory = currentPath.startsWith("/repository-name"); // Replace 'repository-name' with your actual repository name

  // Use relative path if on GitHub Pages or a subdirectory
  const homePath =
    isGithubPages || isSubDirectory ? "./index.html" : "/index.html";

  // Redirect
  window.location.href = homePath;
}
