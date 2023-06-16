// === Importar
// Propio
const {dbConsult} = require('../database/db');

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
    const query = 'SELECT * FROM user';
    const users = await dbConsult(query);
    console.log(users.length)
    
    res.json({
        ok: true,
        msg: 'getUsuarios',
        users
    });

}

/**
 * Crea un nuevo usuario.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta a enviar por el servidor.
 */
const createUsers = async( req , res ) => {
    // Pagina y registros por pagina.
    // const desde      = Number( req.query.desde ) || 0; // En caso de que no venga nada o no sea un numero se inicializa a 0.
    // const registropp = Number( process.env.DOCPAG );

    const {email, password} = req.body;
    const query = `INSERT INTO user (email, password) VALUES ('${ email }', ${ password })`;
    console.log(query)
    const user = await dbConsult(query);
    
    res.json({
        ok: true,
        msg: 'postUsuarios',
        user
    });

}

module.exports = {getUsers, createUsers};