import { ResourceNotFound } from "../errors/resource-not-found-error.js";
import sequelize from "../db/database.js";

// Extraemos los modelos una sola vez para usarlos en todo el archivo
const { Partido, Equipo } = sequelize.models;

// Validación de seguridad para la consola
if (!Partido || !Equipo) {
    console.error("❌ Error: No se cargaron los modelos Partido o Equipo en sequelize.models");
}

const getPartidos = async () => {
    const resultado = await Partido.findAndCountAll({
        include: [
            { 
                model: Equipo, 
                as: "EquipoLocal", 
                attributes: ["Nombre"] 
            },
            { 
                model: Equipo, 
                as: "EquipoVisitante", 
                attributes: ["Nombre"] 
            }
        ],
        order: [["Fecha", "DESC"]],
    });

    return {
        data: resultado.rows.map((p) => ({
            id: p.Id,
            fecha: p.Fecha,
            equipoLocal: p.EquipoLocal ? p.EquipoLocal.Nombre : "Desconocido",
            equipoVisitante: p.EquipoVisitante ? p.EquipoVisitante.Nombre : "Desconocido",
            resultado: p.Resultado,
        })),
    };
};

const insertarPartido = async (datos) => {
    const nuevo = await Partido.create({
        Fecha: datos.fecha,
        HoraInicio: "20:00",
        EquipoLocalId: datos.equipoLocalId,
        EquipoVisitanteId: datos.equipoVisitanteId,
        Resultado: datos.resultado,
        Terminado: true
    });

    // Lógica de puntos: actualizamos a los equipos directamente
    const [gL, gV] = datos.resultado.split("-").map(Number);
    const local = await Equipo.findByPk(datos.equipoLocalId);
    const visitante = await Equipo.findByPk(datos.equipoVisitanteId);

    if (local && visitante) {
        local.PJ += 1; visitante.PJ += 1;
        local.GF += gL; local.GC += gV;
        visitante.GF += gV; visitante.GC += gL;

        if (gL > gV) {
            local.PG += 1; local.Puntos += 3;
            visitante.PP += 1;
        } else if (gL < gV) {
            visitante.PG += 1; visitante.Puntos += 3;
            local.PP += 1;
        } else {
            local.PE += 1; local.Puntos += 1;
            visitante.PE += 1; visitante.Puntos += 1;
        }

        local.DIF = local.GF - local.GC;
        visitante.DIF = visitante.GF - visitante.GC;

        await local.save();
        await visitante.save();
    }

    return nuevo;
};

const editarPartido = async (partidoCmd) => {
    const partido = await Partido.findByPk(partidoCmd.id);

    if (!partido) {
        throw new ResourceNotFound("Partido no encontrado");
    }

    const cambios = {};
    if (partidoCmd.fecha) cambios.Fecha = partidoCmd.fecha;
    if (partidoCmd.horaInicio) cambios.HoraInicio = partidoCmd.horaInicio;
    if (partidoCmd.equipoLocalId) cambios.EquipoLocalId = partidoCmd.equipoLocalId;
    if (partidoCmd.equipoVisitanteId) cambios.EquipoVisitanteId = partidoCmd.equipoVisitanteId;
    if (typeof partidoCmd.terminado !== "undefined") cambios.Terminado = partidoCmd.terminado;
    if (partidoCmd.resultado) cambios.Resultado = partidoCmd.resultado;

    await partido.update(cambios);
    return { id: partidoCmd.id };
};

const eliminarPartido = async (id) => {
    const filasBorradas = await Partido.destroy({ where: { Id: id } });

    if (filasBorradas === 0) {
        throw new ResourceNotFound("Partido no encontrado");
    }

    return { id };
};

const partidosService = {
    getPartidos,
    insertarPartido,
    editarPartido,
    eliminarPartido,
};

export default partidosService;