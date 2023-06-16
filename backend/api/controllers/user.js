
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

    connection.query('SELECT * FROM user', function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results);
      });
    
    res.json({
        ok: true,
        msg: 'getUsuarios'
    });

    console.log('vaaaa');
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

    connection.query('SELECT * FROM user', function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results);
      });
    
    res.json({
        ok: true,
        msg: 'getUsuarios'
    });

    console.log('vaaaa');
}

module.exports = {getUsers, createUsers};