require('dotenv').config();

//Importa a biblioteca que será utilizada para realizar a conexão.
const { Sequelize } = require('sequelize');

//Realiza a conexão com a base de dados.
const sequelize = new Sequelize(process.env.CON_STRING);

module.exports = sequelize;