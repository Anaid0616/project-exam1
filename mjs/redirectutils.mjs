// redirectUtils.mjs
export function redirectToHome() {
  // Detect if running on localhost or production
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (isLocalhost) {
    // Use absolute path for local development
    window.location.href = "/index.html";
  } else {
    // Use relative path for production (e.g., GitHub Pages)
    const basePath =
      window.location.origin +
      window.location.pathname.replace(/\/[^\/]*$/, "");
    window.location.href = `${basePath}/index.html`;
  }
}
