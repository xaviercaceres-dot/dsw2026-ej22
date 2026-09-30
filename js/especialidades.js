
const SPECIALTY_ICONS = [
  { match: "cardio", icon: "fa-solid fa-heart-pulse" },
  { match: "neuro", icon: "fa-solid fa-brain" },
  { match: "derma", icon: "fa-solid fa-hand-dots" },
  { match: "pedia", icon: "fa-solid fa-baby" },
  { match: "trauma", icon: "fa-solid fa-bone" },
  { match: "oftalmo", icon: "fa-solid fa-eye" },
  { match: "odonto", icon: "fa-solid fa-tooth" },
  { match: "psico", icon: "fa-solid fa-head-side-virus" },
  { match: "psiqui", icon: "fa-solid fa-head-side-virus" },
  { match: "nutri", icon: "fa-solid fa-apple-whole" },
  { match: "gine", icon: "fa-solid fa-person-pregnant" },
  { match: "neumo", icon: "fa-solid fa-lungs" },
];

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("specialty-table-body");
  const searchInput = document.getElementById("search-specialty");
  const emptyState = document.getElementById("specialty-empty-state");
  const emptyText = document.getElementById("specialty-empty-text");
  const toast = document.getElementById("specialty-toast");

  const summaryTotal = document.getElementById("summary-total");
  const summaryTotalNote = document.getElementById("summary-total-note");
  const summaryNew = document.getElementById("summary-new");
  const summaryNewNames = document.getElementById("summary-new-names");

  showCreatedToast();
  render();

  
  searchInput.addEventListener("input", render);

  
  tableBody.addEventListener("click", (event) => {
    const deleteBtn = event.target.closest("[data-action='delete']");
    if (!deleteBtn) return;

    const { id, name } = deleteBtn.dataset;
    if (confirm(`¿Eliminar la especialidad "${name}"?`)) {
      SpecialtyStore.remove(id);
      render();
    }
  });

  function render() {
    const term = searchInput.value.trim();
    const specialties = term
      ? SpecialtyStore.search(term)
      : SpecialtyStore.getAll();

    tableBody.innerHTML = "";
    specialties.forEach((specialty) =>
      tableBody.appendChild(createRow(specialty)),
    );

    renderEmptyState(specialties.length, term);
    renderSummary();
  }

  function renderEmptyState(visibleCount, term) {
    emptyState.hidden = visibleCount > 0;
    if (visibleCount > 0) return;

    if (term) {
      emptyText.textContent = `No se encontraron especialidades que coincidan con "${term}".`;
    } else {
      emptyText.innerHTML = "";
      emptyText.append("No hay especialidades registradas. ");
      const link = document.createElement("a");
      link.href = "especialidad-crear.html";
      link.textContent = "Agregar la primera";
      emptyText.appendChild(link);
    }
  }

  function renderSummary() {
    const all = SpecialtyStore.getAll();
    const newThisMonth = all.filter((specialty) =>
      isCurrentMonth(specialty.createdAt),
    );

    summaryTotal.textContent = all.length;
    summaryTotalNote.textContent = `${all.length === 1 ? "registrada" : "registradas"} en el sistema`;
    summaryNew.textContent = String(newThisMonth.length).padStart(2, "0");
    summaryNewNames.textContent = newThisMonth.length
      ? newThisMonth.map((specialty) => specialty.name).join(", ")
      : "Sin altas este mes";
  }

  function createRow(specialty) {
    const row = document.createElement("tr");

    // Nombre + ícono
    const nameCell = document.createElement("td");
    const nameWrapper = document.createElement("div");
    nameWrapper.className = "specialty-name-cell";
    const icon = document.createElement("span");
    icon.className = "specialty-icon";
    icon.innerHTML = `<i class="${getIcon(specialty.name)}" aria-hidden="true"></i>`;
    const name = document.createElement("span");
    name.textContent = specialty.name;
    nameWrapper.append(icon, name);
    nameCell.appendChild(nameWrapper);

    // Descripción
    const descriptionCell = document.createElement("td");
    const description = document.createElement("p");
    description.className = "specialty-description";
    if (specialty.description) {
      description.textContent = specialty.description;
    } else {
      description.textContent = "Sin descripción";
      description.classList.add("is-empty");
    }
    descriptionCell.appendChild(description);

    // Estado
    const statusCell = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = `badge ${specialty.active ? "status-active" : "status-inactive"}`;
    badge.textContent = specialty.active ? "Activa" : "Inactiva";
    statusCell.appendChild(badge);

    // Acciones
    const actionsCell = document.createElement("td");
    actionsCell.className = "col-actions";
    const actions = document.createElement("div");
    actions.className = "row-actions";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "icon-btn";
    editBtn.setAttribute("aria-disabled", "true");
    editBtn.title = "Edición disponible en la próxima entrega";
    editBtn.setAttribute("aria-label", `Editar ${specialty.name} (no disponible)`);
    editBtn.innerHTML = '<i class="fa-solid fa-pencil" aria-hidden="true"></i>';

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "icon-btn icon-btn-danger";
    deleteBtn.dataset.action = "delete";
    deleteBtn.dataset.id = specialty.id;
    deleteBtn.dataset.name = specialty.name;
    deleteBtn.title = "Eliminar";
    deleteBtn.setAttribute("aria-label", `Eliminar ${specialty.name}`);
    deleteBtn.innerHTML = '<i class="fa-regular fa-trash-can" aria-hidden="true"></i>';

    actions.append(editBtn, deleteBtn);
    actionsCell.appendChild(actions);

    row.append(nameCell, descriptionCell, statusCell, actionsCell);
    return row;
  }

  // Mensaje luego de crear una especialidad (viene de especialidad-crear.html)
  function showCreatedToast() {
    const params = new URLSearchParams(window.location.search);
    const createdName = params.get("creada");
    if (!createdName) return;

    toast.innerHTML = '<i class="fa-solid fa-circle-check" aria-hidden="true"></i>';
    toast.append(` Especialidad "${createdName}" creada correctamente.`);
    toast.hidden = false;
    history.replaceState(null, "", window.location.pathname);
    setTimeout(() => (toast.hidden = true), 5000);
  }
});

function getIcon(name) {
  const normalized = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
  const found = SPECIALTY_ICONS.find((item) => normalized.includes(item.match));
  return found ? found.icon : "fa-solid fa-stethoscope";
}

function isCurrentMonth(isoDate) {
  if (!isoDate) return false;
  const date = new Date(isoDate);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
  );
}