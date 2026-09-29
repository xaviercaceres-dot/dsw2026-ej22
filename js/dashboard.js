const SPECIALTIES_STORAGE_KEY = "specialties";

document.addEventListener("DOMContentLoaded", () => {
  const panelLateral = document.getElementById("sidebar");
  const logoutBtn = document.getElementById("btn-logout");
  const menuToggleBtn = document.getElementById("btn-toggle-menu");
  const specialtyForm = document.getElementById("specialty-form");
  const specialtyNameInput = document.getElementById("specialty-name");
  const specialtyTableBody = document.getElementById("specialty-table-body");
  const specialtyEmptyState = document.getElementById("specialty-empty-state");
  const specialtyCount = document.getElementById("specialty-count");
  const specialtySection = document.getElementById("specialties-section");
  const specialtySearchInput = document.getElementById("search-specialty");
  const addSpecialtyButton = document.getElementById(
    "btn-agregar-especialidad",
  );
  const specialtyNavLink = document.querySelector(
    'a[href="#specialties-section"]',
  );
  const navigationLinks = document.querySelectorAll(".nav-links a");

  let specialties = loadSpecialties();
  let specialtySearchTerm = "";

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

  if (specialtyForm) {
    specialtyForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const specialtyName = specialtyNameInput.value.trim();

      if (!specialtyName) {
        alert("Ingrese el nombre de la especialidad.");
        specialtyNameInput.focus();
        return;
      }

      const alreadyExists = specialties.some(
        (specialty) => specialty.toLowerCase() === specialtyName.toLowerCase(),
      );

      if (alreadyExists) {
        alert("La especialidad ya está registrada.");
        specialtyNameInput.focus();
        return;
      }

      specialties.push(specialtyName);
      saveSpecialties(specialties);
      renderSpecialties();
      specialtyForm.reset();
      specialtyNameInput.focus();
    });
  }

  if (specialtySearchInput) {
    specialtySearchInput.addEventListener("input", () => {
      specialtySearchTerm = specialtySearchInput.value.trim().toLowerCase();
      renderSpecialties();
    });
  }

  if (specialtyNavLink) {
    specialtyNavLink.addEventListener("click", (event) => {
      event.preventDefault();
      focusSpecialtiesSection();
      setActiveNavigationLink(specialtyNavLink);
    });
  }

  if (addSpecialtyButton) {
    addSpecialtyButton.addEventListener("click", () => {
      focusSpecialtiesSection();
      specialtyNameInput.focus();
    });
  }

  function loadSpecialties() {
    try {
      const storedSpecialties = localStorage.getItem(SPECIALTIES_STORAGE_KEY);
      const parsedSpecialties = storedSpecialties
        ? JSON.parse(storedSpecialties)
        : [];

      return Array.isArray(parsedSpecialties)
        ? parsedSpecialties.filter(
            (specialty) => typeof specialty === "string" && specialty.trim(),
          )
        : [];
    } catch (error) {
      return [];
    }
  }

  function saveSpecialties(specialtiesToSave) {
    localStorage.setItem(
      SPECIALTIES_STORAGE_KEY,
      JSON.stringify(specialtiesToSave),
    );
  }

  function renderSpecialties() {
    const visibleSpecialties = specialties.filter((specialty) =>
      specialty.toLowerCase().includes(specialtySearchTerm),
    );

    specialtyTableBody.innerHTML = "";
    specialtyEmptyState.hidden = visibleSpecialties.length > 0;
    specialtyEmptyState.textContent = specialtySearchTerm
      ? "No se encontraron especialidades."
      : "No hay especialidades registradas.";

    visibleSpecialties.forEach((specialty) => {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.textContent = specialty;
      row.appendChild(cell);
      specialtyTableBody.appendChild(row);
    });

    specialtyCount.textContent = specialties.length;
  }

  function focusSpecialtiesSection() {
    specialtySection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function setActiveNavigationLink(activeLink) {
    navigationLinks.forEach((link) => link.classList.remove("active"));
    activeLink.classList.add("active");
  }

  if (specialtyTableBody && specialtyEmptyState && specialtyCount) {
    renderSpecialties();
  }
});
