/**
 * CONTROLLER: USERS
 */

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
        
        res.status(200).json({
            ok: true,
            msg: 'getUsuarios',
            users
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
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

    try {
        // Comprueba si el email ya esta en uso
        const qEmail = `SELECT * FROM user WHERE email='${email}'`;
        const existeEmail = await dbConsult(qEmail);
        if(existeEmail.length !== 0){
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

        res.status(200).json({
            ok: true,
            msg: 'postUsuarios',
            user
        });
        
    } catch (error) {
        console.error(error);
        
        res.status(500).json({
            msg: 'Error al crear el usuario'
        });
    }
}

/**
 * Actualiza un usuario.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta a enviar por el servidor.
 */
const updateUsers = async( req , res = response ) => {
    const uid = req.params.id;
    
    try{
        // Comprueba que haya un usuario con ese ID.
        let userQuery = `SELECT * FROM user WHERE idUser=${uid}`;
        let user = await dbConsult(userQuery);

        if( user.length === 0 ){
            // Si no lo hay, responde con not found sin cuerpo.
            res.status(404);
            res.send();
            return;
        }

        // Extrae los campos que no cabe especificar a la hora de crear y el objeto por separado.
        let { email, password, role } = req.body;

        //CON JWT COMPRIBAR SI PUEDE CAMBIAR EL ROL


        // Se actualiza. 
        let updateQuery = `UPDATE user SET email='${email}' WHERE idUser=${uid}`;
        user = await dbConsult(updateQuery);

        // Responde con el recurso modificado tal como esta en el servidor.
        res.status( 200 ).json( user );

    } catch(error){
        console.error(error);

        res.status(500).json({
            msg: 'ERROR al actualizar usuario'
        });
    }
}

/**
 * Elimina un usuario.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta a enviar por el servidor.
 */
const deleteUser = async(req, res) => {
    const uid = req.params.id;
    
    try{
        // Se comprueba que haya un usuario con ese ID.
        let userQuery = `SELECT * FROM user WHERE idUser=${uid}`;
        let user = await dbConsult(userQuery);
        if( user.length === 0 ){
            // Si no lo hay, responde con not found sin cuerpo.
            res.status(404);
            res.send();
            return;
        }

        // Se elimina usuario.
        let deleteQuery = `DELETE FROM user WHERE idUser=${uid}`;
        user = await dbConsult(deleteQuery);

        //if( req.role !== 'admin' ) delete user[ 'ip' ];

        res.status(200).json({
            msg:'Usuario eliminado',
            user
        });
    } catch(error){
        console.error(error);
        res.status(500).json({
            msg: 'Error al borrar usuario'
        });
    }
}

module.exports = {getUsers, createUsers, updateUsers, deleteUser};