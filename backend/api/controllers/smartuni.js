/**
 * CONTROLLER: SMARTUNIVERSITY
 */

// === Importar

const axios = require('axios');

// Propio
const { response } = require('express'); // Response de Express

/**
 * Devuelve los datos de SmartUniversity comprendidos en las fechas y filtros proporcionados
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta a enviar por el servidor.
 */
const getData = async( req , res ) => {
    try {
        let token = req.body.token;

        // Eliminamos el token de la llamada del cuerpo de la peticion antes de enviarselo a SmartUniversity
        delete req.body.token;

        const result = await axios.post(`${process.env.URLSU}/data/${token}`, req.body);

        res.status(200).json({
            result: result.data
        });

        return;

    } catch (error) {
        console.error(error);

        res.status(500).json({
            msg: 'Error al intentar devolver los datos'
        });
    }
}

/**
 * Devuelve un maximo, minimo o el utimo dato de SmartUniversity comprendido en las fechas y filtros proporcionados
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta a enviar por el servidor.
 */
const getDataOperation = async( req , res ) => {
    try {
        let {token, dateFrom, dateTo, operation, uid, name} = req.body;

        const result = await axios.get(`${process.env.URLSU}/data/operation/${token}/time_start/${dateFrom}/time_end/${dateTo}/${operation}/uid/${uid}/name/${name}`);
        
        res.status(200).json({
            result: result.data
        });

        return;

    } catch (error) {
        console.error(error);

        res.status(500).json({
            msg: 'Error al intentar devolver los datos'
        });

        return;
    }
}


module.exports = {getData, getDataOperation};