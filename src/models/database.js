import Sequelize from "sequelize";
import EntrenadorModel from "./entrenador.js";
import JugadorModel from "./jugador.js";
import EquipoModel from "./equipo.js";
import PartidoModel from "./partido.js";

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './futbol.db'
});

// Definir modelos
const Equipo = sequelize.define(
    'Equipo',
    EquipoModel.EquipoAttributes,
    EquipoModel.EquipoOptions
);

const Jugador = sequelize.define(
    'Jugador',
    JugadorModel.JugadorAttributes,
    JugadorModel.JugadorOptions
);

const Partido = sequelize.define(
    'Partido',
    PartidoModel.PartidoAttributes,
    PartidoModel.PartidoOptions
);

const Entrenador = sequelize.define(
    'Entrenador',
    EntrenadorModel.EntrenadorAttributes,
    EntrenadorModel.EntrenadorOptions
);

// Asociaciones
Equipo.hasMany(Entrenador, { foreignKey: 'EquipoId' });
Entrenador.belongsTo(Equipo, { foreignKey: 'EquipoId' });

Equipo.hasMany(Jugador, { foreignKey: 'EquipoId' });
Jugador.belongsTo(Equipo, { foreignKey: 'EquipoId' });

Equipo.hasMany(Partido, { as: 'PartidosLocal', foreignKey: 'EquipoLocalId' });
Equipo.hasMany(Partido, { as: 'PartidosVisitante', foreignKey: 'EquipoVisitanteId' });
Partido.belongsTo(Equipo, { as: 'Local', foreignKey: 'EquipoLocalId' });
Partido.belongsTo(Equipo, { as: 'Visitante', foreignKey: 'EquipoVisitanteId' });

// Sincronizar la base de datos
try {
    await sequelize.sync();
} catch (err) {
    console.log({ msg: err.message });
}

export default sequelize;
