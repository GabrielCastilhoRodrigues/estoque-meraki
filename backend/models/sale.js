//Parte da biblioteca que auxilia para definição dos tipos de dados.
const { DataTypes } = require('sequelize');
const db = require('../config/db');

/**
 * Define os dados e a tabela.
 */
const Sale = db.define(
    'sale',
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
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isDate: {
                    msg: 'Insira uma data válida'
                }
            }
        },
        total_sale: {
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
    Sale
}