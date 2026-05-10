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

// Sincronizar la base de datos e insertar datos de prueba
(async () => {
    try {
        console.log('📊 Sincronizando base de datos...');
        await sequelize.sync();
        console.log('✅ Base de datos sincronizada');
        
        // Verificar si hay datos y si no, insertarlos automáticamente
        const equipoCount = await Equipo.count();
        console.log(`🔍 Equipos encontrados: ${equipoCount}`);
        
        if (equipoCount === 0) {
            console.log('📝 Base de datos vacía. Insertando datos de prueba...');
            
            // Insertar Equipos
            const equipos = await Equipo.bulkCreate([
                { Nombre: 'Manchester United', Estadio: 'Old Trafford', Fundacion: '1878-01-01' },
                { Nombre: 'Bayern Munich', Estadio: 'Allianz Arena', Fundacion: '1900-02-27' }
            ]);
            console.log(`✅ Equipos insertados: ${equipos.length}`);
            
            // Insertar Jugadores
            const jugadores = await Jugador.bulkCreate([
                { Nombre: 'Neymar Jr.', FechaNacimiento: '1992-02-05', Nacionalidad: 'Brasil', EquipoId: equipos[0].Id },
                { Nombre: 'Luis Suárez', FechaNacimiento: '1987-01-24', Nacionalidad: 'Uruguay', EquipoId: equipos[0].Id },
                { Nombre: 'Robert Lewandowski', FechaNacimiento: '1988-08-21', Nacionalidad: 'Polonia', EquipoId: equipos[1].Id },
                { Nombre: 'Manuel Neuer', FechaNacimiento: '1986-03-27', Nacionalidad: 'Alemania', EquipoId: equipos[1].Id }
            ]);
            console.log(`✅ Jugadores insertados: ${jugadores.length}`);
            
            // Insertar Partidos
            const partidos = await Partido.bulkCreate([
                { Fecha: '2024-06-03', HoraInicio: '18:30', EquipoLocalId: equipos[1].Id, EquipoVisitanteId: equipos[0].Id, Resultado: '2-2' },
                { Fecha: '2024-06-05', HoraInicio: '19:00', EquipoLocalId: equipos[0].Id, EquipoVisitanteId: equipos[1].Id, Resultado: '1-3' }
            ]);
            console.log(`✅ Partidos insertados: ${partidos.length}`);
            
            // Insertar Entrenadores
            const entrenadores = await Entrenador.bulkCreate([
                { Nombre: 'Pep Guardiola', FechaNacimiento: '1971-01-18', Nacionalidad: 'España', EquipoId: equipos[0].Id },
                { Nombre: 'Jurgen Klopp', FechaNacimiento: '1967-06-16', Nacionalidad: 'Alemania', EquipoId: equipos[1].Id }
            ]);
            console.log(`✅ Entrenadores insertados: ${entrenadores.length}`);
            
            console.log('✅ Todos los datos de prueba insertados correctamente.');
        } else {
            console.log('✅ Base de datos ya contiene datos.');
        }
    } catch (err) {
        console.error('❌ Error inicializando base de datos:', err.message);
    }
})();

export default sequelize;
