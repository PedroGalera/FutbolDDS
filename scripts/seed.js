import sequelize from "../src/db/database.js";

const equipos = [
  { Nombre: "Manchester United", Estadio: "Old Trafford", Fundacion: "1878-01-01" },
  { Nombre: "Bayern Munich", Estadio: "Allianz Arena", Fundacion: "1900-02-27" },
  { Nombre: "Real Madrid", Estadio: "Santiago Bernabéu", Fundacion: "1902-03-06" },
  { Nombre: "Paris Saint-Germain", Estadio: "Parc des Princes", Fundacion: "1970-08-12" },
];

const jugadores = [
  { Nombre: "Neymar Jr.", FechaNacimiento: "1992-02-05", Nacionalidad: "Brasil", EquipoId: 4 },
  { Nombre: "Karim Benzema", FechaNacimiento: "1987-12-19", Nacionalidad: "Francia", EquipoId: 3 },
  { Nombre: "Robert Lewandowski", FechaNacimiento: "1988-08-21", Nacionalidad: "Polonia", EquipoId: 2 },
  { Nombre: "Marcus Rashford", FechaNacimiento: "1997-10-31", Nacionalidad: "Inglaterra", EquipoId: 1 },
];

const entrenadores = [
  { Nombre: "Pep Guardiola", FechaNacimiento: "1971-01-18", Nacionalidad: "España", EquipoId: 4 },
  { Nombre: "Jurgen Klopp", FechaNacimiento: "1967-06-16", Nacionalidad: "Alemania", EquipoId: 1 },
  { Nombre: "Carlo Ancelotti", FechaNacimiento: "1959-06-10", Nacionalidad: "Italia", EquipoId: 3 },
  { Nombre: "Thomas Tuchel", FechaNacimiento: "1973-08-29", Nacionalidad: "Alemania", EquipoId: 2 },
];

const partidos = [
  { Fecha: "2024-06-03", HoraInicio: "18:30", EquipoLocalId: 2, EquipoVisitanteId: 1, Resultado: "2-2", Terminado: true },
  { Fecha: "2024-06-05", HoraInicio: "19:00", EquipoLocalId: 1, EquipoVisitanteId: 2, Resultado: "1-3", Terminado: true },
  { Fecha: "2024-06-07", HoraInicio: "20:00", EquipoLocalId: 3, EquipoVisitanteId: 4, Resultado: "1-1", Terminado: true },
  { Fecha: "2024-06-10", HoraInicio: "17:45", EquipoLocalId: 4, EquipoVisitanteId: 3, Resultado: "0-2", Terminado: true },
];

const seed = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("Base de datos sincronizada");

    await sequelize.models.Equipo.bulkCreate(equipos);
    await sequelize.models.Jugador.bulkCreate(jugadores);
    await sequelize.models.Entrenador.bulkCreate(entrenadores);
    await sequelize.models.Partido.bulkCreate(partidos);

    console.log("Seed completado correctamente");
    process.exit(0);
  } catch (error) {
    console.error("Error al ejecutar seed:", error.message);
    process.exit(1);
  }
};

seed();
