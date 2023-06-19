// === Importar
// Propio
const {dbConsult} = require('../database/db');
const { response } = require('express'); // Response de Express
const bcrypt = require('bcryptjs'); // BcryptJS

/**
 * Devuelve todos los usuarios de la BD.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta a enviar por el servidor.
 */
const getUsers = async( req , res ) => {
    // Pagina y registros por pagina.
    // const desde      = Number( req.query.desde ) || 0; // En caso de que no venga nada o no sea un numero se inicializa a 0.
    // const registropp = Number( process.env.DOCPAG );

    try {
        const query = 'SELECT * FROM user';
        const users = await dbConsult(query);
        console.log(users.length)
        
        res.json({
            ok: true,
            msg: 'getUsuarios',
            users
        });
    } catch (error) {
        console.error(error);

        res.status(400).json({
            msg: 'Error al listar usuarios'
        });
    }
        

}

/**
 * Crea un nuevo usuario.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta a enviar por el servidor.
 */
const createUsers = async( req , res = response ) => {
    // Pagina y registros por pagina.
    // const desde      = Number( req.query.desde ) || 0; // En caso de que no venga nada o no sea un numero se inicializa a 0.
    // const registropp = Number( process.env.DOCPAG );

    let {email, password} = req.body;

    // Comprueba si el email ya esta en uso
    const qEmail = `SELECT * FROM user WHERE email='${email}'`;
    const existeEmail = await dbConsult(qEmail);

    try {
        if(existeEmail.length != 0){
            res.status(400).json({
                msg: 'El email ya existe'
            });
            return;
        }

        // Genera una cadena aleatoria.
        const salt = bcrypt.genSaltSync();

        // Cifra la contrasena con la cadena.
        password = bcrypt.hashSync(password, salt);

        const query = `INSERT INTO user (email, password) VALUES ('${ email }', '${ password }')`;
        console.log(query)
        const user = await dbConsult(query);

        res.json({
            ok: true,
            msg: 'postUsuarios',
            user
        });
        
    } catch (error) {
        console.error(error);
        
        res.status(400).json({
            msg: 'Error al crear el usuario'
        });
    }

}

module.exports = {getUsers, createUsers};