const express = require('express');
const router = express.Router();
const { RETURN_CODES, MESSAGES, SHORT_MESSAGES } = require('../config/constants');
const { Purchase } = require('../models/purchase');
const { ItemPurchase } = require('../models/itemPurchase')
const Validators = require('../models/validators')

/**
 * Realiza a busca de todos os registros da tabela.
 */
router.get('/', async (req, res) => {
    const result = await Purchase.findAll({
        include: [{
            model: ItemPurchase,
            attributes: ['id', 'item_count', 'id_product', 'quantity', 'cost_price', 'sales_tips'],
        }],
        order : [
            [ItemPurchase, 'item_count', 'ASC']
        ]
    });

    res.status(RETURN_CODES.CREATED).send(result);
});

/**
 * Realiza a busca do registro com base do ID.
 */
router.get('/:id', async (req, res) => {
    const result = await Validators.purchase_exist(req.params.id);

    if (result === null) {
        return res.status(RETURN_CODES.NOT_FOUND).send({
            return: RETURN_CODES.NOT_FOUND,
            message: MESSAGES.PURCHASE_NOT_FOUND,
        });
    }

    res.status(RETURN_CODES.CREATED).send(result);
})

/**
 * Realiza a inserção de registro na tabela.
 */
router.post('/', async (req, res) => {
    const new_purchase = await Purchase.create(req.body);

    res.status(RETURN_CODES.CREATED).send(new_purchase);
});

/**
 * Atualiza o registro da tabela, com base dos dados informados.
 */
router.put('/:id', async (req, res) => {
    const purchase_existed = await Validators.purchase_exist(req.params.id);

    if (purchase_existed === null) {
        return res.status(RETURN_CODES.NOT_FOUND).send({
            return: RETURN_CODES.NOT_FOUND,
            message: MESSAGES.PURCHASE_NOT_FOUND,
        });
    }

    const edit_purchase = await purchase_existed.update(req.body, { returning: true });

    res.status(RETURN_CODES.CREATED).send(edit_purchase);
})

/**
 * Deleta o registro com base do ID informado.
 */
router.delete('/:id', async (req, res) => {
    const purchase_existed = await Validators.purchase_exist(req.params.id);

    if (purchase_existed === null) {
        return res.status(RETURN_CODES.NOT_FOUND).send({
            return: RETURN_CODES.NOT_FOUND,
            message: MESSAGES.PURCHASE_NOT_FOUND,
        });
    }

    await purchase_existed.destroy();

    res.status(RETURN_CODES.CREATED).send({
        return: SHORT_MESSAGES.SUCCESS,
        message: SHORT_MESSAGES.DELETE_SUCESS
    });
})

module.exports = router;