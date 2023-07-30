/**
 * ROUTES: SMARTUNIVERSITY
 * Base URL: /api/smartuni
 */

// Librerias de terceros
const { Router } = require('express'); // Router de Express
const { check } = require('express-validator'); // check de Express Validator

// Propio
const {getData, getDataOperation} = require('../controllers/smartuni')
const {validateFields} = require('../middleware/validate-fields')
const {validateRole} = require('../middleware/validate-role')
const {validateJWT} = require('../middleware/validate-jwt')


const router = Router();

//Llamadas
router.post('/operation',
    getDataOperation);

router.post('/', [
    check('time_start', 'El campo time_start es obligatorio').notEmpty(),
    check('time_end', 'El campo time_start es obligatorio').notEmpty(),
    validateFields,
], getData);    


module.exports = router;