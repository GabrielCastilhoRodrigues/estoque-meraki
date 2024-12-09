const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');

const { Payment } = require('../models/payment');
const { Sale } = require('../models/sale');
const { Person } = require('../models/person')
const { RETURN_CODES, MESSAGES, SHORT_MESSAGES, VALIDATIONS } = require('../config/constants');
const Validators = require('../models/validators')

/**
 * Realiza a busca de todos os registros da tabela.
 */
router.get('/', async (req, res) => {
    const result = await Payment.findAll({
        include: [
            {
                model: Person,
                attributes: ['name']
            },
            {
                model: Sale,
                attributes: ['date', 'total_sale']
            }
        ]
    });

    res.status(RETURN_CODES.CREATED).send(result);
});

/**
 * Realiza a busca do registro com base do ID.
 */
router.get('/:id', async (req, res) => {
    const result = await Validators.payment_exist(req.params.id);

    if (result === null) {
        return res.status(RETURN_CODES.NOT_FOUND).send({
            return: RETURN_CODES.NOT_FOUND,
            message: MESSAGES.PAYMENT_NOT_FOUND,
        });
    }

    res.status(RETURN_CODES.CREATED).send(result);
})

/**
 * Realiza a inserção de registro na tabela.
 */
router.post('/', async (req, res) => {
    const person = await Validators.person_exist(req.body.id_person);

    if (person === null) {
        return res.status(RETURN_CODES.NOT_FOUND).send({
            return: RETURN_CODES.NOT_FOUND,
            message: MESSAGES.PERSON_NOT_FOUND,
        });
    }

    const sale = await Validators.sale_with_person_exist(req.body.id_sale, req.body.id_person);

    if (sale === null) {
        return res.status(RETURN_CODES.NOT_FOUND).send({
            return: RETURN_CODES.NOT_FOUND,
            message: MESSAGES.SALE_WITH_PERSON_NOT_FOUND,
        });
    }

    let new_Payment = null;

    try {
        new_Payment = await Payment.create(req.body);
    }
    catch (error) {
        if (error instanceof Sequelize.DatabaseError) {
            return res.status(RETURN_CODES.BAD_REQUEST).json({ error: error.message });
        }

        console.error(error);
        return res.status(RETURN_CODES.INTERNAL_SERVER_ERROR)
            .json({ error: 'Erro ao criar pagamento.' });
    }

    res.status(RETURN_CODES.CREATED).send(new_Payment);
});

/**
 * Atualiza o registro da tabela, com base dos dados informados.
 */
router.put('/:id', async (req, res) => {
    const payment_exist = await Validators.payment_exist(req.params.id);

    if (payment_exist === null) {
        return res.status(RETURN_CODES.NOT_FOUND).send({
            return: RETURN_CODES.NOT_FOUND,
            message: MESSAGES.PAYMENT_NOT_FOUND,
        });
    }

    if (req.body.id_person != undefined) {
        return res.status(RETURN_CODES.BAD_REQUEST).send({
            return: RETURN_CODES.BAD_REQUEST,
            message: MESSAGES.PAYMENT_PERSON_NOT_EDITABLE
        });
    }

    if (req.body.id_sale != undefined) {
        return res.status(RETURN_CODES.BAD_REQUEST).send({
            return: RETURN_CODES.BAD_REQUEST,
            message: MESSAGES.PAYMENT_SALE_NOT_EDITABLE
        });
    }

    const edit_payment = await payment_exist.update(req.body, { returning: true });

    res.status(RETURN_CODES.CREATED).send(edit_payment);
})

/**
 * Deleta o registro com base do ID informado.
 */
router.delete('/:id', async (req, res) => {
    const payment_exist = await Validators.payment_exist(req.params.id);

    if (payment_exist === null) {
        return res.status(RETURN_CODES.NOT_FOUND).send({
            return: RETURN_CODES.NOT_FOUND,
            message: MESSAGES.PAYMENT_NOT_FOUND,
        });
    }

    await payment_exist.destroy();

    res.status(RETURN_CODES.CREATED).send({
        return: SHORT_MESSAGES.SUCCESS,
        message: SHORT_MESSAGES.DELETE_SUCESS
    });
})

module.exports = router;