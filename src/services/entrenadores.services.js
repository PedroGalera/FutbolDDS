import { Op } from "sequelize";
import { ResourceNotFound } from "../errors/resource-not-found-error.js";
import sequelize from "../db/database.js";

const getEntrenadores = async (filters = {}) => {
  const whereQuery = {};

  if (filters.nombre) {
    whereQuery.Nombre = { [Op.like]: `%${filters.nombre}%` };
  }

  const resultado = await sequelize.models.Entrenador.findAll({
    where: whereQuery,
    attributes: ["Id", "Nombre", "FechaNacimiento", "Nacionalidad", "EquipoId"],
    order: [["Nombre", "ASC"]],
  });

  return resultado.map((e) => ({
    id: e.Id,
    nombre: e.Nombre,
    fechaNacimiento: e.FechaNacimiento,
    nacionalidad: e.Nacionalidad,
    equipoId: e.EquipoId,
  }));
};

const insertarEntrenador = async (entrenadorCmd) => {
  const resultado = await sequelize.models.Entrenador.create({
    Nombre: entrenadorCmd.nombre,
    FechaNacimiento: entrenadorCmd.fechaNacimiento,
    Nacionalidad: entrenadorCmd.nacionalidad,
    EquipoId: entrenadorCmd.equipoId,
  });

  return {
    id: resultado.Id,
    nombre: resultado.Nombre,
  };
};

const editarEntrenador = async (entrenadorCmd) => {
  const entrenador = await sequelize.models.Entrenador.findOne({
    where: { Id: entrenadorCmd.id },
  });

  if (!entrenador) {
    throw new ResourceNotFound("Entrenador no encontrado");
  }

  const cambios = {};
  if (entrenadorCmd.nombre) cambios.Nombre = entrenadorCmd.nombre;
  if (entrenadorCmd.fechaNacimiento) cambios.FechaNacimiento = entrenadorCmd.fechaNacimiento;
  if (entrenadorCmd.nacionalidad) cambios.Nacionalidad = entrenadorCmd.nacionalidad;
  if (entrenadorCmd.equipoId) cambios.EquipoId = entrenadorCmd.equipoId;

  await sequelize.models.Entrenador.update(cambios, {
    where: { Id: entrenadorCmd.id },
  });

  return { id: entrenadorCmd.id };
};

const borrarEntrenador = async (id) => {
  const entrenador = await sequelize.models.Entrenador.findOne({
    where: { Id: id },
  });

  if (!entrenador) {
    throw new ResourceNotFound("Entrenador no encontrado");
  }

  await sequelize.models.Entrenador.destroy({ where: { Id: id } });

  return { id };
};

const entrenadoresService = {
  getEntrenadores,
  insertarEntrenador,
  editarEntrenador,
  borrarEntrenador,
};

export default entrenadoresService;