const { Product } = require('./product');
const { Product_type } = require('./product_type');
const { Stock } = require('./stock');
const { Purchase } = require('./purchase');
const { ItemPurchase } = require('./itemPurchase');
const { Person } = require('./person');

/**
 * Confere se o Tipo de Produto informado realmente existe.
 * 
 * @param {*} id_product_type
 *    ID do tipo de Produto.
 * 
 * @returns
 *   True caso exista, False caso não exista. 
 */
async function product_type_exist(id_product_type) {
    const product_type = await Product_type.findOne({
        where: {
            id: id_product_type
        }
    })

    return product_type;
}

async function product_exist(id_product) {
    const product = await Product.findOne({
        where: {
            id: id_product
        },
        include: [{
            attributes: ['name'],
            model: Product_type
        }]
    })

    return product;
}

async function product_type_in_product(id_product_type) {
    const product = await Product.findOne({
        where: {
            id_product_type: id_product_type
        }
    })

    return product;
}

async function stock_exist(id_stock) {
    const stock = await Stock.findOne({
        where: {
            id: id_stock
        },
        include: [{
            attributes: ['name', 'code'],
            model: Product
        }]
    });

    return stock;
}

async function stock_with_product_exist(id_product) {
    const stock = await Stock.findOne({
        where: {
            id_product: id_product
        }
    })

    return true;
}

async function purchase_exist(id_purchase) {
    const purchase = await Purchase.findOne({
        where: {
            id: id_purchase
        },
        include: [{
            model: ItemPurchase,
            attributes: ['id', 'item_count', 'id_product', 'quantity', 'cost_price', 'sales_tips'], 
        }]
    })

    return purchase;
}

async function item_purchase_exist(id_item_purchase) {
    const itemPurchase = await ItemPurchase.findOne({
        where: {
            id: id_item_purchase
        },
        include: [
            {
                model: Purchase
            },
            {
                model: Product,
                attributes: {
                    exclude: ['id_product_type']
                }
            }
        ]
    })

    return itemPurchase;
}

async function person_exist(id_person) {
    const person_exist = await Person.findOne({
        where: {
            id: id_person
        }
    });

    return person_exist;
}

module.exports = {
    product_type_exist,
    product_exist,
    product_type_in_product,
    stock_exist,
    stock_with_product_exist,
    purchase_exist,
    item_purchase_exist,
    person_exist
}