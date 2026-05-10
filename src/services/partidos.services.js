import { ResourceNotFound } from "../errors/resource-not-found-error.js";
import sequelize from "../db/database.js";

const DEFAULT_LIMIT = 20;

const getPartidos = async (pagination = {}) => {
  const page = Number(pagination.page) || 1;
  const limit = Number(pagination.limit) || DEFAULT_LIMIT;
  const offset = (page - 1) * limit;

  const resultado = await sequelize.models.Partido.findAndCountAll({
    attributes: [
      "Id",
      "Fecha",
      "HoraInicio",
      "EquipoLocalId",
      "EquipoVisitanteId",
      "Terminado",
      "Resultado",
    ],
    order: [["Fecha", "DESC"]],
    limit,
    offset,
  });

  return {
    meta: {
      page,
      limit,
      total: resultado.count,
      totalPages: Math.ceil(resultado.count / limit),
    },
    data: resultado.rows.map((p) => ({
      id: p.Id,
      fecha: p.Fecha,
      horaInicio: p.HoraInicio,
      equipoLocalId: p.EquipoLocalId,
      equipoVisitanteId: p.EquipoVisitanteId,
      terminado: p.Terminado,
      resultado: p.Resultado,
    })),
  };
};

const insertarPartido = async (partidoCmd) => {
  const resultado = await sequelize.models.Partido.create({
    Fecha: partidoCmd.fecha,
    HoraInicio: partidoCmd.horaInicio,
    EquipoLocalId: partidoCmd.equipoLocalId,
    EquipoVisitanteId: partidoCmd.equipoVisitanteId,
    Terminado: partidoCmd.terminado || false,
    Resultado: partidoCmd.resultado,
  });

  return {
    id: resultado.Id,
    fecha: resultado.Fecha,
    horaInicio: resultado.HoraInicio,
    equipoLocalId: resultado.EquipoLocalId,
    equipoVisitanteId: resultado.EquipoVisitanteId,
    terminado: resultado.Terminado,
    resultado: resultado.Resultado,
  };
};

const editarPartido = async (partidoCmd) => {
  const partido = await sequelize.models.Partido.findOne({
    where: { Id: partidoCmd.id },
  });

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

  await sequelize.models.Partido.update(cambios, {
    where: { Id: partidoCmd.id },
  });

  return { id: partidoCmd.id };
};

const eliminarPartido = async (id) => {
  const partido = await sequelize.models.Partido.findOne({
    where: { Id: id },
  });

  if (!partido) {
    throw new ResourceNotFound("Partido no encontrado");
  }

  await sequelize.models.Partido.destroy({ where: { Id: id } });

  return { id };
};

const partidosService = {
  getPartidos,
  insertarPartido,
  editarPartido,
  eliminarPartido,
};

export default partidosService;
