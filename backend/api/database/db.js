const mysql = require('mysql');
const util = require('util');

const connection = mysql.createConnection({
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD
});

// Conexion con la base de datos
connection.connect();

// Utilidad para promifisicar la función query y poder usar async/await
const queryAsync = util.promisify(connection.query).bind(connection);

// Función para realizar las consultas a la base de datos
async function dbConsult(query){
    try {
        const resutls = await queryAsync(query);
        return resutls
    } catch (error) {
        console.log("Error al realizar la consulta a la base de datos");
        throw error;
    }
}

module.exports = {dbConsult}