const express = require('express');
const router = express.Router();
const { Sale } = require('../models/sale');
const { Person } = require('../models/person')
const { RETURN_CODES, MESSAGES, SHORT_MESSAGES, VALIDATIONS } = require('../config/constants');
const Validators = require('../models/validators')

/**
 * Realiza a busca de todos os registros da tabela.
 */
router.get('/', async (req, res) => {
    const result = await Sale.findAll({
        include: {
            model: Person,
            attributes: ['name']
        }
    });

    res.status(RETURN_CODES.CREATED).send(result);
});

/**
 * Realiza a busca do registro com base do ID.
 */
router.get('/:id', async (req, res) => {
    const result = await Validators.sale_exist(req.params.id);

    if (result === null) {
        return res.status(RETURN_CODES.NOT_FOUND).send({
            return: RETURN_CODES.NOT_FOUND,
            message: MESSAGES.SALE_NOT_FOUND,
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

    const new_Sale = await Sale.create(req.body);

    res.status(RETURN_CODES.CREATED).send(new_Sale);
});

/**
 * Atualiza o registro da tabela, com base dos dados informados.
 */
router.put('/:id', async (req, res) => {
    const sale_exist = await Validators.sale_exist(req.params.id);

    if (sale_exist === null) {
        return res.status(RETURN_CODES.NOT_FOUND).send({
            return: RETURN_CODES.NOT_FOUND,
            message: MESSAGES.SALE_NOT_FOUND,
        });
    }

    if (req.body.id_person != undefined) {
        return res.status(RETURN_CODES.BAD_REQUEST).send({
            return: RETURN_CODES.BAD_REQUEST,
            message: MESSAGES.SALE_PERSON_NOT_EDITABLE
        });
    }

    const edit_Sale = await sale_exist.update(req.body, { returning: true });

    res.status(RETURN_CODES.CREATED).send(edit_Sale);
})

/**
 * Deleta o registro com base do ID informado.
 */
router.delete('/:id', async (req, res) => {
    const sale_exist = await Validators.sale_exist(req.params.id);

    if (sale_exist === null) {
        return res.status(RETURN_CODES.NOT_FOUND).send({
            return: RETURN_CODES.NOT_FOUND,
            message: MESSAGES.SALE_NOT_FOUND,
        });
    }

    await sale_exist.destroy();

    res.status(RETURN_CODES.CREATED).send({
        return: SHORT_MESSAGES.SUCCESS,
        message: SHORT_MESSAGES.DELETE_SUCESS
    });
})

module.exports = router;