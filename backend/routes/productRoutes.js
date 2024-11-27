const express = require('express');
const router = express.Router();
const { Product } = require('../models/product');
const { Product_type } = require('../models/product_type')
const { Stock } = require('../models/stock')
const Validators = require('../models/validators')
const { RETURN_CODES, MESSAGES, SHORT_MESSAGES } = require('../config/constants');

/**
 * Realiza a busca de todos os registros da tabela.
 */
router.get('/', async (req, res) => {
    const result = await Product.findAll({
        include: [{
            attributes: ['name'],
            model: Product_type
        }]
    });

    res.status(RETURN_CODES.CREATED).send(result);
});

/**
 * Realiza a busca do registro com base do ID.
 */
router.get('/:id', async (req, res) => {
    const result = await Validators.product_exist(req.params.id);

    if (result === null) {
        return res.status(RETURN_CODES.NOT_FOUND).send({
            return: RETURN_CODES.NOT_FOUND,
            message: MESSAGES.PRODUCT_NOT_FOUND,
        });
    }

    res.status(RETURN_CODES.CREATED).send(result);
})

/**
 * Realiza a inserção de registro na tabela.
 */
router.post('/', async (req, res) => {
    if (req.body.id_product_type != null || req.body.id_product_type != undefined) {
        const product_type_exist = Validators.product_type_exist(req.body.id_product_type) 
        
        if (!product_type_exist) {
            return res.status(RETURN_CODES.NOT_FOUND).send(MESSAGES.PRODUCT_TYPE_NOT_FOUND);
        }
    }

    const new_Product = await Product.create(req.body);

    const new_Stock = await Stock.create({
        id_product: new_Product.id,
        quantity: 0,
        purchase_price: 0,
        sales_tips: 0
    });

    res.status(RETURN_CODES.CREATED).send(new_Product);
});

/**
 * Atualiza o registro da tabela, com base dos dados informados.
 */
router.put('/:id', async (req, res) => {
    const Product_existed = await Validators.product_exist(req.params.id);

    if (Product_existed === null) {
        return res.status(RETURN_CODES.NOT_FOUND).send({
            return: RETURN_CODES.NOT_FOUND,
            message: MESSAGES.PRODUCT_NOT_FOUND,
        });
    }

    if (req.body.id_product_type != null) {
        if (!Validators.product_type_exist(req.body.id_product_type)) {
            return res.status(RETURN_CODES.NOT_FOUND).send(MESSAGES.PRODUCT_TYPE_NOT_FOUND);
        }
    }

    const edit_Product = await Product_existed.update(req.body, { returning: true });

    res.status(RETURN_CODES.CREATED).send(edit_Product);
})

/**
 * Deleta o registro com base do ID informado.
 */
router.delete('/:id', async (req, res) => {
    const Product_existed = await Validators.product_exist(req.params.id);

    if (Product_existed === null) {
        return res.status(RETURN_CODES.NOT_FOUND).send({
            return: RETURN_CODES.NOT_FOUND,
            message: MESSAGES.PRODUCT_NOT_FOUND,
        });
    }

    await Product_existed.destroy();

    res.status(RETURN_CODES.SUCCESS).send({
        return: RETURN_CODES.SUCCESS,
        message: SHORT_MESSAGES.DELETE_SUCESS
    });
});

module.exports = router;