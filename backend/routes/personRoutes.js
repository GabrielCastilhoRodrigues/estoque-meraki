const express = require('express');
const router = express.Router();
const { Person } = require('../models/person');
const { RETURN_CODES, MESSAGES, SHORT_MESSAGES, VALIDATIONS } = require('../config/constants');
const Validators = require('../models/validators')

/**
 * Realiza a busca de todos os registros da tabela.
 */
router.get('/', async (req, res) => {
    const result = await Person.findAll();

    res.status(RETURN_CODES.CREATED).send(result);
});

/**
 * Realiza a busca do registro com base do ID.
 */
router.get('/:id', async (req, res) => {
    const result = await Validators.person_exist(req.params.id);

    if (result === null) {
        return res.status(RETURN_CODES.NOT_FOUND).send({
            return: RETURN_CODES.NOT_FOUND,
            message: MESSAGES.PERSON_NOT_FOUND,
        });
    }

    res.status(RETURN_CODES.CREATED).send(result);
})

/**
 * Realiza a inserção de registro na tabela.
 */
router.post('/', async (req, res) => {
    const new_person = await Person.create(req.body);

    res.status(RETURN_CODES.CREATED).send(new_person);
});

/**
 * Atualiza o registro da tabela, com base dos dados informados.
 */
router.put('/:id', async (req, res) => {
    const person_exist = await Validators.person_exist(req.params.id);

    if (person_exist === null) {
        return res.status(RETURN_CODES.NOT_FOUND).send({
            return: RETURN_CODES.NOT_FOUND,
            message: MESSAGES.PERSON_NOT_FOUND,
        });
    }

    const edit_person = await person_exist.update(req.body, { returning: true });

    res.status(RETURN_CODES.CREATED).send(edit_person);
})

/**
 * Deleta o registro com base do ID informado.
 */
router.delete('/:id', async (req, res) => {
    const person_exist = await Validators.person_exist(req.params.id);

    if (person_exist === null) {
        return res.status(RETURN_CODES.NOT_FOUND).send({
            return: RETURN_CODES.NOT_FOUND,
            message: MESSAGES.PERSON_NOT_FOUND,
        });
    }

    await person_exist.destroy();

    res.status(RETURN_CODES.CREATED).send({
        return: SHORT_MESSAGES.SUCCESS,
        message: SHORT_MESSAGES.DELETE_SUCESS
    });
})

module.exports = router;