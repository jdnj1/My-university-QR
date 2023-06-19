const { response } = require('express'); // Response de Express

// Roles reconocidos
const rolesAccepted = ['basic', 'admin'];

/**
 * Valida el rol.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta del servidor.
 * @param {*} next Siguiente metodo a ejecutar.
 */
const validateRole = (req, res = response, next) => {
    const role = req.body.role;

    if( role && !rolesAccepted.includes( role ) ){
        res.status( HTTP.error_client.unauthorized ).json({
            msg: 'Rol no permitido'
        });
        return;
    }

    next();
}

// Marcar para exportar.
module.exports = { validateRole }