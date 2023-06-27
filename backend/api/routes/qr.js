/**
 * ROUTES: CODIGOS QR
 * Base URL: /api/qr
 */

// Librerias de terceros
const { Router } = require('express'); // Router de Express
const { check } = require('express-validator'); // check de Express Validator

// Propio
const {getQr, createQr, getQrById, updateQr, deleteQr} = require('../controllers/qr')
const {validateFields} = require('../middleware/validate-fields')
const {validateRole} = require('../middleware/validate-role')
const {validateJWT} = require('../middleware/validate-jwt')


const router = Router();

//Llamadas
router.get('/',
    validateJWT,
    getQr);

router.get('/:id', [
    check('id', 'El identificador no es válido').isInt(),
    validateJWT
], getQrById); 


router.post('/', [
    check('description', 'El campo descripción es obligatorio').notEmpty(),
    check('tagName', 'El campo tagName es obligatorio').notEmpty(),
    check('tagDescription', 'El campo tagDescription es obligatorio').notEmpty(),
    validateJWT,
    validateFields,
    validateRole
], createQr);    

router.put('/:id', [
    check('id', 'El identificador no es válido').isInt(),
    validateJWT,
    validateFields,
    validateRole
], updateQr);    

router.delete('/:id', [
    check('id', 'El identificador no es válido').isInt(),
    validateJWT,
    validateFields
], deleteQr); 

module.exports = router;