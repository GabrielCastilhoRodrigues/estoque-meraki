//Parte da biblioteca que auxilia para definição dos tipos de dados.
const { DataTypes } = require('sequelize');
const db = require('../config/db');
const { Purchase }  = require('./purchase');

/**
 * Define os dados e a tabela.
 */
const ItemPurchase = db.define(
    'item_purchase',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        id_purchase: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_product: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        item_count: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        cost_price: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        sales_tips: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
    },
    {
        freezeTableName: true,
        timestamps: false
    },
)

module.exports = {
    ItemPurchase
}