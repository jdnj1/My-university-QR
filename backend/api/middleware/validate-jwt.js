/**
 * VALIDADOR DE JSON WEB TOKEN
 */

const jwt = require('jsonwebtoken'); // JSON Web Token

/**
 * Valida un JSON Web Token. Impide la ejecucion de otras funciones si no se verifica.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta del servidor.
 * @param {*} next Siguiente metodo a ejecutar.
 */
const validateJWT = (req, res, next) => {
    const token = req.header('x-token');
    
    if (!token) {
        return res.status(400).json({
            msg: 'Falta token de autorización'
        });
    }
    try {
        const { uid, role, ...object } = jwt.verify(token, process.env.JWTSECRET);
        
        // Se guarda el UID en el objeto peticion, "req". "req" es accesible desde cualquier parte.
        req.uid = uid;
        req.role = role;
        next();
    } catch (err) {
        return res.status(400).json({
            msg: 'Token no válido'
        })
    }
}
module.exports = { validateJWT }
