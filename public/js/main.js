// API Configuration
const API_BASE_URL = "/api"; 

// State
let equiposList = [];

// DOM Elements
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".section-content");
const loadingOverlay = document.getElementById("loading-overlay");
const toastContainer = document.getElementById("toast-container");

// Modales
const modalJugador = document.getElementById("modal-jugador");
const modalEquipo = document.getElementById("modal-equipo");
const modalPartido = document.getElementById("modal-partido");

// ==================== Utilities ====================

const showLoading = () => loadingOverlay?.classList.remove("hidden");
const hideLoading = () => loadingOverlay?.classList.add("hidden");

const showToast = (message, type = "success") => {
    const toastEl = document.createElement("div");
    const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
    toastEl.className = `${bgColor} text-white px-6 py-3 rounded-lg shadow-lg fixed top-4 right-4 z-50 animate-bounce`;
    toastEl.innerHTML = `<span>${message}</span>`;
    toastContainer.appendChild(toastEl);
    setTimeout(() => toastEl.remove(), 3000);
};

const fetchAPI = async (endpoint, options = {}) => {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Error en fetch ${endpoint}:`, error);
        // No mostramos toast de error para entrenadores si falla, solo lo ignoramos
        if (!endpoint.includes("entrenadores")) {
            showToast(error.message, "error");
        }
        return null;
    } finally {
        hideLoading();
    }
};

const showSection = (sectionId) => {
    sections.forEach((section) => section.classList.add("hidden"));
    document.getElementById(sectionId)?.classList.remove("hidden");
};

// ==================== Dashboard & Stats ====================

const loadDashboard = async () => {
    showSection("dashboard");
    
    // Ejecutamos las peticiones. Si entrenadores falla, devuelve null pero no rompe el resto.
    const [equipos, jugadores, entrenadores, partidos] = await Promise.all([
        fetchAPI("/equipos"),
        fetchAPI("/jugadores?limit=100"),
        fetchAPI("/entrenadores"),
        fetchAPI("/partidos?limit=100")
    ]);

    // Actualizar contadores (si fallan, ponen 0 en vez de quedarse en "Cargando")
    document.getElementById("total-equipos").textContent = equipos?.length || 0;
    document.getElementById("total-jugadores").textContent = jugadores?.data?.length || 0;
    document.getElementById("total-entrenadores").textContent = entrenadores?.length || 0;
    document.getElementById("total-partidos").textContent = partidos?.data?.length || 0;

    // Actualizar listas rápidas del dashboard
    actualizarListasDashboard(jugadores?.data, equipos);
};

const actualizarListasDashboard = (jugadores, equipos) => {
    const recentJugadores = document.getElementById("recent-jugadores");
    const recentEquipos = document.getElementById("recent-equipos");

    if (jugadores) {
        recentJugadores.innerHTML = jugadores.slice(0, 5).map(j => `
            <div class="p-2 bg-gray-50 rounded border-b">${j.nombre}</div>
        `).join("");
    }
    if (equipos) {
        recentEquipos.innerHTML = equipos.slice(0, 5).map(e => `
            <div class="p-2 bg-gray-50 rounded border-b">${e.nombre}</div>
        `).join("");
    }
};

// ==================== Secciones ====================

const loadJugadores = async () => {
    showSection("jugadores");
    const data = await fetchAPI("/jugadores");
    if (!data) return;
    const tbody = document.getElementById("table-jugadores");
    tbody.innerHTML = data.data.map(j => `
        <tr class="border-b">
            <td class="px-6 py-4">${j.id}</td>
            <td class="px-6 py-4 font-bold">${j.nombre}</td>
            <td class="px-6 py-4">${j.nacionalidad}</td>
            <td class="px-6 py-4 text-center">
                <button class="text-red-600"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join("");
};

const loadEquipos = async () => {
    showSection("equipos");
    const data = await fetchAPI("/equipos");
    if (!data) return;
    const grid = document.getElementById("grid-equipos");
    grid.innerHTML = data.map(e => `
        <div class="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-600">
            <h3 class="font-bold text-xl">${e.nombre}</h3>
            <p class="text-gray-600">${e.estadio}</p>
        </div>
    `).join("");
};

const loadPosiciones = async () => {
    showSection("posiciones");
    const data = await fetchAPI("/estadisticas/posiciones");
    if (!data) return;
    const tbody = document.getElementById("table-posiciones");
    tbody.innerHTML = data.map((e, i) => `
        <tr class="border-b hover:bg-blue-50 transition">
            <td class="px-6 py-4 text-center font-bold">${i + 1}</td>
            <td class="px-6 py-4 font-bold">${e.nombre}</td>
            <td class="px-6 py-4 text-center">${e.pj}</td>
            <td class="px-6 py-4 text-center text-green-600 font-bold">${e.pg}</td>
            <td class="px-6 py-4 text-center text-yellow-600 font-bold">${e.pe}</td>
            <td class="px-6 py-4 text-center text-red-600 font-bold">${e.pp}</td>
            <td class="px-6 py-4 text-center font-bold bg-yellow-50 text-xl text-yellow-700">${e.puntos}</td>
        </tr>
    `).join("");
};

const loadPartidos = async () => {
    showSection("partidos");
    const data = await fetchAPI("/partidos");
    if (!data) return;
    const partidos = data.data || data;
    const tbody = document.getElementById("table-partidos");
    tbody.innerHTML = partidos.map(p => `
        <tr class="border-b">
            <td class="px-6 py-4">${new Date(p.fecha).toLocaleDateString()}</td>
            <td class="px-6 py-4 text-right font-semibold">${p.equipoLocalId}</td>
            <td class="px-6 py-4 text-center font-mono font-bold bg-gray-100 text-lg">${p.resultado}</td>
            <td class="px-6 py-4 font-semibold">${p.equipoVisitanteId}</td>
        </tr>
    `).join("");
};

// ==================== Events ====================

navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        const section = e.currentTarget.dataset.section;
        if (section === "dashboard") loadDashboard();
        if (section === "jugadores") loadJugadores();
        if (section === "equipos") loadEquipos();
        if (section === "posiciones") loadPosiciones();
        if (section === "partidos") loadPartidos();
    });
});

document.getElementById("btn-nuevo-partido")?.addEventListener("click", async () => {
    const equipos = await fetchAPI("/equipos");
    if (!equipos) return;
    const html = '<option value="">Seleccionar...</option>' + 
                 equipos.map(e => `<option value="${e.id}">${e.nombre}</option>`).join("");
    document.getElementById("input-partido-local").innerHTML = html;
    document.getElementById("input-partido-visitante").innerHTML = html;
    modalPartido.classList.remove("hidden");
});

document.getElementById("form-partido")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
        equipoLocalId: parseInt(document.getElementById("input-partido-local").value),
        equipoVisitanteId: parseInt(document.getElementById("input-partido-visitante").value),
        resultado: `${document.getElementById("input-goles-local").value}-${document.getElementById("input-goles-visitante").value}`,
        fecha: new Date().toISOString().split('T')[0],
        horaInicio: "20:00",
        terminado: true
    };

    const res = await fetchAPI("/partidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (res) {
        showToast("¡Partido registrado y tabla actualizada!");
        modalPartido.classList.add("hidden");
        // REFRESCAMOS TODO:
        await loadPartidos();   // Refresca la lista de partidos
        await loadPosiciones(); // Recalcula la tabla de puntos
        await loadDashboard();  // Actualiza los contadores del Dashboard
    }
});

// --- Eventos para abrir Modales ---

// Jugadores
document.getElementById("btn-nuevo-jugador")?.addEventListener("click", () => {
    cargarEquiposEnSelect("input-jugador-equipo"); // Llenamos el select antes de abrir
    modalJugador.classList.remove("hidden");
});

// Equipos
document.getElementById("btn-nuevo-equipo")?.addEventListener("click", () => {
    modalEquipo.classList.remove("hidden");
});

// --- Eventos para cerrar Modales (Botones cancelar y X) ---

document.getElementById("close-modal-jugador")?.addEventListener("click", () => modalJugador.classList.add("hidden"));
document.getElementById("btn-cancelar-jugador")?.addEventListener("click", () => modalJugador.classList.add("hidden"));

document.getElementById("close-modal-equipo")?.addEventListener("click", () => modalEquipo.classList.add("hidden"));
document.getElementById("btn-cancelar-equipo")?.addEventListener("click", () => modalEquipo.classList.add("hidden"));
document.getElementById("close-modal-partido")?.addEventListener("click", () => {
    modalPartido.classList.add("hidden");
});

const cargarEquiposEnSelect = async (selectId) => {
    const equipos = await fetchAPI("/equipos");
    const select = document.getElementById(selectId);
    if (equipos && select) {
        select.innerHTML = '<option value="">Seleccionar equipo...</option>' + 
            equipos.map(e => `<option value="${e.id}">${e.nombre}</option>`).join('');
    }
};

// Guardar Nuevo Jugador
document.getElementById("form-jugador")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
        nombre: document.getElementById("input-jugador-nombre").value,
        fechaNacimiento: document.getElementById("input-jugador-fecha").value,
        nacionalidad: document.getElementById("input-jugador-nacionalidad").value,
        equipoId: parseInt(document.getElementById("input-jugador-equipo").value)
    };

    const res = await fetchAPI("/jugadores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (res) {
        showToast("¡Jugador creado!");
        modalJugador.classList.add("hidden");
        loadJugadores(); // Refrescamos la tabla
        loadDashboard(); // Actualizamos contadores
    }
});

// Guardar Nuevo Equipo
document.getElementById("form-equipo")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
        nombre: document.getElementById("input-equipo-nombre").value,
        estadio: document.getElementById("input-equipo-estadio").value,
        fundacion: `${document.getElementById("input-equipo-fundacion").value}-01-01`
    };

    const res = await fetchAPI("/equipos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (res) {
        showToast("¡Equipo creado!");
        modalEquipo.classList.add("hidden");
        loadEquipos();
        loadDashboard();
    }
});

// Inicialización
window.addEventListener("DOMContentLoaded", loadDashboard);