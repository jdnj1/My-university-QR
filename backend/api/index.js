/*
Importación de módulos
*/

const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
require('dotenv').config();

// Crear una aplicación de express
const app = express();

app.use(cors());  

// Prueba de coneción con base de datos
const conect = mysql.createConnection({
    host: 'localhost',
    database: 'prueba_tfg',
    user: 'root',
    password: ''
});

try{
    conect.connect();
    console.log("Conexión exitosa");
}
catch(err){
    console.error( err );

}

conect.query('SELECT * FROM user', function (error, results, fields) {
    if (error) throw error;

    // connected!
    results.forEach(result => {
        console.log(result);
    });
  });

conect.end();

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ', process.env.PORT);
});


app.get('/', (req, res) => {
    res.json({
        ok: true,
        msg: 'Hola mundo'
    });
});