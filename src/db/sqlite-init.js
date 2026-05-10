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
Equipo.hasOne(Entrenador, { foreignKey: 'Equipo' });
Entrenador.belongsTo(Equipo, { foreignKey: 'Equipo' });

Jugador.belongsTo(Equipo, { foreignKey: 'Equipo' });
Equipo.hasMany(Jugador, { foreignKey: 'Equipo' });

Partido.belongsTo(Equipo, { as: 'EquipoLocal', foreignKey: 'EquipoLocal' });
Partido.belongsTo(Equipo, { as: 'EquipoVisitante', foreignKey: 'EquipoVisitante' });
Equipo.hasMany(Partido, { as: 'PartidosLocal', foreignKey: 'EquipoLocal' });
Equipo.hasMany(Partido, { as: 'PartidosVisitante', foreignKey: 'EquipoVisitante' });

// Sincronizar la base de datos
try {
    await sequelize.sync();
} catch (err) {
    console.log({ msg: err.message });
}

export default sequelize;
