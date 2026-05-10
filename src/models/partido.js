import { DataTypes } from "sequelize";

const PartidoAttributes = {
    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "La fecha es requerida"
            }
        }
    },
    HoraInicio: {
        type: DataTypes.STRING(6),
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "La hora de inicio es requerida"
            }
        }
    },
    EquipoLocalId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Equipos',
            key: 'Id'
        },
        validate: {
            notEmpty: {
                args: true,
                msg: "El equipo local es requerido"
            }
        }
    },
    EquipoVisitanteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Equipos',
            key: 'Id'
        },
        validate: {
            notEmpty: {
                args: true,
                msg: "El equipo visitante es requerido"
            }
        }
    },
    Terminado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        validate: {
            notEmpty: {
                args: true,
                msg: 'El estado terminado es requerido.'
            }
        }
    },
    Resultado: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "El resultado del partido es requerido"
            }
        }
    }
};

const PartidoOptions = {
    timestamps: false,
    tableName: 'Partidos'
};

const PartidoModel = {
    PartidoAttributes,
    PartidoOptions
};

export default PartidoModel;
