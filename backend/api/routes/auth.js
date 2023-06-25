/**
 * ROUTES: LOGIN
 * Base URL: /api/login
 */

// Librerias de terceros
const { Router } = require('express'); // Router de Express
const { check } = require('express-validator'); // check de Express Validator

//Propios
const {login, token} = require('../controllers/auth')
const {validateFields} = require('../middleware/validate-fields')


const router = Router();

router.post('/', [
    check('email', 'El campo email es obligatorio').notEmpty(),
    check('password', 'El campo password es obligatorio').notEmpty(),
    validateFields
], login);

router.get('/token', [
    check('x-token', 'El campo x-token es obligatorio').notEmpty(),
    validateFields
], token);

module.exports = router;