import Sequelize from "sequelize";
import {db} from "../database/conexion.js";

const solicitudes = db.define("solicitudes", {
    id_Solicitud: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    idMascota: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: "mascotas", // Referencia a la tabla mascotas
            key: "id_mascota",
        },
    },
    nombreSolicitante: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    correoSolicitante: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
   
    estadoSolicitud: {
        type: Sequelize.STRING(20),
        defaultValue: "Pendiente",
    },
});

export {solicitudes}