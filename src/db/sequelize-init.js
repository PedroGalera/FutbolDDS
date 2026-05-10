// configurar ORM sequelize
const { Sequelize, DataTypes } = require("sequelize");

// Configuración de la base de datos
const sequelize = new Sequelize("sqlite:" + "./.data/futbol.db");

// Definición de modelos
const Entrenador = sequelize.define(
  "Entrenador",
  {
    id_entrenador: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Nombre es requerido",
        },
        len: {
          args: [5, 30],
          msg: "Nombre debe ser tipo caracteres, entre 5 y 30 de longitud",
        },
      },
    },
    edad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Edad es requerido",
        },
        isInt: {
          args: true,
          msg: "Edad debe ser un numero entero",
        },
      },
    },
    equipo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

const Jugador = sequelize.define(
  "Jugador",
  {
    id_jugador: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Nombre es requerido",
        },
        len: {
          args: [5, 30],
          msg: "Nombre debe ser tipo caracteres, entre 5 y 30 de longitud",
        },
      },
    },
    edad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Edad es requerido",
        },
        isInt: {
          args: true,
          msg: "Edad debe ser un numero entero",
        },
      },
    },
    equipo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    posicion: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Posición es requerida",
        },
        len: {
          args: [5, 30],
          msg: "Posición debe ser tipo caracteres, entre 5 y 30 de longitud",
        },
      },
    },
    goles: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Goles es requerido",
        },
        isInt: {
          args: true,
          msg: "Goles debe ser un numero entero",
        },
      },
    },
  },
  {
    timestamps: false,
  }
);

const Equipo = sequelize.define(
  "Equipo",
  {
    id_equipo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Nombre es requerido",
        },
        len: {
          args: [5, 30],
          msg: "Nombre debe ser tipo caracteres, entre 5 y 30 de longitud",
        },
      },
    },
    pais: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Pais es requerido",
        },
        len: {
          args: [5, 30],
          msg: "Pais debe ser tipo caracteres, entre 5 y 30 de longitud",
        },
      },
    },
    fecha_fundacion: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Fecha de Fundación es requerido",
        },
        isDate: {
          args: true,
          msg: "Fecha de Fundación debe ser una fecha valida",
        },
      },
    },
    presupuesto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Presupuesto es requerido",
        },
        isInt: {
          args: true,
          msg: "Presupuesto debe ser un numero entero",
        },
      },
    },
  },
  {
    timestamps: false,
  }
);

const Partido = sequelize.define(
  "Partido",
  {
    id_partido: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    equipo_local: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    equipo_visitante: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Fecha es requerido",
        },
        isDate: {
          args: true,
          msg: "Fecha debe ser una fecha valida",
        },
      },
    },
    goles_local: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Goles Local es requerido",
        },
        isInt: {
          args: true,
          msg: "Goles Local debe ser un numero entero",
        },
      },
    },
    goles_visitante: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Goles Visitante es requerido",
        },
        isInt: {
          args: true,
          msg: "Goles Visitante debe ser un numero entero",
        },
      },
    },
  },
  {
    timestamps: false,
  }
);

// Asociaciones
Equipo.hasOne(Entrenador, { foreignKey: 'equipo' });
Entrenador.belongsTo(Equipo, { foreignKey: 'equipo' });

Jugador.belongsTo(Equipo, { foreignKey: 'equipo' });
Equipo.hasMany(Jugador, { foreignKey: 'equipo' });

Partido.belongsTo(Equipo, { as: 'EquipoLocal', foreignKey: 'equipo_local' });
Partido.belongsTo(Equipo, { as: 'EquipoVisitante', foreignKey: 'equipo_visitante' });
Equipo.hasMany(Partido, { as: 'PartidosLocal', foreignKey: 'equipo_local' });
Equipo.hasMany(Partido, { as: 'PartidosVisitante', foreignKey: 'equipo_visitante' });

module.exports = {
  sequelize,
  Entrenador,
  Jugador,
  Equipo,
  Partido,
};