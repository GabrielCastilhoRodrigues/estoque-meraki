//Parte da biblioteca que auxilia para definição dos tipos de dados.
const { DataTypes } = require('sequelize');
const db = require('../config/db');

/**
 * Define os dados e a tabela.
 */
const Stock = db.define(
    'stock',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        id_product: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        quantity: {
            type: DataTypes.DECIMAL,
            allowNull: true
        },
        purchase_price: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        sales_tips: {
            type: DataTypes.DECIMAL,
            allowNull: false
        }
    },
    {
        freezeTableName: true,
        timestamps: false
    },
)

module.exports = {
    Stock
}