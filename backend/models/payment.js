//Parte da biblioteca que auxilia para definição dos tipos de dados.
const { DataTypes } = require('sequelize');
const db = require('../config/db');

/**
 * Define os dados e a tabela.
 */
const Payment = db.define(
    'payment',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        id_person: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_sale: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isDate: {
                    msg: 'Insira uma data válida'
                }
            }
        },
        parcel: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        value: {
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
    Payment
}