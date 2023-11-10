/**
 * CONTROLLER: CONSULTAS
 */

// === Importar
// Propio
const { response } = require('express'); // Response de Express
const bcrypt = require('bcryptjs'); // BcryptJS
const { consultList, consultById, consutlCreate, consultUpdate, consultDelete } = require('../dao/consult');

/**
 * Devuelve todas las consultas que realiza un codigo qr de la BD.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta a enviar por el servidor.
 */
const getConsult = async( req , res ) => {
    // Pagina y registros por pagina.
    const desde      = Number( req.query.desde ) || 0; // En caso de que no venga nada o no sea un numero se inicializa a 0.
    const registropp = Number( process.env.DOCPAG );

    // Se obtiene el id del codigo QR desde la query
    const idQr = req.query.idQr;

    // Se comprueba si se pasa alguna query por parametro para buscar consulta
    const querySearch = req.query.query;

    // Datos para enviar a la base de datos
    const data = {};
    data.desde = desde;
    data.registropp = registropp;
    data.idQr = idQr;
    data.querySearch = querySearch;

    try {
        
        const [consult, total] = await consultList(data);
        
        res.status(200).json({
            msg: 'getConsult',
            consult,
            page:{
                desde,
                registropp,
                total: total
            }
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            msg: 'Error al listar las consultas'
        });
    }
}

/**
 * Devuelve una llamada de un codigo Qr de la BD por ID.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta a enviar por el servidor.
 */
const getConsultById = async( req , res ) => {
    // Se extrae el id del qr desde el path
    const uid = req.params.id;
    try {
        const consult = await consultById(uid);

        if(consult !== null){
            res.status(200).json({
                msg: 'getConsult',
                consult: consult
            });
            return;
        }
        // Si no se encuentra
        else{
            res.status(404).json({
                msg: 'No se ha encontrado la llamada'
            });
        }
    } catch (error) {
        console.error(error);

        res.status(500).json({
            msg: 'Error devolver la llamada'
        });
    }
}

/**
 * Crea una nueva llamada.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta a enviar por el servidor.
 */
const createConsult = async( req , res = response ) => {
    // Por si se introducen los campos por llamada
    const {...object} = req.body;

    try {   

        //Comprobar que la fecha hasta no sea anterior a la fecha desde
        if(object.dateFrom && object.dateTo){
            if(object.dateFrom >= object.dateTo){
                res.status(400).json({
                    msg: "La fecha 'Hasta' no puede ser anterior a la fecha 'Desde'"
                });

                return;
            }
        }

        const consult = await consutlCreate(object);

        res.status(200).json({
            msg: 'postLlamada',
            consult
        });
        
    } catch (error) {
        console.error(error);
        
        res.status(500).json({
            msg: 'Error al crear la llamada'
        });
    }
}

/**
 * Actualiza una llamada.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta a enviar por el servidor.
 */
const updateConsult = async( req , res = response ) => {
    const uid = req.params.id;
    
    try{
        // Comprueba que haya una llamada con ese ID.
        let consult = await consultById(uid);

        if( !consult ){
            // Si no lo hay, responde con not found sin cuerpo.
            res.status(404);
            res.send();
            return;
        }

        // Extrae los campos que se pueden enviar por el cuerpo de la peticion para realizar comprobaciones
        let { ...object } = req.body;
        object.idConsult = uid;
        
        // Se actualiza. 
        consult = await consultUpdate(object);
        
        res.status( 200 ).json( consult );

    } catch(error){
        console.error(error);

        res.status(500).json({
            msg: 'ERROR al actualizar llamada'
        });
    }
}

/**
 * Elimina una llamada.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta a enviar por el servidor.
 */
const deleteConsult = async(req, res) => {
    const uid = req.params.id;
    
    try{
        // Se comprueba que haya un codigo Qr con ese ID.
        let consult = await consultById(uid);
        if( !consult ){
            // Si no lo hay, responde con not found sin cuerpo.
            res.status(404);
            res.send();
            return;
        }

        const consultDel = await consultDelete(uid);

        res.status(200).json({
            msg:'Llamada eliminada',
            consult: consultDel
        });
    } catch(error){
        console.error(error);
        res.status(500).json({
            msg: 'Error al borrar la llamada'
        });
    }
    
}

module.exports = {getConsult, getConsultById, createConsult, updateConsult, deleteConsult};