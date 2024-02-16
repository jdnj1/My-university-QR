/**
 * ROUTES: CODIGOS QR
 * Base URL: /api/qr
 */

// Librerias de terceros
const { Router } = require('express'); // Router de Express
const { check } = require('express-validator'); // check de Express Validator

// Propio
const {getQr, createQr, duplicateQr, getQrById, updateQr, deleteQr, viewQr} = require('../controllers/qr')
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
    validateJWT
], createQr);

router.post('/duplicate', [
    check('qrCode', 'El identificador del qr no es válido').isInt(),
    check('qrDuplicate', 'El identificador del qr no es válido').isInt(),
    validateJWT,
    validateFields
], duplicateQr);

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

router.get('/view/:id', [
    check('id', 'El id del QR no es válido').notEmpty(),
    validateFields
], viewQr);

module.exports = router;