const mysql = require('mysql2/promise');
const util = require('util');
// Implementacion de promesas
// const bluebird = require('bluebird');

// Función para conectarse con la base de datos
async function connectDb(){
    try{
        const connection = await mysql.createConnection({
            host: process.env.HOST,
            database: process.env.DATABASE,
            user: process.env.USER,
            password: process.env.PASSWORD
        });

        return connection;
    }
    catch (error){
        console.log("Error al realizar conectarse con la base de datos");
        throw error;
    }
}


// Función para realizar las consultas a la base de datos
async function dbConsult(query){
    const connection = await connectDb();
    try {
        const resutls = await connection.query(query);
        return resutls;
    } catch (error) {
        console.log("Error al realizar la consulta a la base de datos");
        throw error;
    }
}

module.exports = {dbConsult}