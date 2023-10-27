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

    // Se comprueba si se pasa alguna query por parametro para buscar usuarios
    const querySearch = req.query.query;

    try {
        let query = `SELECT * FROM ${process.env.USERTABLE}`; 

        if(querySearch){
            query += ` WHERE email LIKE '%${querySearch}%'`
        }

        // Se realiza una busqueda de todos los usuarios para poder hacer la paginación
        const total = await dbConsult(query);

        query += ` LIMIT ${desde}, ${registropp}`;

        const users = await dbConsult(query);
        
        res.status(200).json({
            msg: 'getUsuarios',
            users,
            page:{
                desde,
                registropp,
                total: total.length
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
        const query = `SELECT * FROM ${process.env.USERTABLE} WHERE idUser = ${uid}`;
        const user = await dbConsult(query);

        // Eliminamos la contraseña de la respuesta para que no se envie por seguridad
        delete user[0].password;

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
    let {email, password, lim_consult, role} = req.body;

    try {
        // Solo los usuarios administrador pueden crear nuevos usuarios
        if(req.role !== 1){
            res.status(403).json({
                msg: 'Solo los administradores pueden crear usuarios'
            });
            return;
        }

        // Comprueba si el email ya esta en uso
        const qEmail = `SELECT * FROM ${process.env.USERTABLE} WHERE email='${email}'`;
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

        let query = `INSERT INTO ${process.env.USERTABLE} (email, password`;

        // Se comprueba si se pasa el rol y el limite de consultas
        if(lim_consult){
            query += `, lim_consult`;
        }

        if(role === 1 || role === 0){
            query += `, role`;
        }

        query += `) VALUES ('${ email }', '${ password }'`;

        if(lim_consult){
            query += `, ${lim_consult}`;
        }

        if(role === 1 || role === 0){
            query += `, ${role}`;
        }

        query += ')';

        console.log(query);

        const user = await dbConsult(query);

        res.status(200).json({
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

        // Solo los usuarios administrador pueden editar usuarios
        if(req.role !== 1){
            res.status(403).json({
                msg: 'Solo los administradores pueden editar usuarios'
            });
            return;
        }

        // Comprueba que haya un usuario con ese ID.
        let userQuery = `SELECT * FROM ${process.env.USERTABLE} WHERE idUser=${uid}`;
        let user = await dbConsult(userQuery);

        if( user.length === 0 ){
            // Si no lo hay, responde con not found sin cuerpo.
            res.status(404);
            res.send();
            return;
        }

        // Extrae los campos que no cabe especificar a la hora de crear.
        let { email, password, role, lim_consult } = req.body;
        console.log(lim_consult)
        let updateQuery = `UPDATE ${process.env.USERTABLE} SET `;

         // En este array se van almacenando todos los campos a actualizar
         let updateFields = [];

        // Dependiendo de los campos que se envien la query es de una forma u otra.
        if(email){
            // Se comprueba si el email ya esta en uso
            const qEmail = `SELECT * FROM ${process.env.USERTABLE} WHERE email='${email}'`;
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
            updateFields.push(`email = '${email}'`);
        }

        if(password){
            // Genera una cadena aleatoria.
            const salt = bcrypt.genSaltSync();

            // Cifra la contrasena con la cadena.
            password = bcrypt.hashSync(password, salt);
            updateFields.push(`password = '${password}'`);
        }

        if(role === 1 || role === 0){
            updateFields.push(`role = '${role}'`);
        }

        if(lim_consult !== undefined){
            updateFields.push(`lim_consult = ${lim_consult}`);
        }

        // Se unen los campos enviados por la peticion con una coma en el caso que haya mas de uno
        updateQuery += updateFields.join(','); 
        updateQuery += ` WHERE idUser=${uid}`;
        
        // Se actualiza. 
        user = await dbConsult(updateQuery);
        
        res.status( 200 ).json( user );

    } catch(error){
        console.error(error);

        res.status(500).json({
            msg: 'ERROR al actualizar usuario'
        });
    }
}

/**
 * Cambia la contrasena de un usuario.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta a enviar por el servidor.
 */
const changePassword = async( req , res ) => {
    // Se identifica a cada parte.
    const requesterId = req.uid;
    const userId = Number(req.params.id);

    try{
        // Solo el propio usuario puede cambiar su contrasena o un administrador.
        if( req.role !== 1 && userId !== requesterId ){
            res.status( 403 );
            res.send();
            return;
        }

        // El cuerpo de la peticion debe contener la antigua contrasena y la nueva.
        const { oldPassword , newPassword } = req.body;

        // La contrasena nueva y la antigua no pueden ser la misma.
        if( oldPassword === newPassword ){
            res.status( 400 ).json({
                msg: 'La contrasena nueva y la antigua coinciden'
            });
            return;
        }

        // === Se comprueba que la contrasena recibida en la peticion coincida con la actual ===
        
        // Se busca al usuario cuyo ID coincide con el solicitado.
        let userQuery = `SELECT * FROM ${process.env.USERTABLE} WHERE idUser = ${userId}`;
        let user = await dbConsult(userQuery);
       if( user.length === 0 ){
            // Si no se encuentra al usuario, responde con not found sin cuerpo.
            res.status(404);
            res.send();
            return;
        }

        // Se contrasta la antigua contrasena con el hash existente.
        const validPassword = bcrypt.compareSync( oldPassword , user[0].password );
        if( !validPassword ){
            res.status( 403 ).json({
                msg: 'La contrasena proporcionada no coincide con la existente'
            });
            return;
        }

        // ------------------------------------------

        // Se obtiene el hash de la nueva contrasena a partir de una cadena aleatoria.
        const salt = bcrypt.genSaltSync();
        let newpass = bcrypt.hashSync( newPassword , salt );

        // Guarda los cambios.
        let passQuery = `UPDATE ${process.env.USERTABLE} SET password = '${newpass}' WHERE idUser = ${userId}`;
        await dbConsult(passQuery);

        res.status(200).json({
            msg: 'Contraseña actualizada',
            user: user [0],
        });

        return;
    } catch( error ){
        console.error( error );
        res.status(500).json({
            msg: 'Error al realizar el cambio de contrasena'
        });
        return;
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

        // Solo los usuarios administrador pueden eliminar usuarios
        if(req.role !== 1){
            res.status(403).json({
                msg: 'Solo los administradores pueden eliminar usuarios'
            });
            return;
        }
        
        // Se comprueba que haya un usuario con ese ID.
        let userQuery = `SELECT * FROM ${process.env.USERTABLE} WHERE idUser=${uid}`;
        let user = await dbConsult(userQuery);
        if( user.length === 0 ){
            // Si no lo hay, responde con not found sin cuerpo.
            res.status(404);
            res.send();
            return;
        }

        // Se elimina usuario.
        let deleteQuery = `DELETE FROM ${process.env.USERTABLE} WHERE idUser=${uid}`;
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

module.exports = {getUsers, getUserById, createUsers, updateUsers, changePassword, deleteUser};