/*
Importación de módulos
*/

const express = require('express');
// Crear una aplicación de express
const app = express();

// Abrir la aplicacíon en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto ' + 3000);
});