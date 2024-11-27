const express = require('express');
const router = express.Router();
const { Product_type } = require('../models/product_type');
const { RETURN_CODES, MESSAGES, SHORT_MESSAGES, VALIDATIONS } = require('../config/constants');
const { Product } = require('../models/product');
const Validators = require('../models/validators')

/**
 * Realiza a busca de todos os registros da tabela.
 */
router.get('/', async (req, res) => {
    const result = await Product_type.findAll();

    res.status(RETURN_CODES.CREATED).send(result);
});

/**
 * Realiza a busca do registro com base do ID.
 */
router.get('/:id', async (req, res) => {
    const result = await Validators.product_type_exist(req.params.id);

    if (result === null) {
        return res.status(RETURN_CODES.NOT_FOUND).send({
            return: RETURN_CODES.NOT_FOUND,
            message: MESSAGES.PRODUCT_TYPE_NOT_FOUND,
        });
    }

    res.status(RETURN_CODES.CREATED).send(result);
})

/**
 * Realiza a inserção de registro na tabela.
 */
router.post('/', async (req, res) => {
    const new_product_type = await Product_type.create(req.body);

    res.status(RETURN_CODES.CREATED).send(new_product_type);
});

/**
 * Atualiza o registro da tabela, com base dos dados informados.
 */
router.put('/:id', async (req, res) => {
    const product_type_existed = await Validators.product_type_exist(req.params.id);

    if (product_type_existed === null) {
        return res.status(RETURN_CODES.NOT_FOUND).send({
            return: RETURN_CODES.NOT_FOUND,
            message: MESSAGES.PRODUCT_TYPE_NOT_FOUND,
        });
    }

    const edit_product_type = await product_type_existed.update(req.body, { returning: true });

    res.status(RETURN_CODES.CREATED).send(edit_product_type);
})

/**
 * Deleta o registro com base do ID informado.
 */
router.delete('/:id', async (req, res) => {
    const product_type_existed = await Product_type.Validators.product_type_exist(req.params.id);

    if (product_type_existed === null) {
        return res.status(RETURN_CODES.NOT_FOUND).send({
            return: RETURN_CODES.NOT_FOUND,
            message: MESSAGES.PRODUCT_TYPE_NOT_FOUND,
        });
    }

    const product_type_in_product = await Validators.product_type_in_product(req.params.id);

    if (product_type_in_product != null) {
        return res.status(RETURN_CODES.NOT_FOUND).send({
            return: RETURN_CODES.BAD_REQUEST,
            message: MESSAGES.PRODUCT_TYPE_IN_PRODUCT,
        });
    }

    await product_type_existed.destroy();

    res.status(RETURN_CODES.CREATED).send({
        return: SHORT_MESSAGES.SUCCESS,
        message: SHORT_MESSAGES.DELETE_SUCESS
    });
})

module.exports = router;