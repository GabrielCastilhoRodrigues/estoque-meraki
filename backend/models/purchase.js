//Parte da biblioteca que auxilia para definição dos tipos de dados.
const { DataTypes } = require('sequelize');
const db = require('../config/db');

/**
 * Define os dados e a tabela.
 */
const Purchase = db.define(
    'purchase',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        total_price: {
            type: DataTypes.DECIMAL,
            allowNull: true,
            defaultValue: 0
        }
    },
    {
        freezeTableName: true,
        timestamps: false
    },
)


module.exports = {
    Purchase
}