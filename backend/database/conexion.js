import Sequelize from "sequelize";

const db = new Sequelize("fundacion","fundacion","fundacion123",{
    dialect: "mysql",
    host: "localhost"
});

export {db}