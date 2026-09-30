
const NAME_MIN = 3;
const NAME_MAX = 100;
const DESCRIPTION_MIN = 10;
const DESCRIPTION_MAX = 100;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("specialty-form");
  const nameInput = document.getElementById("specialty-name");
  const descriptionInput = document.getElementById("specialty-description");
  const statusSelect = document.getElementById("specialty-status");
  const nameError = document.getElementById("specialty-name-error");
  const descriptionError = document.getElementById("specialty-description-error");
  const counter = document.getElementById("specialty-description-counter");

  nameInput.focus();

  descriptionInput.addEventListener("input", () => {
    counter.textContent = `${descriptionInput.value.length}/${DESCRIPTION_MAX}`;
    clearError(descriptionInput, descriptionError);
  });

  nameInput.addEventListener("input", () => clearError(nameInput, nameError));

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const description = descriptionInput.value.trim();

    const nameMessage = validateName(name);
    const descriptionMessage = validateDescription(description);

    setError(nameInput, nameError, nameMessage);
    setError(descriptionInput, descriptionError, descriptionMessage);

    if (nameMessage) {
      nameInput.focus();
      return;
    }
    if (descriptionMessage) {
      descriptionInput.focus();
      return;
    }

    // Esto agrega al array de especialidades en LocalStorage
    SpecialtyStore.add({
      name,
      description,
      active: statusSelect.value === "active",
    });

    window.location.href = `especialidades.html?creada=${encodeURIComponent(name)}`;
  });

  function validateName(name) {
    if (!name) return "El nombre es obligatorio.";
    if (name.length < NAME_MIN || name.length > NAME_MAX) {
      return `El nombre debe tener entre ${NAME_MIN} y ${NAME_MAX} caracteres.`;
    }
    if (SpecialtyStore.existsByName(name)) {
      return "Ya existe una especialidad con ese nombre.";
    }
    return "";
  }

  function validateDescription(description) {
    if (!description) return "La descripción es obligatoria.";
    if (
      description.length < DESCRIPTION_MIN ||
      description.length > DESCRIPTION_MAX
    ) {
      return `La descripción debe tener entre ${DESCRIPTION_MIN} y ${DESCRIPTION_MAX} caracteres.`;
    }
    return "";
  }

  function setError(input, errorElement, message) {
    if (message) {
      errorElement.textContent = message;
      errorElement.hidden = false;
      input.setAttribute("aria-invalid", "true");
    } else {
      clearError(input, errorElement);
    }
  }

  function clearError(input, errorElement) {
    errorElement.hidden = true;
    input.removeAttribute("aria-invalid");
  }
});
