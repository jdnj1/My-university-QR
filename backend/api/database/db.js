const mysql = require('mysql2/promise');

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
        console.log("Error al conectarse con la base de datos");
        throw error;
    }
}


// Función para realizar las consultas a la base de datos
async function dbConsult(query, paramsQuery){
    const connection = await connectDb();
    try {
        const results = await connection.query(query, paramsQuery);
        connection.end();
        return results;
    } catch (error) {
        console.log("Error al realizar la consulta a la base de datos");
        throw error;
    }
}

module.exports = {dbConsult}