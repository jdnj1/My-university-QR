/**
 * CONTROLLER: USERS
 */

// === Importar
// Propio
const { response } = require('express'); // Response de Express
const bcrypt = require('bcryptjs'); // BcryptJS
const { userById, userList, userByEmail, userDelete, userCreate, userUpdate } = require('../DAO/user');

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

    // Datos para enviar a la base de datos
    const data = {};

    data.desde = desde;
    data.registropp = registropp;
    data.querySearch = querySearch;

    try {
        const [users, total] = await userList(data);
        
        res.status(200).json({
            msg: 'getUsuarios',
            users,
            page:{
                desde,
                registropp,
                total: total
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
        const user = await userById(uid);

        // Eliminamos la contraseña de la respuesta para que no se envie por seguridad
        delete user.password;

        if(user){
            res.status(200).json({
                msg: 'getUsuario',
                user: user
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
    const {...object} = req.body;

    try {
        // Solo los usuarios administrador pueden crear nuevos usuarios
        if(req.role !== 1){
            res.status(403).json({
                msg: 'Solo los administradores pueden crear usuarios'
            });
            return;
        }

        // Comprueba si el email ya esta en uso
        const existeEmail = await userByEmail(object.email);
        if(existeEmail){
            res.status(400).json({
                msg: 'El email ya existe'
            });
            return;
        }

        // Genera una cadena aleatoria.
        const salt = bcrypt.genSaltSync();

        // Cifra la contrasena con la cadena.
        object.password = bcrypt.hashSync(object.password, salt);


        const user = await userCreate(object);

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
        let user = await userById(uid);

        if( !user ){
            // Si no lo hay, responde con not found sin cuerpo.
            res.status(404);
            res.send();
            return;
        }

        // Extrae los campos que no cabe especificar a la hora de crear.
        let { ...object } = req.body;
        object.uid = uid;

        if(object.email){
            // Se comprueba si el email ya esta en uso
            const existeEmail = await userByEmail(object.email);

            if(!existeEmail){
                // Se comprueba que sea el email del propio usuario
                if(existeEmail.idUser !== uid){
                    res.status(400).json({
                        msg: 'El email ya existe'
                    });
                    return;
                }
            }
        }

        if(object.password){
            // Genera una cadena aleatoria.
            const salt = bcrypt.genSaltSync();

            // Cifra la contrasena con la cadena.
            object.password = bcrypt.hashSync(object.password, salt);
        }
        
        // Se actualiza. 
        user = await userUpdate(object);
        
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
        let user = await userById(userId);
       if(!user){
            // Si no se encuentra al usuario, responde con not found sin cuerpo.
            res.status(404);
            res.send();
            return;
        }

        // Se contrasta la antigua contrasena con el hash existente.
        const validPassword = bcrypt.compareSync( oldPassword , user.password );
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

        let data = {}
        data.password = newpass;
        data.uid = userId;

        // Guarda los cambios.
        await userUpdate(data);

        res.status(200).json({
            msg: 'Contraseña actualizada',
            user: user,
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
        let user = await userById(uid);
        if( !user ){
            // Si no lo hay, responde con not found sin cuerpo.
            res.status(404);
            res.send();
            return;
        }

        // Se elimina usuario.
        //let deleteQuery = `DELETE FROM ${process.env.USERTABLE} WHERE idUser=${uid}`;
        user = await userDelete(uid);

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