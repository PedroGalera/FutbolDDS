import { DataTypes } from "sequelize";

const JugadorAttributes = {
    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "El nombre del jugador es requerido"
            }
        }
    },
    FechaNacimiento: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "La fecha de nacimiento es requerida"
            }
        }
    },
    Nacionalidad: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "La nacionalidad del jugador es requerida"
            }
        }
    },
    EquipoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Equipos',
            key: 'Id'
        },
        validate: {
            notEmpty: {
                args: true,
                msg: "El equipo del jugador es requerido"
            }
        }
    }
}

const JugadorOptions = {
    timestamps: false,
    tableName: 'Jugadores'
}

const JugadorModel = {
    JugadorAttributes,
    JugadorOptions
}

export default JugadorModel
