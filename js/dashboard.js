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

  let specialties = loadSpecialties();

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
    specialtyTableBody.innerHTML = "";
    specialtyEmptyState.hidden = specialties.length > 0;

    specialties.forEach((specialty) => {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.textContent = specialty;
      row.appendChild(cell);
      specialtyTableBody.appendChild(row);
    });

    specialtyCount.textContent = specialties.length;
  }

  if (specialtyTableBody && specialtyEmptyState && specialtyCount) {
    renderSpecialties();
  }
});
