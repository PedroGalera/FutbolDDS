import { Op } from "sequelize";
import { ResourceNotFound } from "../errors/resource-not-found-error.js";
import sequelize from "../db/database.js";

const getEquipos = async (filters = {}) => {
  const whereQuery = {};

  if (filters.nombre) {
    whereQuery.Nombre = { [Op.like]: `%${filters.nombre}%` };
  }

  const resultado = await sequelize.models.Equipo.findAll({
    where: whereQuery,
    attributes: ["Id", "Nombre", "Estadio", "Fundacion"],
    order: [["Nombre", "ASC"]],
  });

  return resultado.map((e) => ({
    id: e.Id,
    nombre: e.Nombre,
    estadio: e.Estadio,
    fundacion: e.Fundacion,
  }));
};

const insertarEquipo = async (equipoCmd) => {
  const resultado = await sequelize.models.Equipo.create({
    Nombre: equipoCmd.nombre,
    Estadio: equipoCmd.estadio,
    Fundacion: equipoCmd.fundacion,
  });

  return {
    id: resultado.Id,
    nombre: resultado.Nombre,
  };
};

const editarEquipo = async (equipoCmd) => {
  const equipo = await sequelize.models.Equipo.findOne({
    where: { Id: equipoCmd.id },
  });

  if (!equipo) {
    throw new ResourceNotFound("Equipo no encontrado");
  }

  const cambios = {};
  if (equipoCmd.nombre) cambios.Nombre = equipoCmd.nombre;
  if (equipoCmd.estadio) cambios.Estadio = equipoCmd.estadio;
  if (equipoCmd.fundacion) cambios.Fundacion = equipoCmd.fundacion;

  await sequelize.models.Equipo.update(cambios, {
    where: { Id: equipoCmd.id },
  });

  return { id: equipoCmd.id };
};

const borrarEquipo = async (id) => {
  const equipo = await sequelize.models.Equipo.findOne({
    where: { Id: id },
  });

  if (!equipo) {
    throw new ResourceNotFound("Equipo no encontrado");
  }

  await sequelize.models.Equipo.destroy({ where: { Id: id } });

  return { id };
};

const equiposService = {
  getEquipos,
  insertarEquipo,
  editarEquipo,
  borrarEquipo,
};

export default equiposService;
