/**
 * VALIDADOR DE CAMPOS DE FORMULARIOS
 */

// === IMPORTAR ===

// Librerias de terceros
const { response } = require('express'); // Response de Express
const { validationResult } = require('express-validator'); // ValidationResult de Express Validator

// Propio
//const { HTTP } = require( '../constantes.js' ); // Codigos de estado HTTP
//const { logRequest } = require( '../controllers/log.js' ); // Registro

// ----------------



/**
 * Valida los campos de un formulario.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta del servidor.
 * @param {*} next Siguiente metodo a ejecutar.
 */
const validateFields = (req, res = response, next) => {
    const erroresVal = validationResult(req);
    if (!erroresVal.isEmpty()) {
        res.status( 400 ).json({
            errores: erroresVal.mapped()
        });
        return;
    }
    next();
}

// Marcar para exportar.
module.exports = { validateFields }