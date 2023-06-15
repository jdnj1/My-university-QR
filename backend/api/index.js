/*
Importación de módulos
*/

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importa el modulo para la conexion con la base de datos
const {dbConnection} = require('./database/configdb')

// Crear una aplicación de express
const app = express();

// Nos conectamos a la base de datos
dbConnection();

app.use(cors()); 

// conect.query('SELECT * FROM user', function (error, results, fields) {
//     if (error) throw error;

//     // connected!
//     results.forEach(result => {
//         console.log(result);
//     });
//   });

//conect.end();

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ', process.env.PORT);
});


app.get('/', (req, res) => {
    res.json({
        ok: true,
        msg: 'Hola mundo'
    });
});