/*
Importación de módulos
*/

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Crear una aplicación de express
const app = express();

// Nos conectamos a la base de datos
//dbConnection();

app.use(cors()); 
app.use( express.json() );// Soporte para cuerpos codificados en JSON

// === Rutas
// Usuarios
app.use('/api/users', require('./routes/user'));

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ', process.env.PORT);
});


app.get('/', (req, res) => {
    res.json({
        ok: true,
        msg: 'Hola mundo'
    });
});