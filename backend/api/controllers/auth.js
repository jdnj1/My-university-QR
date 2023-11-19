/**
 * CONTROLLER: LOGIN
 */

// Librerias de terceros
const { response } = require('express'); // Response de Express
const bcrypt = require('bcryptjs'); // Bcrypt
const jwt = require('jsonwebtoken'); // JSON Web Token

// Propio
const {generateJWT} = require('../helpers/jwt');
const { userByEmail, userById, getHash } = require('../dao/user');

/**
 * Resuelve un email y una contrasena y responde con un JSON Web Token.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta a enviar por el servidor.
 */
const login = async( req , res = response ) => {
    // Se extraen los campos "email" y "password" del cuerpo de la peticion.
    const { email, password } = req.body;
    
    try{
        // Se busca al usuario.
        const user = await userByEmail(email);

        if( user === null ){
            res.status(401).json({
                msg: 'Email o contraseña incorrectos'
            });
            return;
        }

        // Se obtiene la contraseña hasheada del usuario para comprobar
        const hash = await getHash(user.idUser);

        // Se comprueba si es la contrasena que nos pasan es la del usuario.
        const validPassword = bcrypt.compareSync(password, hash.password);
        if( !validPassword ){
            res.status(403).json({
                msg: 'Email o contraseña incorrectos'
            });
            return;
        }
        
        // Genera un token
        const token = await generateJWT( user.idUser , user.role );

        res.status( 200 ).json( {
            user: user,
            token
        } );

        return;
    } catch( error ){
        console.error( error );

        res.status(500).json({
            msg: 'Error al realizar el login'
        });
        return;
    }
}

/**
 * Comprueba que el token pasado por la cabecera es valido
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta a enviar por el servidor.
 */
const token = async( req , res = response ) => {
    // Se extrae el token de la cabecera
    const token = req.headers['x-token'];

    try{
        // Se comprueba si el token es correcto
        const { uid, role } = jwt.verify(token, process.env.JWTSECRET);

        // Comprobamos que el id del token recibido corresponde al usuario
        const user = await userById(uid);

        if( user === null ){
            res.status(403).json({
                msg: 'Token no valido'
            });
            return;
        }

        // Se renueva el token para la fecha de expiración
        const nuevotoken = await generateJWT( uid, role );

        res.status( 200 ).json({
            msg: 'token',
            token: nuevotoken
        });

        return;
    } catch( error ){

        res.status(403).json({
            msg: 'token no válido'
        });
        return;
    }
}

module.exports = {login, token}


