const express = require('express');
const router = express.Router();
const { Stock } = require('../models/stock');
const { Product } = require('../models/product')
const Validators = require('../models/validators')
const { RETURN_CODES, MESSAGES, SHORT_MESSAGES } = require('../config/constants');

/**
 * Realiza a busca de todos os registros da tabela.
 */
router.get('/', async (req, res) => {
    const result = await Stock.findAll({
        include: [{
            attributes: ['name', 'code'],
            model: Product
        }]
    });

    res.status(RETURN_CODES.CREATED).send(result);
});

/**
 * Realiza a busca do registro com base do ID.
 */
router.get('/:id', async (req, res) => {
    const result = await Validators.stock_exist(req.params.id);

    if (result === null) {
        return res.status(RETURN_CODES.NOT_FOUND).send({
            return: RETURN_CODES.NOT_FOUND,
            message: MESSAGES.STOCK_NOT_FOUND,
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

    const stock_with_product_exist = await Validators.stock_with_product_exist(req.body.id_product);

    if (stock_with_product_exist) {
        return res.status(RETURN_CODES.BAD_REQUEST).send({
            return: RETURN_CODES.BAD_REQUEST,
            message: MESSAGES.STOCK_EXIST
        })
    }

    const new_stock = await Stock.create(req.body);

    res.status(RETURN_CODES.CREATED).send(new_stock);
});

/**
 * Atualiza o registro da tabela, com base dos dados informados.
 */
router.put('/:id', async (req, res) => {
    const Stock_existed = await Validators.stock_exist(req.params.id);

    if (Stock_existed === null) {
        return res.status(RETURN_CODES.NOT_FOUND).send({
            return: RETURN_CODES.NOT_FOUND,
            message: MESSAGES.Stock_NOT_FOUND,
        });
    }

    if (req.body.id_product != undefined) {
        return res.status(RETURN_CODES.BAD_REQUEST).send({
            return: RETURN_CODES.BAD_REQUEST,
            message: MESSAGES.STOCK_PRODUCT_NOT_EDITABLE
        });
    }

    const edit_Stock = await Stock_existed.update(req.body, { returning: true });

    res.status(RETURN_CODES.CREATED).send(edit_Stock);
})

/**
 * Deleta o registro com base do ID informado.
 */
router.delete('/:id', async (req, res) => {
    const Stock_existed = await Validators.stock_exist(req.params.id);

    if (Stock_existed === null) {
        return res.status(RETURN_CODES.NOT_FOUND).send({
            return: RETURN_CODES.NOT_FOUND,
            message: MESSAGES.STOCK_NOT_FOUND,
        });
    }

    await Stock_existed.destroy();

    res.status(RETURN_CODES.SUCCESS).send({
        return: RETURN_CODES.SUCCESS,
        message: SHORT_MESSAGES.DELETE_SUCESS
    });
});

module.exports = router;