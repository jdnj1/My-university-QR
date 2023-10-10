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

        axios.post(`${process.env.URLSU}/data/${token}`, req.body)
            .then((result) => {
                //console.log(result.data)
                res.status(200).json({
                    result: result.data
                });
                return;
        
            }).catch((err) => {
                console.log(err)
                res.status(400).json({
                    res: err
                });
                return;
            });

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

        axios.get(`${process.env.URLSU}/data/operation/${token}/time_start/${dateFrom}/time_end/${dateTo}/${operation}/uid/${uid}/name/${name}`)
            .then((result) => {
                //console.log(result.data)
                res.status(200).json({
                    result: result.data
                });
                return;
            
            }).catch((err) => {
                //console.log(err.response.data)
                //if(err.response.data.result = 'Token invalido'){
                res.status(400).json({
                    res: err.response.data
                });
               // }
                return;
            });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            msg: 'Error al intentar devolver los datos'
        });

        return;
    }
}


module.exports = {getData, getDataOperation};