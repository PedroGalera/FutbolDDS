BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS "Equipos" (
    "Id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "Nombre" VARCHAR(100) NOT NULL,
    "Estadio" VARCHAR(100) NOT NULL,
    "Fundacion" DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS "Jugadores" (
    "Id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "Nombre" VARCHAR(100) NOT NULL,
    "FechaNacimiento" DATE NOT NULL,
    "Nacionalidad" VARCHAR(100) NOT NULL,
    "EquipoId" INTEGER NOT NULL,
    FOREIGN KEY("EquipoId") REFERENCES "Equipos"("Id")
);

CREATE TABLE IF NOT EXISTS "Partidos" (
    "Id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "Fecha" DATE NOT NULL,
    "HoraInicio" VARCHAR(6) NOT NULL,
    "EquipoLocalId" INTEGER NOT NULL,
    "EquipoVisitanteId" INTEGER NOT NULL,
    "Terminado" BOOLEAN NOT NULL DEFAULT 0,
    "Resultado" VARCHAR(100) NOT NULL,
    FOREIGN KEY("EquipoLocalId") REFERENCES "Equipos"("Id"),
    FOREIGN KEY("EquipoVisitanteId") REFERENCES "Equipos"("Id")
);

CREATE TABLE IF NOT EXISTS "Entrenadores" (
    "Id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "Nombre" VARCHAR(100) NOT NULL,
    "FechaNacimiento" DATE NOT NULL,
    "Nacionalidad" VARCHAR(100) NOT NULL,
    "EquipoId" INTEGER NOT NULL,
    FOREIGN KEY("EquipoId") REFERENCES "Equipos"("Id")
);


INSERT INTO "Equipos" ("Nombre", "Estadio", "Fundacion") VALUES ('Manchester United', 'Old Trafford', '1878-01-01');
INSERT INTO "Equipos" ("Nombre", "Estadio", "Fundacion") VALUES ('Bayern Munich', 'Allianz Arena', '1900-02-27');

INSERT INTO "Jugadores" ("Nombre", "FechaNacimiento", "Nacionalidad", "EquipoId") VALUES ('Neymar Jr.', '1992-02-05', 'Brasil', 1);
INSERT INTO "Jugadores" ("Nombre", "FechaNacimiento", "Nacionalidad", "EquipoId") VALUES ('Luis Suárez', '1987-01-24', 'Uruguay', 1);
INSERT INTO "Jugadores" ("Nombre", "FechaNacimiento", "Nacionalidad", "EquipoId") VALUES ('Robert Lewandowski', '1988-08-21', 'Polonia', 2);
INSERT INTO "Jugadores" ("Nombre", "FechaNacimiento", "Nacionalidad", "EquipoId") VALUES ('Manuel Neuer', '1986-03-27', 'Alemania', 2);

INSERT INTO "Partidos" ("Fecha", "HoraInicio", "EquipoLocalId", "EquipoVisitanteId", "Resultado") VALUES ('2024-06-03', '18:30', 2, 1, '2-2');
INSERT INTO "Partidos" ("Fecha", "HoraInicio", "EquipoLocalId", "EquipoVisitanteId", "Resultado") VALUES ('2024-06-05', '19:00', 1, 2, '1-3');

INSERT INTO "Entrenadores" ("Nombre", "FechaNacimiento", "Nacionalidad", "EquipoId") VALUES ('Pep Guardiola', '1971-01-18', 'España', 1);
INSERT INTO "Entrenadores" ("Nombre", "FechaNacimiento", "Nacionalidad", "EquipoId") VALUES ('Jurgen Klopp', '1967-06-16', 'Alemania', 2);

COMMIT;