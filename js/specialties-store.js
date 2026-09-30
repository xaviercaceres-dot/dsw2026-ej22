const SPECIALTIES_STORAGE_KEY = "specialties";

// Datos iniciales (los del mockup) - solo se cargan la primera vez
const DEFAULT_SPECIALTIES = [
  {
    name: "Cardiología",
    description:
      "Estudio y tratamiento de trastornos del corazón y del sistema circulatorio.",
    active: true,
  },
  {
    name: "Neurología",
    description:
      "Diagnóstico y tratamiento de todas las categorías de afecciones cerebrales.",
    active: true,
  },
  {
    name: "Dermatología",
    description: "Atención integral de enfermedades de la piel, uñas y cabello.",
    active: false,
  },
  {
    name: "Pediatría",
    description: "Cuidado médico de lactantes, niños y adolescentes.",
    active: true,
  },
];

const SpecialtyStore = {
  /** Devuelve todas las especialidades no eliminadas. */
  getAll() {
    return readStorage().filter((specialty) => !specialty.deleted);
  },

  /** Busca por nombre (sin distinguir mayúsculas ni acentos). */
  search(term) {
    const normalizedTerm = normalizeText(term);
    return this.getAll().filter((specialty) =>
      normalizeText(specialty.name).includes(normalizedTerm),
    );
  },

  existsByName(name) {
    const normalizedName = normalizeText(name);
    return this.getAll().some(
      (specialty) => normalizeText(specialty.name) === normalizedName,
    );
  },

  /** Agrega una especialidad al array guardado en LocalStorage. */
  add({ name, description, active }) {
    const specialties = readStorage();
    const newSpecialty = createSpecialty({ name, description, active });
    specialties.push(newSpecialty);
    writeStorage(specialties);
    return newSpecialty;
  },

  /** Baja lógica: marca deleted = true (igual que el backend del TPI). */
  remove(id) {
    const specialties = readStorage();
    const specialty = specialties.find((item) => item.id === id);
    if (!specialty) return false;
    specialty.deleted = true;
    writeStorage(specialties);
    return true;
  },
};

function readStorage() {
  let stored;
  try {
    stored = localStorage.getItem(SPECIALTIES_STORAGE_KEY);
  } catch (error) {
    return [];
  }

  // Primera visita: se inicializa el array con los datos de ejemplo
  if (stored === null) {
    // createdAt null: los datos de ejemplo no cuentan como "nuevas este mes"
    const seeded = DEFAULT_SPECIALTIES.map((specialty) => ({
      ...createSpecialty(specialty),
      createdAt: null,
    }));
    writeStorage(seeded);
    return seeded;
  }

  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    // Compatibilidad con la versión anterior, que guardaba solo strings
    return parsed
      .map((item) =>
        typeof item === "string"
          ? createSpecialty({ name: item, description: "", active: true })
          : item,
      )
      .filter((item) => item && typeof item.name === "string" && item.name.trim());
  } catch (error) {
    return [];
  }
}

function writeStorage(specialties) {
  try {
    localStorage.setItem(SPECIALTIES_STORAGE_KEY, JSON.stringify(specialties));
  } catch (error) {
    console.error("No se pudo guardar en LocalStorage", error);
  }
}

function createSpecialty({ name, description, active }) {
  return {
    id: generateId(),
    name: name.trim(),
    description: (description || "").trim(),
    active: active !== false,
    deleted: false,
    createdAt: new Date().toISOString(),
  };
}

function generateId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeText(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}
