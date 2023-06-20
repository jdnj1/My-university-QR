/**
 * ROUTES: USER
 * Base URL: /api/users
 */

// Librerias de terceros
const { Router } = require('express'); // Router de Express
const { check } = require('express-validator'); // check de Express Validator

// Propio
const {getUsers, getUserById, createUsers, updateUsers, deleteUser} = require('../controllers/user')
const {validateFields} = require('../middleware/validate-fields')
const {validateRole} = require('../middleware/validate-role')
const {validateJWT} = require('../middleware/validate-jwt')


const router = Router();

//Llamadas
router.get('/',
    validateJWT,
    getUsers);

router.get('/:id', [
    check('id', 'El identificador no es válido').isInt(),
    validateJWT
], getUserById); 


router.post('/', [
    check('email', 'El campo email es obligatorio').notEmpty(),
    check('password', 'El campo password es obligatorio').notEmpty(),
    validateFields,
    validateRole
], createUsers);    

router.put('/:id', [
    check('id', 'El identificador no es válido').isInt(),
    validateJWT,
    validateFields,
    validateRole
], updateUsers);    

router.delete('/:id', [
    check('id', 'El identificador no es válido').isInt(),
    validateJWT,
    validateFields
], deleteUser); 

module.exports = router;