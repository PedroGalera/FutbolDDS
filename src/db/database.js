import Sequelize from "sequelize";
import config from "../config/index.js";
import EntrenadorModel from "../models/entrenador.js";
import JugadorModel from "../models/jugador.js";
import EquipoModel from "../models/equipo.js";
import PartidoModel from "../models/partido.js";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: config.SQLITE_STORAGE,
  logging: false,
});

const Equipo = sequelize.define("Equipo", EquipoModel.EquipoAttributes, EquipoModel.EquipoOptions);
const Jugador = sequelize.define("Jugador", JugadorModel.JugadorAttributes, JugadorModel.JugadorOptions);
const Entrenador = sequelize.define("Entrenador", EntrenadorModel.EntrenadorAttributes, EntrenadorModel.EntrenadorOptions);
const Partido = sequelize.define("Partido", PartidoModel.PartidoAttributes, PartidoModel.PartidoOptions);

Equipo.hasMany(Entrenador, { foreignKey: "EquipoId" });
Entrenador.belongsTo(Equipo, { foreignKey: "EquipoId" });

Equipo.hasMany(Jugador, { foreignKey: "EquipoId" });
Jugador.belongsTo(Equipo, { foreignKey: "EquipoId" });

Equipo.hasMany(Partido, { as: "PartidosLocal", foreignKey: "EquipoLocalId" });
Equipo.hasMany(Partido, { as: "PartidosVisitante", foreignKey: "EquipoVisitanteId" });
Partido.belongsTo(Equipo, { as: "EquipoLocal", foreignKey: "EquipoLocalId" });
Partido.belongsTo(Equipo, { as: "EquipoVisitante", foreignKey: "EquipoVisitanteId" });

try {
  await sequelize.sync();
} catch (error) {
  console.error("Error sincronizando la base de datos:", error.message);
}

export default sequelize;
