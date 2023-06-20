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
    const desde      = Number( req.query.desde ) || 0; // En caso de que no venga nada o no sea un numero se inicializa a 0.
    const registropp = Number( process.env.DOCPAG );

    try {
        const query = `SELECT * FROM user LIMIT ${desde}, ${registropp}`;
        const users = await dbConsult(query);
        
        res.status(200).json({
            msg: 'getUsuarios',
            users,
            page:{
                desde,
                registropp,
                total: users.length
            }
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            msg: 'Error al listar usuarios'
        });
    }
}

/**
 * Devuelve un usuario de la BD por ID.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta a enviar por el servidor.
 */
const getUserById = async( req , res ) => {
    // Se extrae el id del usuario desde el path
    const uid = req.params.id;
    try {
        const query = `SELECT * FROM user WHERE idUser = ${uid}`;
        const user = await dbConsult(query);

        if(user.length !== 0){
            res.status(200).json({
                msg: 'getUsuario',
                user: user[0]
            });
            return;
        }
        // Si no se encuentra
        else{
            res.status(404).json({
                msg: 'No se ha encontrado al usuario'
            });
        }
    } catch (error) {
        console.error(error);

        res.status(500).json({
            msg: 'Error devolver usuario'
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
        let { email, password, role, lim_consult } = req.body;
        let updateQuery = `UPDATE user SET`;

        // Dependiendo de los campos que se envien la query es de una forma u otra.
        if(email){
            // Se comprueba si el email ya esta en uso
            const qEmail = `SELECT * FROM user WHERE email='${email}'`;
            const existeEmail = await dbConsult(qEmail);

            if(existeEmail.length !== 0){
                // Se comprueba que sea el email del propio usuario
                if(existeEmail[0].idUser !== uid){
                    res.status(400).json({
                        msg: 'El email ya existe'
                    });
                    return;
                }
            }
            updateQuery += ` email = '${email}'`;
        }

        // Los siguientes campos solo se pueden modificar por un administrador
        if(req.role === 1){
            if(role !== undefined){
                updateQuery += `, role = ${role}`;
            }

            if(lim_consult !== undefined){
                updateQuery += `, lim_consult = ${lim_consult}`;
            }
        }

        updateQuery += ` WHERE idUser=${uid}`;
        
        // Se actualiza. 
        //user = await dbConsult(updateQuery);
        
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

module.exports = {getUsers, getUserById, createUsers, updateUsers, deleteUser};