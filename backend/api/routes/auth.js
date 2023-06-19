/**
 * ROUTES: LOGIN
 * Base URL: /api/login
 */

// Librerias de terceros
const { Router } = require('express'); // Router de Express
const { check } = require('express-validator'); // check de Express Validator

//Propios
const {login} = require('../controllers/auth')
const {validateFields} = require('../middleware/validate-fields')


const router = Router();

router.post('/', [
    check('email', 'El campo email es obligatorio').notEmpty(),
    check('password', 'El campo password es obligatorio').notEmpty(),
    validateFields
], login);

module.exports = router;