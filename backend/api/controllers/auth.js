/**
 * CONTROLLER: LOGIN
 */

// Librerias de terceros
const { response } = require('express'); // Response de Express
const bcrypt = require('bcryptjs'); // Bcrypt

// Propio
//const { generateJWT , JWTExpire } = require( '../helpers/jwt.js' ); // Generador de JSON Web Token
const {dbConsult} = require('../database/db');
const {generateJWT} = require('../helpers/jwt')

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
        const qEmail = `SELECT * FROM user WHERE email='${email}'`;
        const user = await dbConsult(qEmail);

        if(user.length === 0){
            res.status(401).json({
                msg: 'Email o contraseña incorrectos'
            });
            return;
        }

        // Se comprueba si es la contrasena que nos pasan es la del usuario.
        const validPassword = bcrypt.compareSync(password, user[0].password);
        if( !validPassword ){
            res.status(403).json({
                msg: 'Email o contraseña incorrectos'
            });
            return;
        }
        
        // Genera un token.
        const token = await generateJWT( user[0].idUser , user[0].role );

        // Responde con el token.
        //let userIdString = user._id.toString();

        // Anade el UID a la peticion.
        //req[ 'uid' ] = userIdString;


        res.status( 200 ).json( {
            user: user[0] ,
            token
            //expires: JWTExpire
        } );

        // Quita el UID a la peticion.
        //delete req[ 'uid' ];

        return;
    } catch( error ){
        console.error( error );

        res.status(500).json({
            msg: 'Error al realizar el login'
        });
        return;
    }
}

module.exports = {login}


