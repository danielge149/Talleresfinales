import Sequelize from "sequelize";
import {db} from "../database/conexion.js";

const mascotas = db.define("mascotas",{
    id_mascota: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    nombre: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    tipo: {
        type: Sequelize.STRING(20),
        allowNull: false
    },
    edad: {
        type: Sequelize.STRING(100),
        allowNull: true
    },
    descripcion: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    disponible: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    },
    imagen: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    raza: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    detalle: {
        type: Sequelize.TEXT,
        allowNull: false
    },
});

export {mascotas}