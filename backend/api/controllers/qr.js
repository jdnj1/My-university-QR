/**
 * CONTROLLER: CODIGOS QR
 */

// === Importar

const {dbConsult} = require('../database/db');
const { response } = require('express'); // Response de Express
const bcrypt = require('bcryptjs'); // BcryptJS
const axios = require('axios');
const {format} = require ('date-fns');

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

        // Creamos la fecha de validez del QR
        let date = new Date();
        date.setDate(date.getDate() + Number(process.env.DAYS));
        date = format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS");
        
        const query = `INSERT INTO ${process.env.QRTABLE} (date, user) VALUES ('${date}', ${req.uid})`;

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

/**
 * Llamada de la vista de los QR.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta a enviar por el servidor.
 */
const viewQr = async(req, res) => {
    // Variable con el tipo de operaciones
    const op = [
        "max",
        "min",
        "last"
    ];

    // Variable con el tipo de graficas
    const type = [
        "line",
        "bar",
        "gauge",
        "number"
    ]

    // Variable con el resultado de las llamadas
    let results = {};

    // Se extrae el id del qr desde el path
    const uid = req.params.id;
    
    try{
        // Obtenemos el código QR
        let query = `SELECT * FROM ${process.env.QRTABLE} WHERE idQr = ${uid}`;
        const qr = await dbConsult(query);

        // Si no se encuentra
        if(qr.length === 0){
            res.status(404).json({
                msg: 'No se ha encontrado el código Qr'
            });
            return;
        }

        results.titleQr = qr[0].description;

        // Si existe, primero se debe comprobar que el qr no este desactivado y caducado
        if(qr[0].activated !== 1){
            res.status(404).json({
                msg: 'desactivado'
            });
            return;
        }

        const now = new Date();

        if(qr[0].date < now){
            res.status(404).json({
                msg: 'caducado'
            });
            return;
        }

        // Si todo esta correcto, obtener sus llamadas
        query = `SELECT * FROM ${process.env.CONSULTTABLE} WHERE qrCode = ${uid}`;
        const consults = await dbConsult(query);


        // Si el códgio QR no tiene llamadas
        if(consults.length === 0){
            res.status(404).json({
                msg: 'El qr no tiene llamadas',
            });
            return;
        }

        let charts = [];
        
        // Se iteran todas las llamadas que tenga y se comprueba que esten activadas
        for(let consult of consults){

            if(consult.activated === 1){

                // Adaptamos las fechas
                consult.dateFrom = format(new Date(consult.dateFrom), "yyyy-MM-dd'T'HH:mm:ss.SSS") + 'Z';

                consult.dateTo = format(new Date(consult.dateTo), "yyyy-MM-dd'T'HH:mm:ss.SSS") + 'Z';

                // Se copmprueba que tipo de operacion tiene
                if(consult.operation > 1){
                    // Max, min, last

                    // Pasamos los filtros a JSON
                    consult.filters = JSON.parse(consult.filters);

                    let data = {
                        token: consult.token,
                        dateFrom: consult.dateFrom, //cambiar por cons.dateFrom
                        dateTo: consult.dateTo,
                        operation: op[consult.operation - 2],
                        uid: Object.values(consult.filters)[0],
                        name: Object.values(consult.filters)[1]
                    }

                    // Se realiza la peticion a Smart University
                    let res = await axios.post(`${process.env.URLAPI}/smartuni/operation`, data);
                    data = res.data.result;
                    //console.log(data)

                    // Rellenar el objeto con los datos de la llamada
                    charts.push({
                        title: consult.name,
                        description: data.values[0][data.columns.indexOf('description')],
                        type: consult.chart,
                        values: [data.values[0][data.columns.indexOf(op[consult.operation - 2])]],
                        name: data.values[0][data.columns.indexOf('name')],
                        metric: data.values[0][data.columns.indexOf('metric')]
                    });

                }
                else{
                    // Todos los datos disponibles

                    // Se comienza a montar el cuerpo de la petición
                    let body = `{"token": "${consult.token}", "time_start": "${consult.dateFrom}", 
                        "time_end": "${consult.dateTo}", "filters":[`;

                    // Añadir los filtros
                    if(consult.filter !== ''){
                        // Pasamos los filtros a JSON
                        consult.filters = JSON.parse(consult.filters);

                        Object.entries(consult.filters).forEach((key, index) => {
                        // Comprobar si tienen muchos valores una misma clave
                        key[1] = key[1].split(',');

                        body += `{"filter": "${key[0]}", "values": [`;
                        key[1].forEach((elem, index) => {
                            body += `"${elem}"`;

                            if(index !== key[1].length - 1){
                            body += ','
                            }
                        });

                        body += `]}`;

                        if(index !== Object.entries(consult.filters).length - 1){
                            body += ','
                        }
                        });
                    }

                    body += ']}';
                    body = JSON.parse(body);
                    

                    // Se realiza la peticion a Smart University
                    let res = await axios.post(`${process.env.URLAPI}/smartuni/`, body);
                    let data = res.data.result;

                    // Montar el objeto de las series

                    // Primero se obtienen los uid presentes en los filtros
                    let ids;

                    body.filters.map((id) => {
                        if(Object.values(id)[0] === 'uid'){
                            ids = Object.values(id)[1]
                        }
                    })

                    let seriesData= [];
                    ids.forEach((id) => {
                        // Se filtran los arrays por cada uid y se obtienen sus valores
                        let series = data.values.filter((array) => array[data.columns.indexOf('uid')] === id)
                            .map((array) => array[data.columns.indexOf('value')]);

                        seriesData.push({
                            name: id,
                            data: series,
                            type: type[consult.chart]
                        })
                    });
                    
                     // Se guardan las fechas
                     let dates = data.values.map((subarray) => subarray[data.columns.indexOf('time')]);

                    // Rellenar el objeto con los datos de la llamada
                    charts.push({
                        title: consult.name,
                        description: data.values[0][data.columns.indexOf('description')],
                        type: consult.chart,
                        ids: ids,
                        values: seriesData,
                        dates: dates,
                        name: data.values[0][data.columns.indexOf('name')],
                        metric: data.values[0][data.columns.indexOf('metric')]
                    });
                }
            }
        }

       //console.log(JSON.stringify(results[0]))
       results.charts = charts;

        // Devuelve el objeto con toda la información de las llamadas
        res.status(200).json({
            msg: 'getQr',
            res: results
        });
        return;

    } catch(error){
        console.error(error);
        res.status(500).json({
            msg: 'Error visualizar QR'
        });
    }
}

module.exports = {getQr, createQr, getQrById, updateQr, deleteQr, viewQr};