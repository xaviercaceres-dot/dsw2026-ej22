
document.addEventListener("DOMContentLoaded", () => {
  const specialtyCount = document.getElementById("specialty-count");
  const doctorSearchInput = document.getElementById("search-doctor");
  const doctorRows = document.querySelectorAll("#doctor-table-body tr");
  const doctorEmptyState = document.getElementById("doctor-empty-state");
  const doctorResults = document.getElementById("doctor-results");

  // KPI: cantidad de especialidades activas guardadas en LocalStorage
  const activeSpecialties = SpecialtyStore.getAll().filter(
    (specialty) => specialty.active,
  );
  specialtyCount.textContent = activeSpecialties.length;

  // Filtro del directorio de doctores por nombre
  doctorSearchInput.addEventListener("input", () => {
    const term = doctorSearchInput.value.trim().toLowerCase();
    let visible = 0;

    doctorRows.forEach((row) => {
      const name = row.querySelector(".doctor-name").textContent.toLowerCase();
      const matches = name.includes(term);
      row.hidden = !matches;
      if (matches) visible++;
    });

    doctorEmptyState.hidden = visible > 0;
    doctorResults.textContent = visible
      ? `Mostrando 1 a ${visible} de ${visible} resultados`
      : "Mostrando 0 resultados";
  });
  });
