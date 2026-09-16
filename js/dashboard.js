document.addEventListener("DOMContentLoaded", () => {
  const panelLateral = document.getElementById("sidebar");
  const logoutBtn = document.getElementById("btn-logout");
  const menuToggleBtn = document.getElementById("btn-toggle-menu");

  if (menuToggleBtn && panelLateral) {
    menuToggleBtn.addEventListener("click", function () {
      panelLateral.classList.toggle("open");
    });
  }

  // Lógica de Cerrar Sesión
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }
});
