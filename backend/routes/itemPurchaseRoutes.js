const express = require('express');
const router = express.Router();
const { ItemPurchase } = require('../models/itemPurchase');
const { Product } = require('../models/product')
const { Purchase } = require('../models/purchase')
const { Stock } = require('../models/stock')
const Validators = require('../models/validators')
const { RETURN_CODES, MESSAGES, SHORT_MESSAGES } = require('../config/constants');

/**
 * Realiza a busca de todos os registros da tabela.
 */
router.get('/', async (req, res) => {
    const result = await ItemPurchase.findAll({
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
    });

    res.status(RETURN_CODES.CREATED).send(result);
});

/**
 * Realiza a busca do registro com base do ID.
 */
router.get('/:id', async (req, res) => {
    const result = await Validators.item_purchase_exist(req.params.id);

    if (result === null) {
        return res.status(RETURN_CODES.NOT_FOUND).send({
            return: RETURN_CODES.NOT_FOUND,
            message: MESSAGES.ITEM_PURCHASE_NOT_FOUND,
        });
    }

    res.status(RETURN_CODES.CREATED).send(result);
})

/**
 * Realiza a inserção de registro na tabela.
 */
router.post('/', async (req, res) => {
    const product_exist = await Validators.product_exist(req.body.id_product);

    if (!product_exist) {
        return res.status(RETURN_CODES.NOT_FOUND).send({
            return: RETURN_CODES.NOT_FOUND,
            message: MESSAGES.PRODUCT_NOT_FOUND,
        })
    }

    const purchase_exist = await Validators.purchase_exist(req.body.id_purchase);

    if (purchase_exist == null) {
        return res.status(RETURN_CODES.BAD_REQUEST).send({
            return: RETURN_CODES.BAD_REQUEST,
            message: MESSAGES.PURCHASE_NOT_FOUND
        })
    }

    const new_item_purchase = await ItemPurchase.create(req.body);

    res.status(RETURN_CODES.CREATED).send(new_item_purchase);
});

/**
 * Atualiza o registro da tabela, com base dos dados informados.
 */
router.put('/:id', async (req, res) => {
    const item_purchase_exist = await Validators.item_purchase_exist(req.params.id);

    if (item_purchase_exist === null) {
        return res.status(RETURN_CODES.NOT_FOUND).send({
            return: RETURN_CODES.NOT_FOUND,
            message: MESSAGES.ITEM_PURCHASE_NOT_FOUND,
        });
    }

    if (req.body.id_purchase != undefined) {
        return res.status(RETURN_CODES.BAD_REQUEST).send({
            return: RETURN_CODES.BAD_REQUEST,
            message: MESSAGES.ITEM_PURCHASE_PURCHASE_NOT_EDITABLE
        });
    }

    const edit_item_purchase = await item_purchase_exist.update(req.body, { returning: true });

    res.status(RETURN_CODES.CREATED).send(edit_item_purchase);
})

/**
 * Deleta o registro com base do ID informado.
 */
router.delete('/:id', async (req, res) => {
    const item_purchase_exist = await Validators.item_purchase_exist(req.params.id);

    if (item_purchase_exist === null) {
        return res.status(RETURN_CODES.NOT_FOUND).send({
            return: RETURN_CODES.NOT_FOUND,
            message: MESSAGES.ITEM_PURCHASE_NOT_FOUND,
        });
    }

    await item_purchase_exist.destroy();

    res.status(RETURN_CODES.SUCCESS).send({
        return: RETURN_CODES.SUCCESS,
        message: SHORT_MESSAGES.DELETE_SUCESS
    });
});

module.exports = router;