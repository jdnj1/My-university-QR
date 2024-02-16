/**
 * ROUTES: CONSULTAS
 * Base URL: /api/consult
 */

// Librerias de terceros
const { Router } = require('express'); // Router de Express
const { check } = require('express-validator'); // check de Express Validator

// Propio
const {getConsult, getConsultById, createConsult, updateConsult, downConsult, upConsult, deleteConsult} = require('../controllers/consult')
const {validateFields} = require('../middleware/validate-fields')
const {validateRole} = require('../middleware/validate-role')
const {validateJWT} = require('../middleware/validate-jwt')


const router = Router();

//Llamadas
router.get('/',
    validateJWT,
    getConsult);

router.get('/:id', [
    check('id', 'El identificador no es válido').isInt(),
    validateJWT
], getConsultById); 


router.post('/', [
    check('qrCode', 'El id del QR no es válido').notEmpty().isInt(),
    validateJWT,
    validateFields,
], createConsult);    

router.put('/:id', [
    check('id', 'El identificador no es válido').isInt(),
    validateJWT,
    validateFields,
    validateRole
], updateConsult);

router.patch('/down/:id', [
    check('id', 'El identificador no es válido').isInt(),
    validateJWT,
    validateFields,
    validateRole
], downConsult);

router.patch('/up/:id', [
    check('id', 'El identificador no es válido').isInt(),
    validateJWT,
    validateFields,
    validateRole
], upConsult);

router.delete('/:id', [
    check('id', 'El identificador no es válido').isInt(),
    validateJWT,
    validateFields
], deleteConsult); 

module.exports = router;