import { Op } from "sequelize";
import { ResourceNotFound } from "../errors/resource-not-found-error.js";
import sequelize from "../db/database.js";

const DEFAULT_LIMIT = 20;

const buildAgeRangeFilter = (filters) => {
  const where = {};
  const today = new Date();

  if (filters.minEdad) {
    const maxBirthDate = new Date(today);
    maxBirthDate.setFullYear(maxBirthDate.getFullYear() - Number(filters.minEdad));
    where[Op.lte] = maxBirthDate.toISOString().split("T")[0];
  }

  if (filters.maxEdad) {
    const minBirthDate = new Date(today);
    minBirthDate.setFullYear(minBirthDate.getFullYear() - Number(filters.maxEdad));
    where[Op.gte] = minBirthDate.toISOString().split("T")[0];
  }

  if (Object.keys(where).length === 0) return null;
  return where;
};

const getJugadores = async (filters = {}, pagination = {}) => {
  const whereQuery = {};

  if (filters.nombre) {
    whereQuery.Nombre = { [Op.like]: `%${filters.nombre}%` };
  }

  if (filters.nacionalidad) {
    whereQuery.Nacionalidad = { [Op.like]: `%${filters.nacionalidad}%` };
  }

  if (filters.equipoId) {
    whereQuery.EquipoId = filters.equipoId;
  }

  const ageFilter = buildAgeRangeFilter(filters);
  if (ageFilter) {
    whereQuery.FechaNacimiento = ageFilter;
  }

  const page = Number(pagination.page) || 1;
  const limit = Number(pagination.limit) || DEFAULT_LIMIT;
  const offset = (page - 1) * limit;

  const resultado = await sequelize.models.Jugador.findAndCountAll({
    where: whereQuery,
    attributes: ["Id", "Nombre", "FechaNacimiento", "Nacionalidad", "EquipoId"],
    order: [["Nombre", "ASC"]],
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
    data: resultado.rows.map((j) => ({
      id: j.Id,
      nombre: j.Nombre,
      fechaNacimiento: j.FechaNacimiento,
      nacionalidad: j.Nacionalidad,
      equipoId: j.EquipoId,
    })),
  };
};

const insertarJugador = async (jugadorCmd) => {
  const resultado = await sequelize.models.Jugador.create({
    Nombre: jugadorCmd.nombre,
    FechaNacimiento: jugadorCmd.fechaNacimiento,
    Nacionalidad: jugadorCmd.nacionalidad,
    EquipoId: jugadorCmd.equipoId,
  });

  return {
    id: resultado.Id,
    nombre: resultado.Nombre,
  };
};

const editarJugador = async (jugadorCmd) => {
  const jugador = await sequelize.models.Jugador.findOne({
    where: { Id: jugadorCmd.id },
  });

  if (!jugador) {
    throw new ResourceNotFound("Jugador no encontrado");
  }

  const cambios = {};
  if (jugadorCmd.nombre) cambios.Nombre = jugadorCmd.nombre;
  if (jugadorCmd.fechaNacimiento) cambios.FechaNacimiento = jugadorCmd.fechaNacimiento;
  if (jugadorCmd.nacionalidad) cambios.Nacionalidad = jugadorCmd.nacionalidad;
  if (jugadorCmd.equipoId) cambios.EquipoId = jugadorCmd.equipoId;

  await sequelize.models.Jugador.update(cambios, {
    where: { Id: jugadorCmd.id },
  });

  return { id: jugadorCmd.id };
};

const borrarJugador = async (id) => {
  const jugador = await sequelize.models.Jugador.findOne({
    where: { Id: id },
  });

  if (!jugador) {
    throw new ResourceNotFound("Jugador no encontrado");
  }

  await sequelize.models.Jugador.destroy({ where: { Id: id } });

  return { id };
};

const jugadoresService = {
  getJugadores,
  insertarJugador,
  editarJugador,
  borrarJugador,
};

export default jugadoresService;
