/**
 * CONTROLLER: CODIGOS QR
 */

// === Importar
// Propio
const {dbConsult} = require('../database/db');
const { response } = require('express'); // Response de Express
const bcrypt = require('bcryptjs'); // BcryptJS

/**
 * Devuelve todos los codigos qr de la BD.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta a enviar por el servidor.
 */
const getQr = async( req , res ) => {
    // Pagina y registros por pagina.
    const desde      = Number( req.query.desde ) || 0; // En caso de que no venga nada o no sea un numero se inicializa a 0.
    const registropp = Number( process.env.DOCPAG );

    // Se comprueba si se pasa alguna query por parametro para buscar qr
    const querySearch = req.query.query;
    
    try {
        let query = `SELECT * FROM ${process.env.QRTABLE}`;

        // Se realiza una busqueda de todos los QR para poder hacer la paginación
        let total = await dbConsult(query);

        // Si el usuario no es admin se le devuelven solo sus codigos qr
        if(req.role === 0){
            query += ` WHERE user = ${req.uid}`

            total = await dbConsult(query);

            // Si ademas existe la query de busqueda
            if(querySearch){
                query += ` AND description LIKE '%${querySearch}%'`;
            }
        }else{
            // Si el usuario es amdmin y ademas existe la query de busqueda
            if(querySearch){
                query += ` WHERE description LIKE '%${querySearch}%'`
            }
        }
        

        query += ` LIMIT ${desde}, ${registropp}`;

        const qr = await dbConsult(query);
        
        res.status(200).json({
            msg: 'getQr',
            qr,
            page:{
                desde,
                registropp,
                total: total.length
            }
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            msg: 'Error al listar codigos Qr'
        });
    }
}

/**
 * Devuelve un codigo Qr de la BD por ID.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta a enviar por el servidor.
 */
const getQrById = async( req , res ) => {
    // Se extrae el id del qr desde el path
    const uid = req.params.id;
    try {
        const query = `SELECT * FROM ${process.env.QRTABLE} WHERE idQr = ${uid}`;
        const qr = await dbConsult(query);

        if(qr.length !== 0){
            res.status(200).json({
                msg: 'getQr',
                qr: qr[0]
            });
            return;
        }
        // Si no se encuentra
        else{
            res.status(404).json({
                msg: 'No se ha encontrado el código Qr'
            });
        }
    } catch (error) {
        console.error(error);

        res.status(500).json({
            msg: 'Error devolver el código Qr'
        });
    }
}

/**
 * Crea un nuevo codigo Qr.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta a enviar por el servidor.
 */
const createQr = async( req , res = response ) => {
    // Cuando se le da a añadir qr se redirige a la interfaz de configruacion del qr con datos
    // predetermindados para que se cambien. Por ejemplo descriptiom = Qr de prueba

    // Por si se introducen los campos por llamada
    let {description, tagName, tagDescription, date} = req.body;

    try {
        
        const query = `INSERT INTO ${process.env.QRTABLE} (user) VALUES (${req.uid})`;

        const qr = await dbConsult(query);

        res.status(200).json({
            msg: 'postQR',
            qr
        });
        
    } catch (error) {
        console.error(error);
        
        res.status(500).json({
            msg: 'Error al crear el código QR'
        });
    }
}

/**
 * Actualiza un código Qr.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta a enviar por el servidor.
 */
const updateQr = async( req , res = response ) => {
    const uid = req.params.id;
    
    try{
        // Comprueba que haya un codigo QR con ese ID.
        let qrQuery = `SELECT * FROM ${process.env.QRTABLE} WHERE idQr=${uid}`;
        let qr = await dbConsult(qrQuery);

        if( qr.length === 0 ){
            // Si no lo hay, responde con not found sin cuerpo.
            res.status(404);
            res.send();
            return;
        }

        // Extrae los campos que se pueden enviar por el cuerpo de la peticion para realizar comprobaciones
        let { description, tagName, tagDescription, date, activated} = req.body;
        let updateQuery = `UPDATE ${process.env.QRTABLE} SET `;

        // En este array se van almacenando todos los campos a actualizar
        let updateFields = [];

        // Dependiendo de los campos que se envien la query es de una forma u otra.
        if(description){
            updateFields.push(`description = '${description}'`);
        }
        if(tagName){
            updateFields.push(`tagName = '${tagName}'`);
        }
        if(tagDescription){
            updateFields.push(`tagDescription = '${tagDescription}'`);
        }
        if(date){
            updateFields.push(`date = '${date}'`);
        }
        if( activated === 1 || activated === 0 ){
            updateFields.push(`activated = '${activated}'`);
        }

        // Se unen los campos enviados por la peticion con una coma en el caso que haya mas de uno
        updateQuery += updateFields.join(','); 
        updateQuery += ` WHERE idQr=${uid}`;
        
        // Se actualiza. 
        qr = await dbConsult(updateQuery);
        
        res.status( 200 ).json( qr );

    } catch(error){
        console.error(error);

        res.status(500).json({
            msg: 'ERROR al actualizar código qr'
        });
    }
}

/**
 * Elimina un codigo Qr.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta a enviar por el servidor.
 */
const deleteQr = async(req, res) => {
    const uid = req.params.id;
    
    try{
        // Se comprueba que haya un codigo Qr con ese ID.
        let qrQuery = `SELECT * FROM ${process.env.QRTABLE} WHERE idQr=${uid}`;
        let qr = await dbConsult(qrQuery);
        if( qr.length === 0 ){
            // Si no lo hay, responde con not found sin cuerpo.
            res.status(404);
            res.send();
            return;
        }

        // Se elimina el codigo qr.
        let deleteQuery = `DELETE FROM ${process.env.QRTABLE} WHERE idQr=${uid}`;
        qr = await dbConsult(deleteQuery);

        res.status(200).json({
            msg:'Código Qr eliminado',
            qr
        });
    } catch(error){
        console.error(error);
        res.status(500).json({
            msg: 'Error al borrar código Qr'
        });
    }
}


module.exports = {getQr, createQr, getQrById, updateQr, deleteQr};