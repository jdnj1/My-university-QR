/**
 * CONTROLLER: USERS
 */

// === Importar
const { response } = require('express'); // Response de Express
const bcrypt = require('bcryptjs'); // BcryptJS
const { userById, userList, userByEmail, userDelete, userCreate, userUpdate, getHash } = require('../dao/user');
const passwordValidator = require('password-validator');


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
    const data = {
        desde,
        registropp,
        querySearch
    };

    try {

        // Solo los usuarios administrador pueden listar usuarios
        if(req.role !== 1){
            res.status(403).json({
                msg: 'Solo los administradores pueden listar usuarios'
            });
            return;
        }

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

        if(user !== null){
            
            // Solo los usuarios administrador pueden listar usuarios y el propio usuario
            if(req.role !== 1 && req.uid !== user.idUser){
                res.status(403).json({
                    msg: 'No tienes permisos para listar usuarios'
                });
                return;
            }

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
        if( existeEmail !== null ){
            res.status(400).json({
                msg: 'El email ya existe'
            });
            return;
        }

        // Comprueba si la contraseña cumple con los requisitos
        if(!checkPassword(object.password)){
            res.status(400).json({
                msg: 'La contraseña de debe tener minimo 8 caracteres, 2 dígitos, tener al menos una mayúscula y minúscula y no debe tener espacios'
            });
            return;
        }

        let data = {
            email: object.email,
            password: object.password,
            role: ( object.role === 0 || object.role === 1 ? object.role : 0 ),
            lim_consult: ( object.lim_consult >= 0 ? object.lim_consult : 10 )
        }

        // Genera una cadena aleatoria.
        const salt = bcrypt.genSaltSync();

        // Cifra la contrasena con la cadena.
        data.password = bcrypt.hashSync(data.password, salt);

        await userCreate(data);

        res.status(200).json({
            msg: 'Usuario creado',
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

        if( user === null ){
            // Si no lo hay, responde con not found sin cuerpo.
            res.status(404);
            res.send();
            return;
        }

        // Extrae los campos que no cabe especificar a la hora de crear.
        const { ...object } = req.body;

        let data = {
            email: object.email,
            password: object.password,
            role: ( object.role === 0 || object.role === 1 ? object.role : 0 ),
            lim_consult: ( object.lim_consult >= 0 ? object.lim_consult : 10 ),
            idUser: uid
        }

        // Se comprueba si alguno de los campos no se han enviado por el cuerpo o es nulo
        Object.keys(data).forEach(key => {
            if(data[key] === undefined || data[key] === null || data[key] === ''){
                delete data[key];
            }
        });

        if(data.email !== undefined){
            // Se comprueba si el email ya esta en uso
            const existeEmail = await userByEmail(data.email);

            if( existeEmail !== null ){
                res.status(400).json({
                    msg: 'El email ya existe'
                });
                return;
            }
        }

        if(data.password !== undefined){
            // Comprueba si la contraseña cumple con los requisitos
            if(!checkPassword(data.password)){
                res.status(400).json({
                    msg: 'La contraseña de debe tener minimo 8 caracteres, 2 dígitos, tener al menos una mayúscula y minúscula y no debe tener espacios'
                });
                return;
            }

            // Genera una cadena aleatoria.
            const salt = bcrypt.genSaltSync();

            // Cifra la contrasena con la cadena.
            data.password = bcrypt.hashSync(data.password, salt);
        }
        
        // Se actualiza. 
        await userUpdate(data);
        
        res.status( 200 ).json( {msg: 'Usuario actualizado'} );

    } catch(error){
        console.error(error);

        res.status(500).json({
            msg: 'Error al actualizar usuario'
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
        
        // Se busca al usuario cuyo ID coincide con el solicitado.
        let user = await userById(userId);
        if( user === null ){
            // Si no se encuentra al usuario, responde con not found sin cuerpo.
            res.status(404);
            res.send();
            return;
        }

        // Se obtiene la contraseña hasheada del usuario para comprobar
        const hash = await getHash(user.idUser);

        // Se contrasta la antigua contrasena con el hash existente.
        const validPassword = bcrypt.compareSync( oldPassword , hash.password );
        if( !validPassword ){
            res.status( 403 ).json({
                msg: 'La contraseña proporcionada no coincide con la existente'
            });
            return;
        }

        // Comprueba si la nueva contraseña cumple con los requisitos
        if(!checkPassword(newPassword)){
            res.status(400).json({
                msg: 'La contraseña de debe tener minimo 8 caracteres, 2 dígitos, tener al menos una mayúscula y minúscula y no debe tener espacios'
            });
            return;
        }

        // Se obtiene el hash de la nueva contrasena a partir de una cadena aleatoria.
        const salt = bcrypt.genSaltSync();
        let newpass = bcrypt.hashSync( newPassword , salt );

        const data = {
            password: newpass,
            idUser: userId
        }

        // Guarda los cambios.
        await userUpdate(data);

        res.status(200).json({
            msg: 'Contraseña actualizada',
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
        if( user === null ){
            // Si no lo hay, responde con not found sin cuerpo.
            res.status(404);
            res.send();
            return;
        }

        // Se elimina usuario.
        await userDelete(uid);

        res.status(200).json({
            msg:'Usuario eliminado',
        });
    } catch(error){
        console.error(error);
        res.status(500).json({
            msg: 'Error al borrar usuario'
        });
    }
}

// Funcion que comprueba si la contraseña cumple los requisitos
const checkPassword = (password) => {
    const shcema = new passwordValidator();
    
    shcema
        .is().min(8)
        .has().uppercase()
        .has().lowercase()
        .has().digits(2)
        .has().not().spaces();

    return shcema.validate(password);


}

module.exports = {getUsers, getUserById, createUsers, updateUsers, changePassword, deleteUser};