/**
 * CONTROLLER: CODIGOS QR
 */

// === Importar

const { response } = require('express'); // Response de Express
const axios = require('axios');
const { zonedTimeToUtc, format } = require('date-fns-tz');
const { qrList, qrById, qrCreate, qrUpdate, qrDelete, decrypt } = require('../dao/qr');
const { consultListAll, consutlCreate } = require('../dao/consult');

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

    // Datos para enviar a la base de datos
    const data = {
        desde,
        registropp,
        querySearch,
        role: req.role,
        uid: req.uid
    };
    
    try {

        const [qr, total] = await qrList(data);
        
        res.status(200).json({
            msg: 'getQr',
            qr,
            page:{
                desde,
                registropp,
                total: total
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
        const qr = await qrById(uid);

        if(qr !== null){
            // Solo el dueño o un admin puede obtener la info del codigo QR
            if(req.role !== 1 && req.uid !== qr.user ){
                res.status(403).json({
                    msg: 'No tienes permisos para obtener el qr'
                });

                return;
            }

            res.status(200).json({
                msg: 'getQr',
                qr: qr
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

    // Por si se introducen los campos por llamada
    const {...object} = req.body;

    try {

        let data = {
            description: object.description,
            tagName: object.tagName,
            tagDescription: object.tagDescription,
            sizePrint: object.sizePrint,
            date: isNaN(Date.parse(object.date)) ? undefined : object.date,
            share: ( object.share === 1 || object.share === 0 ? object.share : undefined ),
            refresh: ( object.refresh >= 0 ? object.refresh : 0 ),
            user: req.uid
        };

        // Creamos la fecha de validez del QR si no se ha enviado ninguna por el cuerpo
        if(data.date === undefined){
            data.date = new Date();
            data.date.setDate(data.date.getDate() + Number(process.env.DAYS));
            data.date = format(data.date, "yyyy-MM-dd'T'HH:mm:ss.SSS");
        }

        // Se comprueba si alguno de los campos no se han enviado por el cuerpo o es nulo
        Object.keys(data).forEach(key => {
            if(data[key] === undefined || data[key] === null){
                delete data[key];
            }
        });

        const qr = await qrCreate(data);

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
 * Duplica todas las llamadas de un QR.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta a enviar por el servidor.
 */
const duplicateQr = async( req , res = response ) => {

    // Por si se introducen los campos por llamada
    const {qrCode, qrDuplicate} = req.body;

    try {

        // Solo el propietario del qr o un admin puede duplicar
        // Se obtiene la info de los dos QR
        let qr1 = await qrById(qrCode);
        let qr2 = await qrById(qrDuplicate);

        if( req.role !== 1 && (req.uid != qr1.user || req.uid != qr2.user)){
            res.status(403).json({
                msg: 'No eres el propietario de los QR'
            });
            
            return;
        }

        //Obtenemos todas las llamadas del QR a duplicar
        let list = await consultListAll(qrDuplicate);

        //Se comprueba que tenga llamadas
        if(list.length !== 0){
            // Si tiene se van duplicando en el QR nuevo
            for(let consult of list){
                consult.qrCode = qrCode
                delete consult.idConsult;

                await consutlCreate(consult)
            }
        }

        res.status(200).json({
            msg: 'Se han duplicado las llamadas correctamente'
        });
        
    } catch (error) {
        console.error(error);
        
        res.status(500).json({
            msg: 'Error al duplicar QR'
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
    const idQr = req.params.id;
    
    try{
        // Comprueba que haya un codigo QR con ese ID.
        let qr = await qrById(idQr);

        if( qr === null ){
            // Si no lo hay, responde con not found sin cuerpo.
            res.status(404);
            res.send();
            return;
        }  

        // Se comprueba que el usuario no intente actualizar un qr que no sea suyo si no es admin
        if(req.role !== 1 && req.uid !== qr.user ){
            res.status(403).json({
                msg: 'No tienes permisos para actualizar el qr'
            });

            return;
        }


        // Extrae los campos que se pueden enviar por el cuerpo de la peticion para realizar comprobaciones
        let { ...object } = req.body;

        let data = {
            description: object.description,
            tagName: object.tagName,
            tagDescription: object.tagDescription,
            sizePrint: object.sizePrint,
            date: isNaN(Date.parse(object.date)) ? undefined : object.date,
            activated: ( object.activated === 0 || object.activated === 1 ? object.activated : undefined ),
            share: ( object.share === 0 || object.share === 1 ? object.share : undefined ),
            refresh: ( object.refresh >= 0 ? object.refresh : undefined ),
            idQr  
        }

        // Se comprueba si alguno de los campos no se han enviado por el cuerpo o es nulo
        Object.keys(data).forEach(key => {
            if(data[key] === undefined || data[key] === null){
                delete data[key];
            }
        });
    
        await qrUpdate(data);
        
        res.status( 200 ).json( {msg: 'Qr actualizado'} );

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
        let qr = await qrById(uid);
        if( qr === null ){
            // Si no lo hay, responde con not found sin cuerpo.
            res.status(404);
            res.send();
            return;
        }

        // Solo el propietario o admin puede eliminar los qr
        if(req.role !== 1 && req.uid !== qr.user ){
            res.status(403).json({
                msg: 'No tienes permisos para eliminar el qr'
            });

            return;
        }

        // Se elimina el codigo qr.
        await qrDelete(uid);

        res.status(200).json({
            msg:'Código Qr eliminado'
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

    //Array que almacena la cantidad a multiplicar para pasar a milisegundos segun la unidad
    const time = [1000, 60000, 3600000, 86400000];

    // Variable con el resultado de las llamadas
    let results = {};

    // Se extrae el id del qr desde el path
    const uid = req.params.id;
    
    try{
        //Desencriptamos el id del Qr
        const idQr = await decrypt(uid);

        // Se comprueba si el id proporcionado es incorrecto
        if( idQr === null ){
            res.status(404).json({
                msg: 'No se ha encontrado el código Qr'
            });
            return;
        }

        // Obtenemos el código QR
        const qr = await qrById(idQr);

        // Si no se encuentra
        if(qr === null){
            res.status(404).json({
                msg: 'No se ha encontrado el código Qr'
            });
            return;
        }

        results.titleQr = qr.description;
        results.share = qr.share;
        results.interval = qr.refresh;

        // Si existe, primero se debe comprobar que el qr no este desactivado y caducado
        if(qr.activated !== 1){
            res.status(404).json({
                msg: 'desactivado',
                titleQr: qr.description
            });
            return;
        }

        const now = new Date();

        if(qr.date < now){
            res.status(404).json({
                msg: 'caducado',
                titleQr: qr.description
            });
            return;
        }

        // Si todo esta correcto, obtener sus llamadas
        const consults = await consultListAll(idQr);

        // Si el códgio QR no tiene llamadas
        if(consults.length === 0){
            res.status(404).json({
                msg: 'El qr no tiene llamadas',
                titleQr: qr.description
            });
            return;
        }

        let charts = [];
        
        // Se iteran todas las llamadas que tenga y se comprueba que esten activadas
        for(let consult of consults){
            try {
                if(consult.activated === 1){

                    // Se comprueba que tipo de fecha tiene la llamada Absoluta / Relativa
                    // Si es la relativa se hacen los calculos
                    if(consult.typeDate === 1){
                        let now = new Date();
                        let nowUTC = zonedTimeToUtc(now, process.env.TZ);
                        let dateFrom;
                        let num = consult.number;

                        // Se pasa el numero introducido a milisegundos
                        num *= time[consult.unit - 1];

                        dateFrom = new Date(nowUTC.getTime() - num);

                        // Se establecen las fechas con el resultado de la resta
                        consult.dateFrom = dateFrom.toISOString()
                        
                        consult.dateTo = nowUTC.toISOString();
                    }   
                    else{
                        // Si es absoluta no hay que calcular nada
                        // Adaptamos las fechas
                        consult.dateFrom = consult.dateFrom.toISOString();

                        consult.dateTo = consult.dateTo.toISOString();
                    }

                   
    
                    // Se copmprueba que tipo de operacion tiene
                    if(consult.operation > 1){
                        // Max, min, last
    
                        // Pasamos los filtros a JSON
                        consult.filters = JSON.parse(consult.filters);
    
                        let data = {
                            token: consult.token,
                            dateFrom: consult.dateFrom,
                            dateTo: consult.dateTo,
                            operation: op[consult.operation - 2],
                            uid: Object.values(consult.filters)[0],
                            name: Object.values(consult.filters)[1]
                        }

                        // Se realiza la peticion a Smart University
                        data = await getDataOperation(data);
                        data = data.result;

                        if(data.columns.length === 0){
                            continue;
                        }
    
                        // Rellenar el objeto con los datos de la llamada
                        charts.push({
                            title: consult.name,
                            description: data.values[0][data.columns.indexOf('description')],
                            type: consult.chart,
                            date: data.values[0][data.columns.indexOf('time')],
                            values: [data.values[0][data.columns.indexOf(op[consult.operation - 2])]],
                            name: data.values[0][data.columns.indexOf('name')],
                            metric: data.values[0][data.columns.indexOf('metric')],
                            operation: consult.operation,
                            decimals: consult.decimals,
                            colorValue: consult.colorVal,
                            colorBackground: consult.colorBack,
                            icon: consult.icon
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
                        let data = await getData(body);
                        data = data.result;
                        
                        if(data.columns.length === 0){
                            continue;
                        }
    
                        // Montar el objeto de las series
    
                        // Primero se obtienen los uid presentes en los filtros
                        let idlist = [];
                        data.values.map((id) => {
                            if(id[data.columns.indexOf('uid')]){
                                idlist.push(id[data.columns.indexOf('uid')]);
                            }
                        })

                        // Eliminar los ids repetidos
                        let ids = [... new Set(idlist)];
    
                        let seriesData= [];
                        ids.forEach((id) => {
                            // Se filtran los arrays por cada uid y se obtienen sus valores y sus fechas
                            let series = data.values.filter((array) => array[data.columns.indexOf('uid')] === id)
                                .map((array) => [array[data.columns.indexOf('time')], array[data.columns.indexOf('value')]]);
                            
                            series.forEach((array) =>{
                                array[0] = format(new Date(array[0]), "dd/MM/y HH:mm:ss");
                            });
    
                            seriesData.push({
                                name: id,
                                data: series,
                                type: type[consult.chart]
                            })
                        });
                        
                        // Se guardan las fechas y se ordenan para utilizarlas en el eje x de las gráficas
                        let dates = data.values.map((subarray) => subarray[data.columns.indexOf('time')])
                            .sort((a, b) => a - b)
                            .map((date) => format(new Date(date), "dd/MM/y HH:mm:ss"));
    
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

            } catch (error) {
                // Si hay algun error, como que el token no es correcto, lo ignora y pasa al siguiente
                console.log(error.response.data)
            }
            
        }
       // Se comprueba que por lo menos haya una llamada activa
       if(charts.length === 0){
            res.status(404).json({
                msg: 'desactivadas',
                titleQr: qr.description
            });
            return;
       }

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
        return
    }
}

// Peticiones a Open Api de Smart University

/**
 * Devuelve los datos de SmartUniversity comprendidos en las fechas y filtros proporcionados
 * 
 */
const getData = async( body ) => {
    try {
        let token = body.token;

        // Eliminamos el token de la llamada del cuerpo de la peticion antes de enviarselo a SmartUniversity
        delete body.token;

        const result = await axios.post(`${process.env.URLSU}/data/${token}`, body);

        return result.data;

    } catch (error) {
        throw error;
    }
}

/**
 * Devuelve un maximo, minimo o el utimo dato de SmartUniversity comprendido en las fechas y filtros proporcionados
 * 
 */
const getDataOperation = async( body ) => {
    try {
        let {token, dateFrom, dateTo, operation, uid, name} = body;

        const result = await axios.get(`${process.env.URLSU}/data/operation/${token}/time_start/${dateFrom}/time_end/${dateTo}/${operation}/uid/${uid}/name/${name}`);

        return result.data;

    } catch (error) {
        throw error;;
    }
}

module.exports = {getQr, createQr, duplicateQr, getQrById, updateQr, deleteQr, viewQr};