/**
 * CONTROLLER: SMARTUNIVERSITY
 */

// === Importar

const axios = require('axios');

// Propio
const {dbConsult} = require('../database/db');
const { response } = require('express'); // Response de Express
const bcrypt = require('bcryptjs'); // BcryptJS

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

        axios.post(`${process.env.URLSU}/${token}/getData`, req.body)
            .then((result) => {
                //console.log(result.data)
                res.status(200).json({
                    result: result.data
                });
                return;
        
            }).catch((err) => {
                //console.log(err)
                res.status(400).json({
                    res: err
                });
                return;
            });

    } catch (error) {
        //console.error(error);

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

        axios.get(`${process.env.URLSU}/${token}/time_start/${dateFrom}/time_end/${dateTo}/operation/${operation}/uid/${uid}/name/${name}/getDataOperation`)
            .then((result) => {
                //console.log(result.data)
                res.status(200).json({
                    result: result.data
                });
                return;
            
            }).catch((err) => {
                console.log(err)
                return;
            });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            msg: 'Error al intentar devolver los datos'
        });
    }
}


module.exports = {getData, getDataOperation};