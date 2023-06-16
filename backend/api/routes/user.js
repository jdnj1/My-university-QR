/**
 * ROUTES: USER
 * Base URL: /api/users
 */

// Librerias de terceros
const { Router } = require('express'); // Router de Express
const { check } = require('express-validator'); // check de Express Validator

// Propio
const {getUsers, createUsers} = require('../controllers/user')
const {validateFields} = require('../middleware/validate-fields')


const router = Router();

//Llamadas
router.get('/',
    //check('name', '').optional().not().isEmpty().trim(),
    getUsers);


router.post('/', [
    check('email', 'El campi email es obligatorio').notEmpty(),
    check('password', 'El campo password es obligatorio').notEmpty(),
    validateFields
], createUsers);    

module.exports = router;