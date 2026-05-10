// API Configuration
const API_BASE_URL = "http://localhost:3001/api";

// State
let currentPage = 1;
let currentJugadoresLimit = 10;
let equiposList = [];

// DOM Elements
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".section-content");
const loadingOverlay = document.getElementById("loading-overlay");
const toastContainer = document.getElementById("toast-container");

// Modal elements
const modalJugador = document.getElementById("modal-jugador");
const modalEquipo = document.getElementById("modal-equipo");
const formJugador = document.getElementById("form-jugador");
const formEquipo = document.getElementById("form-equipo");
const closeModalJugadorBtn = document.getElementById("close-modal-jugador");
const closeModalEquipoBtn = document.getElementById("close-modal-equipo");
const btnCancelarJugador = document.getElementById("btn-cancelar-jugador");
const btnCancelarEquipo = document.getElementById("btn-cancelar-equipo");

// ==================== Toast Notifications ====================

const showToast = (message, type = "success", duration = 3000) => {
  const toastId = `toast-${Date.now()}`;
  const toastEl = document.createElement("div");
  
  const bgColor = type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500";
  const icon = type === "success" ? "fa-check-circle" : type === "error" ? "fa-exclamation-circle" : "fa-info-circle";
  
  toastEl.id = toastId;
  toastEl.className = `${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-bounce`;
  toastEl.innerHTML = `
    <i class="fas ${icon}"></i>
    <span>${message}</span>
  `;
  
  toastContainer.appendChild(toastEl);
  
  setTimeout(() => {
    toastEl.remove();
  }, duration);
};

// ==================== Modal Management ====================

const openModalJugador = () => {
  loadEquiposInSelect();
  modalJugador.classList.remove("hidden");
};

const closeModalJugadorFn = () => {
  modalJugador.classList.add("hidden");
  formJugador.reset();
};

const openModalEquipo = () => {
  modalEquipo.classList.remove("hidden");
};

const closeModalEquipoFn = () => {
  modalEquipo.classList.add("hidden");
  formEquipo.reset();
};

const loadEquiposInSelect = async () => {
  const select = document.getElementById("input-jugador-equipo");
  
  if (!equiposList.length) {
    const data = await fetchAPI("/equipos");
    if (data) {
      equiposList = data;
    }
  }
  
  select.innerHTML = '<option value="">Seleccionar equipo...</option>';
  equiposList.forEach(equipo => {
    const option = document.createElement("option");
    option.value = equipo.id;
    option.textContent = equipo.nombre;
    select.appendChild(option);
  });
};

// ==================== Utilities ====================

const showLoading = () => {
  loadingOverlay.classList.remove("hidden");
};

const hideLoading = () => {
  loadingOverlay.classList.add("hidden");
};

const showSection = (sectionId) => {
  sections.forEach((section) => section.classList.add("hidden"));
  document.getElementById(sectionId).classList.remove("hidden");
};

const fetchAPI = async (endpoint, options = {}) => {
  try {
    showLoading();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    showToast(`Error: ${error.message}`, "error");
    return null;
  } finally {
    hideLoading();
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES");
};

const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

// ==================== Create Operations ====================

const createJugador = async (e) => {
  e.preventDefault();
  
  const nombre = document.getElementById("input-jugador-nombre").value.trim();
  const fechaNacimiento = document.getElementById("input-jugador-fecha").value;
  const nacionalidad = document.getElementById("input-jugador-nacionalidad").value.trim();
  const equipoId = document.getElementById("input-jugador-equipo").value;
  
  if (!nombre || !fechaNacimiento || !nacionalidad || !equipoId) {
    showToast("Por favor completa todos los campos", "warning");
    return;
  }
  
  const data = await fetchAPI("/jugadores", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombre,
      fechaNacimiento,
      nacionalidad,
      equipoId: parseInt(equipoId)
    })
  });
  
  if (data) {
    showToast(`¡Jugador "${nombre}" creado exitosamente!`, "success");
    closeModalJugadorFn();
    loadJugadores();
  }
};

const createEquipo = async (e) => {
  e.preventDefault();
  
  const nombre = document.getElementById("input-equipo-nombre").value.trim();
  const estadio = document.getElementById("input-equipo-estadio").value.trim();
  const fundacion = document.getElementById("input-equipo-fundacion").value;
  
  if (!nombre || !estadio || !fundacion) {
    showToast("Por favor completa todos los campos", "warning");
    return;
  }
  
  const year = parseInt(fundacion);
  const currentYear = new Date().getFullYear();
  
  if (year < 1800 || year > currentYear) {
    showToast(`El año de fundación debe estar entre 1800 y ${currentYear}`, "error");
    return;
  }
  
  const data = await fetchAPI("/equipos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombre,
      estadio,
      fundacion: `${year}-01-01`
    })
  });
  
  if (data) {
    showToast(`¡Equipo "${nombre}" creado exitosamente!`, "success");
    closeModalEquipoFn();
    loadEquipos();
    equiposList = []; // Reset cache para recargar equipos
  }
};

// ==================== Dashboard ====================

const loadDashboard = async () => {
  showSection("dashboard");
  
  showLoading();

  // Fetch all data in parallel
  const [equipos, jugadores, entrenadores, partidos] = await Promise.all([
    fetchAPI("/equipos"),
    fetchAPI("/jugadores?limit=100"),
    fetchAPI("/entrenadores"),
    fetchAPI("/partidos?limit=100"),
  ]);

  hideLoading();

  // Update stats
  document.getElementById("total-equipos").textContent = equipos?.length || 0;
  document.getElementById("total-jugadores").textContent = jugadores?.data?.length || 0;
  document.getElementById("total-entrenadores").textContent = entrenadores?.length || 0;
  document.getElementById("total-partidos").textContent = partidos?.data?.length || 0;

  // Recent Jugadores
  const recentJugadores = document.getElementById("recent-jugadores");
  if (jugadores?.data && jugadores.data.length > 0) {
    recentJugadores.innerHTML = jugadores.data.slice(0, 5).map((j) => `
      <div class="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200">
        <div>
          <p class="font-semibold text-gray-800">${j.nombre}</p>
          <p class="text-sm text-gray-500">${j.nacionalidad}</p>
        </div>
        <span class="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
          ${calculateAge(j.fechaNacimiento)} años
        </span>
      </div>
    `).join("");
  } else {
    recentJugadores.innerHTML = '<p class="text-gray-500 text-center py-4">Sin jugadores</p>';
  }

  // Recent Equipos
  const recentEquipos = document.getElementById("recent-equipos");
  if (equipos && equipos.length > 0) {
    recentEquipos.innerHTML = equipos.slice(0, 5).map((e) => `
      <div class="p-3 bg-gray-50 rounded border border-gray-200">
        <p class="font-semibold text-gray-800">${e.nombre}</p>
        <p class="text-sm text-gray-500"><i class="fas fa-stadium"></i> ${e.estadio}</p>
      </div>
    `).join("");
  } else {
    recentEquipos.innerHTML = '<p class="text-gray-500 text-center py-4">Sin equipos</p>';
  }
};

// ==================== Jugadores ====================

const loadJugadores = async (page = 1, filters = {}) => {
  showSection("jugadores");
  
  const queryParams = new URLSearchParams({
    page,
    limit: currentJugadoresLimit,
    ...filters,
  });

  const data = await fetchAPI(`/jugadores?${queryParams}`);

  if (!data) return;

  const tableBody = document.getElementById("table-jugadores");
  tableBody.innerHTML = data.data
    .map(
      (j) => `
    <tr class="border-b border-gray-200 hover:bg-gray-50 transition">
      <td class="px-6 py-4 text-gray-800">${j.id}</td>
      <td class="px-6 py-4 font-semibold text-gray-800">${j.nombre}</td>
      <td class="px-6 py-4 text-gray-700">${j.nacionalidad}</td>
      <td class="px-6 py-4 text-gray-700">${formatDate(j.fechaNacimiento)} (${calculateAge(j.fechaNacimiento)} años)</td>
      <td class="px-6 py-4 text-gray-700">${j.equipoId}</td>
      <td class="px-6 py-4 text-center">
        <button class="text-blue-600 hover:text-blue-800 transition mr-3 edit-btn" data-id="${j.id}">
          <i class="fas fa-edit"></i>
        </button>
        <button class="text-red-600 hover:text-red-800 transition delete-btn" data-id="${j.id}">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `
    )
    .join("");

  // Pagination
  const paginationDiv = document.getElementById("pagination-jugadores");
  paginationDiv.innerHTML = "";
  for (let i = 1; i <= data.meta.totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = `px-3 py-2 rounded border ${
      i === page
        ? "bg-blue-600 text-white border-blue-600"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
    }`;
    btn.onclick = () => loadJugadores(i, filters);
    paginationDiv.appendChild(btn);
  }

  // Add delete handlers
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.currentTarget.dataset.id;
      if (confirm("¿Estás seguro de que quieres eliminar este jugador?")) {
        const response = await fetch(`${API_BASE_URL}/jugadores/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          showToast("Jugador eliminado exitosamente", "success");
          loadJugadores(page, filters);
        } else {
          showToast("Error al eliminar el jugador", "error");
        }
      }
    });
  });
};

// ==================== Equipos ====================

const loadEquipos = async () => {
  showSection("equipos");
  
  const data = await fetchAPI("/equipos");

  if (!data) return;

  const grid = document.getElementById("grid-equipos");
  grid.innerHTML = data
    .map(
      (e) => `
    <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600 hover:shadow-lg transition">
      <h3 class="text-xl font-bold text-gray-800 mb-2">${e.nombre}</h3>
      <p class="text-gray-600 mb-2"><i class="fas fa-stadium text-blue-600 mr-2"></i>${e.estadio}</p>
      <p class="text-gray-600 mb-4"><i class="fas fa-calendar text-green-600 mr-2"></i>${formatDate(e.fundacion)}</p>
      <div class="flex gap-2">
        <button class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
          <i class="fas fa-edit"></i> Editar
        </button>
        <button class="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition delete-equipo-btn" data-id="${e.id}">
          <i class="fas fa-trash"></i> Eliminar
        </button>
      </div>
    </div>
  `
    )
    .join("");

  if (data.length === 0) {
    grid.innerHTML = '<p class="col-span-full text-center text-gray-500 py-8">No hay equipos registrados</p>';
  }

  // Add delete handlers
  document.querySelectorAll(".delete-equipo-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.currentTarget.dataset.id;
      if (confirm("¿Estás seguro de que quieres eliminar este equipo?")) {
        const response = await fetch(`${API_BASE_URL}/equipos/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          showToast("Equipo eliminado exitosamente", "success");
          loadEquipos();
          equiposList = []; // Reset cache
        } else {
          showToast("Error al eliminar el equipo", "error");
        }
      }
    });
  });
};

// ==================== Posiciones ====================

const loadPosiciones = async () => {
  showSection("posiciones");
  
  const data = await fetchAPI("/estadisticas/posiciones");

  if (!data) return;

  const tableBody = document.getElementById("table-posiciones");
  tableBody.innerHTML = data
    .map(
      (equipo, index) => `
    <tr class="border-b border-gray-200 hover:bg-blue-50 transition ${
      index < 3 ? "bg-blue-50" : ""
    }">
      <td class="px-6 py-4 text-center font-bold text-lg ${
        index === 0 ? "text-yellow-600" : index === 1 ? "text-gray-400" : index === 2 ? "text-orange-600" : ""
      }">
        ${index + 1}
      </td>
      <td class="px-6 py-4 font-semibold text-gray-800">${equipo.nombre}</td>
      <td class="px-6 py-4 text-center text-gray-700">${equipo.pj}</td>
      <td class="px-6 py-4 text-center text-green-600 font-semibold">${equipo.pg}</td>
      <td class="px-6 py-4 text-center text-gray-600 font-semibold">${equipo.pe}</td>
      <td class="px-6 py-4 text-center text-red-600 font-semibold">${equipo.pp}</td>
      <td class="px-6 py-4 text-center text-blue-600 font-semibold">${equipo.gf}</td>
      <td class="px-6 py-4 text-center text-red-500 font-semibold">${equipo.gc}</td>
      <td class="px-6 py-4 text-center ${
        equipo.dif > 0 ? "text-green-600" : equipo.dif < 0 ? "text-red-600" : "text-gray-600"
      } font-semibold">
        ${equipo.dif > 0 ? "+" : ""}${equipo.dif}
      </td>
      <td class="px-6 py-4 text-center text-yellow-600 font-bold text-lg bg-yellow-50">${equipo.puntos}</td>
    </tr>
  `
    )
    .join("");

  if (data.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="10" class="px-6 py-4 text-center text-gray-500">Sin datos de posiciones</td></tr>';
  }
};

// ==================== Event Listeners ====================

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const section = e.currentTarget.dataset.section;

    if (section === "dashboard") loadDashboard();
    if (section === "jugadores") loadJugadores();
    if (section === "equipos") loadEquipos();
    if (section === "posiciones") loadPosiciones();
  });
});

document.getElementById("btn-filtrar-jugadores")?.addEventListener("click", () => {
  const nombre = document.getElementById("search-nombre").value;
  const nacionalidad = document.getElementById("search-nacionalidad").value;
  const filters = {};
  if (nombre) filters.nombre = nombre;
  if (nacionalidad) filters.nacionalidad = nacionalidad;
  loadJugadores(1, filters);
});

// Modal Jugador events
document.getElementById("btn-nuevo-jugador")?.addEventListener("click", openModalJugador);
closeModalJugadorBtn?.addEventListener("click", closeModalJugadorFn);
btnCancelarJugador?.addEventListener("click", closeModalJugadorFn);
formJugador?.addEventListener("submit", createJugador);

// Modal Equipo events
document.getElementById("btn-nuevo-equipo")?.addEventListener("click", openModalEquipo);
closeModalEquipoBtn?.addEventListener("click", closeModalEquipoFn);
btnCancelarEquipo?.addEventListener("click", closeModalEquipoFn);
formEquipo?.addEventListener("submit", createEquipo);

// Close modals when clicking outside
modalJugador?.addEventListener("click", (e) => {
  if (e.target === modalJugador) closeModalJugadorFn();
});

modalEquipo?.addEventListener("click", (e) => {
  if (e.target === modalEquipo) closeModalEquipoFn();
});

// ==================== Initialize ====================

window.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
});
