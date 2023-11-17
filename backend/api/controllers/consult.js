/**
 * CONTROLLER: CONSULTAS
 */

// === Importar
const {format} = require ('date-fns');
// Propio
const { response } = require('express'); // Response de Express
const { consultList, consultById, consutlCreate, consultUpdate, consultDelete } = require('../dao/consult');
const { validateJSON } = require('../helpers/verify-json');
const { qrById } = require('../dao/qr');

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
    const data = {
        desde,
        registropp,
        idQr,
        querySearch
    };

    try {

        // Se obtiene el qr de la llamada para saber a que usuario pertenece
        let qr = await qrById(idQr);

        // Solo el propietario o los admin pueden obtener las llamadas
        if(req.role !== 1 && req.uid !== qr.user ){
            res.status(403).json({
                msg: 'No tienes permisos para obtener las llamadas'
            });

            return;
        }
        
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
    const idQr = req.params.id;
    try {

        // Se obtiene el qr de la llamada para saber a que usuario pertenece
        let qr = await qrById(idQr);

        // Solo el propietario o los admin pueden obtener la llamada
        if(req.role !== 1 && req.uid !== qr.user ){
            res.status(403).json({
                msg: 'No tienes permisos para obtener  llamada'
            });

            return;
        }

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

        // Solo el propietario del qr puede añadirle llamadas
        if( req.uid != object.qrCode ){
            res.status(403).json({
                msg: 'No eres el propietario de esta llamada'
            })
        }
        
        let data = {
            name: object.name,
            token: object.token,
            typeDate: ( object.typeDate === 0 || object.typeDate === 1 ? object.typeDate : undefined ),
            dateFrom: ( isNaN(Date.parse(object.dateFrom)) ? undefined : object.dateFrom ),
            dateTo: ( isNaN(Date.parse(object.dateTo)) ? undefined : object.dateTo ),
            number: ( object.number >= 0 ? object.number : 0 ),
            unit: ( object.unit >= 1 ? object.unit : 1 ),
            filters: ( validateJSON(object.filters) ? object.filters : undefined ),
            chart: ( object.chart >= 0 && object.chart <= 3 ? object.chart : 0 ),
            qrCode: object.qrCode
        };


        // Se comprueba si alguno de los campos no se han enviado por el cuerpo o es nulo
        Object.keys(data).forEach(key => {
            if( data[key] === undefined || data[key] === null ){
                // Los campos que se borren aqui tendran su valor por defecto
                delete data[key];
            }
        });

        //Comprobar que la fecha hasta no sea anterior a la fecha dedse
        if(data.dateFrom !== undefined && data.dateTo !== undefined){
            if(data.dateFrom >= data.dateTo){
                res.status(400).json({
                    msg: "La fecha 'Hasta' no puede ser anterior a la fecha 'Desde'"
                });

                return;
            }
        }
        else{
            // Si no se pasan las fechas dateFrom tendra la fecha acutal
            // DateTo se le suma los dias indicados en el .env
            data.dateTo = new Date();
            data.dateTo.setDate(data.dateTo.getDate() + Number(process.env.DAYS));
            data.dateTo = format(data.dateTo, "yyyy-MM-dd'T'HH:mm:ss.SSS");
        }

        const consult = await consutlCreate(data);

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

        if( consult === null ){
            // Si no lo hay, responde con not found sin cuerpo.
            res.status(404);
            res.send();
            return;
        }

        // Se obtiene el qr de la llamada para saber a que usuario pertenece
        let qr = await qrById(consult.qrCode);

        // Se comprueba que el usuario no intente actualizar una llamada que no sea suya si no es admin
        if(req.role !== 1 && req.uid !== qr.user ){
            res.status(403).json({
                msg: 'No tienes permisos para actualizar la llamada'
            });

            return;
        }

        // Extrae los campos que se pueden enviar por el cuerpo de la peticion para realizar comprobaciones
        const { ...object } = req.body;

        let data = {
            name: object.name,
            token: object.token,
            typeDate: ( object.typeDate === 0 || object.typeDate === 1 ? object.typeDate : undefined ),
            dateFrom: ( isNaN(Date.parse(object.dateFrom)) ? undefined : object.dateFrom ),
            dateTo: ( isNaN(Date.parse(object.dateTo)) ? undefined : object.dateTo ),
            number: ( object.number >= 0 ? object.number : 0 ),
            unit: ( object.unit >= 1 ? object.unit : 1 ),
            filters: ( validateJSON(object.filters) ? object.filters : undefined ),
            chart: ( object.chart >= 0 && object.chart <= 3 ? object.chart : 0 ),
            operation: ( object.operation >= 1 && object.operation <= 4 ? object.operation : 1 ),
            activated: ( object.activated === 0 || object.activated === 1 ? object.activated : undefined ),
            orderConsult: object.orderConsult,
            idConsult: uid
        };

        // Se comprueba si alguno de los campos no se han enviado por el cuerpo o es nulo
        Object.keys(data).forEach(key => {
            if(data[key] === undefined || data[key] === null){
                delete data[key];
            }
        });
        
        //Comprobar que la fecha hasta no sea anterior a la fecha dedse
        if(data.dateFrom !== undefined && data.dateTo !== undefined){
            if(data.dateFrom >= data.dateTo){
                res.status(400).json({
                    msg: "La fecha 'Hasta' no puede ser anterior a la fecha 'Desde'"
                });

                return;
            }
        }
        
        // Se actualiza. 
        consult = await consultUpdate(data);
        
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
        if( consult === null ){
            // Si no lo hay, responde con not found sin cuerpo.
            res.status(404);
            res.send();
            return;
        }

        await consultDelete(uid);

        res.status(200).json({
            msg:'Llamada eliminada'
        });
    } catch(error){
        console.error(error);
        res.status(500).json({
            msg: 'Error al borrar la llamada'
        });
    }
    
}

module.exports = {getConsult, getConsultById, createConsult, updateConsult, deleteConsult};