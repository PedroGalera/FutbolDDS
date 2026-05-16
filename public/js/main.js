// API Configuration
const API_BASE_URL = "/api"; 

// DOM Elements
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".section-content");
const loadingOverlay = document.getElementById("loading-overlay");
const toastContainer = document.getElementById("toast-container");

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
    
    const [equipos, jugadores, entrenadores, partidos] = await Promise.all([
        fetchAPI("/equipos"),
        fetchAPI("/jugadores?limit=100"),
        fetchAPI("/entrenadores"),
        fetchAPI("/partidos?limit=100")
    ]);

    document.getElementById("total-equipos").textContent = equipos?.length || 0;
    document.getElementById("total-jugadores").textContent = jugadores?.data?.length || 0;
    document.getElementById("total-entrenadores").textContent = entrenadores?.length || 0;
    document.getElementById("total-partidos").textContent = partidos?.data?.length || 0;

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

const loadJugadores = async (filters = {}) => {
    showSection("jugadores");
    const params = new URLSearchParams();
    if (filters.nombre) params.append("nombre", filters.nombre);
    if (filters.nacionalidad) params.append("nacionalidad", filters.nacionalidad);

    const endpoint = params.toString() ? `/jugadores?${params.toString()}` : "/jugadores";
    const data = await fetchAPI(endpoint);
    if (!data) return;

    const jugadores = Array.isArray(data.data) ? data.data : [];
    const tbody = document.getElementById("table-jugadores");
    tbody.innerHTML = jugadores.map(j => {
        const equipoNombre = j.Equipo?.Nombre ?? j.Equipo?.nombre ?? 'Sin equipo';
        return `
            <tr class="border-b">
                <td class="px-6 py-4">${j.id}</td>
                <td class="px-6 py-4 font-bold">${j.nombre}</td>
                <td class="px-6 py-4">${j.nacionalidad}</td>
                <td class="px-6 py-4">${j.fechaNacimiento || '-'}</td>
                <td class="px-6 py-4">${equipoNombre}</td>
                <td class="px-6 py-4 text-center space-x-2">
                    <button class="text-red-600" onclick="eliminarJugador(${j.id})"><i class="fas fa-trash"></i></button>
                    <button class="text-blue-600 hover:text-blue-800 transition" onclick="prepararEdicion(${j.id})"><i class="fas fa-edit"></i></button>
                </td>
            </tr>
        `;
    }).join("");
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
            <td class="px-6 py-4 text-right font-bold text-blue-900">${p.equipoLocal}</td>
            <td class="px-6 py-4 text-center font-mono font-bold bg-gray-100 text-lg">${p.resultado}</td>
            <td class="px-6 py-4 font-bold text-blue-900">${p.equipoVisitante}</td>
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

document.getElementById("btn-filtrar-jugadores")?.addEventListener("click", async () => {
    const nombre = document.getElementById("search-nombre").value.trim();
    const nacionalidad = document.getElementById("search-nacionalidad").value.trim();

    const filters = {};
    if (nombre) filters.nombre = nombre;
    if (nacionalidad) filters.nacionalidad = nacionalidad;

    await loadJugadores(filters);
});

document.getElementById("btn-nuevo-partido")?.addEventListener("click", async () => {
    const equipos = await fetchAPI("/equipos");
    if (!equipos) return;
    // Usamos Id en mayúscula si así viene del backend
    const html = '<option value="">Seleccionar...</option>' + 
                 equipos.map(e => `<option value="${e.Id}">${e.Nombre}</option>`).join("");
    document.getElementById("input-partido-local").innerHTML = html;
    document.getElementById("input-partido-visitante").innerHTML = html;
    modalPartido.classList.remove("hidden");
});

document.getElementById("form-partido")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
        equipoLocalId: parseInt(document.getElementById("input-partido-local").value),
        equipoVisitanteId: parseInt(document.getElementById("input-partido-visitante").value),
        // IMPORTANTE: Enviamos el resultado como string para que el service lo parsee
        resultado: `${document.getElementById("input-goles-local").value}-${document.getElementById("input-goles-visitante").value}`,
        fecha: new Date().toISOString().split('T')[0]
    };

    const res = await fetchAPI("/partidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (res) {
        showToast("¡Partido registrado y tabla actualizada!");
        modalPartido.classList.add("hidden");
        document.getElementById("form-partido").reset();
        await loadPartidos();
        await loadPosiciones();
        await loadDashboard();
    }
});

// --- Eventos para abrir Modales ---

document.getElementById("btn-nuevo-jugador")?.addEventListener("click", () => {
    cargarEquiposEnSelect("input-jugador-equipo");
    modalJugador.classList.remove("hidden");
});

document.getElementById("btn-nuevo-equipo")?.addEventListener("click", () => {
    modalEquipo.classList.remove("hidden");
});

// --- Eventos para cerrar Modales ---

document.getElementById("close-modal-jugador")?.addEventListener("click", () => modalJugador.classList.add("hidden"));
document.getElementById("btn-cancelar-jugador")?.addEventListener("click", () => modalJugador.classList.add("hidden"));
document.getElementById("close-modal-equipo")?.addEventListener("click", () => modalEquipo.classList.add("hidden"));
document.getElementById("btn-cancelar-equipo")?.addEventListener("click", () => modalEquipo.classList.add("hidden"));
document.getElementById("close-modal-partido")?.addEventListener("click", () => modalPartido.classList.add("hidden"));

const cargarEquiposEnSelect = async (selectId, selectedId = null) => {
    const equipos = await fetchAPI("/equipos");
    const select = document.getElementById(selectId);
    const selectedValue = selectedId !== null ? String(selectedId) : null;
    if (equipos && select) {
        select.innerHTML = '<option value="">Seleccionar equipo...</option>' + 
            equipos.map(e => {
                const teamId = e.Id ?? e.id;
                const teamName = e.Nombre ?? e.nombre;
                return `<option value="${teamId}" ${selectedValue === String(teamId) ? 'selected' : ''}>${teamName}</option>`;
            }).join('');
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
        document.getElementById("form-jugador").reset();
        loadJugadores();
        loadDashboard();
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
        document.getElementById("form-equipo").reset();
        loadEquipos();
        loadDashboard();
    }
});

const eliminarJugador = async (id) => {
    const res = await fetchAPI(`/jugadores/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    });

    if (res) {
        showToast("¡Jugador eliminado!");
        loadJugadores();
        loadDashboard();
    }
};
// 1. Capturamos los elementos del DOM del modal
const modalEditar = document.getElementById("modal-editar-jugador");
const formEditar = document.getElementById("form-editar-jugador");
const btnCerrarModal = document.getElementById("btn-cerrar-modal");
const btnCancelarModal = document.getElementById("btn-cancelar-modal");

// Función que se ejecuta al tocar el ícono del lápiz en la tabla
const prepararEdicion = async (id) => {
    // Buscamos los datos del jugador actual para precargar el formulario
    // Tu backend ya debería tener una ruta GET /api/jugadores/:id o podés buscarlo en el array local si lo tenés libre
    const data = await fetchAPI(`/jugadores`); 
    if (!data || !Array.isArray(data.data)) return alert("No se pudieron cargar los datos del jugador");
    const jugador = data.data.find(j => j.id === id);
    
    if (!jugador) return alert("No se encontraron los datos del jugador");

    // Rellenamos los inputs del modal con la info actual
    document.getElementById("edit-jugador-id").value = jugador.id;
    document.getElementById("edit-jugador-nombre").value = jugador.nombre;
    document.getElementById("edit-jugador-fecha").value = jugador.fechaNacimiento || "";
    document.getElementById("edit-jugador-nacionalidad").value = jugador.nacionalidad;
    await cargarEquiposEnSelect("edit-jugador-equipo", jugador.equipoId);

    // Mostramos el modal de forma nativa
    modalEditar.showModal();
};

// Evento para procesar el envío del formulario (El botón "Guardar Cambios")
formEditar.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evitamos que la página se recargue sola

    const id = document.getElementById("edit-jugador-id").value;
    
    // Armamos el objeto con los datos modificados del formulario
    const datosModificados = {
        id: Number(id),
        nombre: document.getElementById("edit-jugador-nombre").value,
        fechaNacimiento: document.getElementById("edit-jugador-fecha").value,
        nacionalidad: document.getElementById("edit-jugador-nacionalidad").value,
        equipoId: Number(document.getElementById("edit-jugador-equipo").value)
    };

    // Enviamos la petición PUT a tu jugador.route de Express
    const respuesta = await fetchAPI(`/jugadores/${id}`, {
        method: "PUT",
        body: JSON.stringify(datosModificados),
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (respuesta) {
        modalEditar.close(); // Cerramos el modal
        alert("Jugador actualizado con éxito");
        loadJugadores(); // Recargamos la tabla para ver el cambio reflejado
    }
});

// Eventos para cerrar el modal si se arrepiente
btnCerrarModal.addEventListener("click", () => modalEditar.close());
btnCancelarModal.addEventListener("click", () => modalEditar.close());
// Inicialización
window.addEventListener("DOMContentLoaded", loadDashboard);