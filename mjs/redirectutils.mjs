export function redirectToHome() {
  const basePath = window.location.pathname.includes("/project-exam1/")
    ? window.location.origin + "/project-exam1/"
    : window.location.origin + "/";
  window.location.href = `${basePath}index.html`;
}
