//Parte da biblioteca que auxilia para definição dos tipos de dados.
const { DataTypes } = require('sequelize');
const db = require('../config/db');

/**
 * Define os dados e a tabela.
 */
const Product = db.define(
    'product',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        id_product_type: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        freezeTableName: true,
        timestamps: false
    },
)

module.exports = {
    Product
}