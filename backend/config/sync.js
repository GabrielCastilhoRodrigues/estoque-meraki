const { Product_type } = require('../models/product_type')
const { Product } = require('../models/product')
const { Stock } = require('../models/stock')
const { Purchase } = require('../models/purchase')
const { ItemPurchase } = require('../models/itemPurchase')

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

    Product_type.sync();
    Product.sync();
    Stock.sync();
    Purchase.sync();
    ItemPurchase.sync();
}

sync();

module.exports = sync;