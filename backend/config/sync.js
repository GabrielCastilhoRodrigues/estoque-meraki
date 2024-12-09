const { Product_type } = require('../models/product_type')
const { Product } = require('../models/product')
const { Stock } = require('../models/stock')
const { Purchase } = require('../models/purchase')
const { ItemPurchase } = require('../models/itemPurchase')
const { Person } = require('../models/person')
const { Sale } = require('../models/sale')
const { Payment } = require('../models/payment')

const sync = function () {
    Product.belongsTo(Product_type, {
        foreignKey: 'id_product_type',
        allowNull: true
    });

    Stock.belongsTo(Product, {
        foreignKey: 'id_product',
        allowNull: true
    });

    Purchase.hasMany(ItemPurchase, {
        foreignKey: 'id_purchase',
        allowNull: false
    });
    ItemPurchase.belongsTo(Purchase, {
        foreignKey: 'id_purchase',
        constraints: true,
        allowNull: false
    });
    
    ItemPurchase.belongsTo(Product, {
        foreignKey: 'id_product',
        allowNull: false
    });

    Sale.belongsTo(Person, {
        foreignKey: 'id_person',
        allowNull: false
    });

    Payment.belongsTo(Person, {
        foreignKey: 'id_person',
        allowNull: false
    });
    Payment.belongsTo(Sale, {
        foreignKey: 'id_sale',
        allowNull: false
    });
    Sale.hasMany(Payment, {
        foreignKey: 'id_sale',
        constraints: true,
        allowNull: false
    });

    Product_type.sync();
    Product.sync();
    Stock.sync();
    Purchase.sync();
    ItemPurchase.sync();
    Person.sync();
    Sale.sync;
    Payment.sync({force: true});
}

sync();

module.exports = sync;