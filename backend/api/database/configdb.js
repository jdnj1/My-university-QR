const mysql = require('mysql');

const dbConnection = async() => {
    try {
        const connection = mysql.createConnection({
            host: process.env.HOST,
            database: process.env.DATABasdasASE,
            user: process.env.USER,
            password: process.env.PASSWORD
        });

        await connection.connect();

        console.log( `== BD online ==` );

    } catch (error) {
        console.error( err );
        throw new Error( `Error al iniciar la BD` );
    }
}

module.exports = {dbConnection}