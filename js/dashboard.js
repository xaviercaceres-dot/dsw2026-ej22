document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menu-btn");
  const panelLateral = document.getElementById("sidebar");
  const logoutBtn = document.getElementById("btn-logout");
  const menuToggleBtn = document.getElementById("btn-toggle-menu");

  if (menuToggleBtn && panelLateral) {
    menuToggleBtn.addEventListener("click", () => {
      panelLateral.classList.toggle("mostrar");
    });
  }

  // Lógica de Cerrar Sesión
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }
});
