import { DataTypes } from "sequelize";

const EntrenadorAttributes = {
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
                msg: "El nombre del entrenador es requerido"
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
                msg: "La nacionalidad del entrenador es requerida"
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
                msg: "El equipo del entrenador es requerido"
            }
        }
    }
};

const EntrenadorOptions = {
    timestamps: false,
    tableName: 'Entrenadores'
};

const EntrenadorModel = {
    EntrenadorAttributes,
    EntrenadorOptions
};

export default EntrenadorModel;
