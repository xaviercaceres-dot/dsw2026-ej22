const MOBILE_QUERY = window.matchMedia("(max-width: 767px)");

document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const menuBtn = document.getElementById("btn-toggle-menu");
  const overlay = document.getElementById("sidebar-overlay");
  const logoutBtn = document.getElementById("btn-logout");

  function isMobile() {
    return MOBILE_QUERY.matches;
  }

  function openMenu() {
    sidebar.classList.add("open");
    overlay.hidden = false;
    menuBtn.setAttribute("aria-expanded", "true");
    menuBtn.setAttribute("aria-label", "Cerrar menú");
  }

  function closeMenu() {
    sidebar.classList.remove("open");
    overlay.hidden = true;
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Abrir menú");
  }

  if (sidebar && menuBtn && overlay) {
    // El clic en el botón solo tiene efecto en resoluciones móviles
    menuBtn.addEventListener("click", () => {
      if (!isMobile()) return;
      if (sidebar.classList.contains("open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    overlay.addEventListener("click", closeMenu);

    // Al elegir una opción del menú en móvil, se cierra
    sidebar.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => {
        if (isMobile()) closeMenu();
      }),
    );

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && sidebar.classList.contains("open")) {
        closeMenu();
        menuBtn.focus();
      }
    });

    // Si se agranda la ventana a escritorio, se limpia el estado móvil
    MOBILE_QUERY.addEventListener("change", (event) => {
      if (!event.matches) closeMenu();
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }
});
