import { DataTypes } from "sequelize";

const EquipoAttributes = {
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
                msg: "El nombre del equipo es requerido"
            }
        }
    },
    Estadio: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "El nombre del estadio es requerido"
            }
        }
    },
    Fundacion: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "La fecha de fundación es requerida"
            }
        }
    }
};

const EquipoOptions = {
    timestamps: false,
    tableName: 'Equipos'
};

const EquipoModel = {
    EquipoAttributes,
    EquipoOptions
};

export default EquipoModel;

