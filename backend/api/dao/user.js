// Llamadas a la tabla de usuarios de la base de datos

const { dbConsult } = require("../database/db");

const userByEmail = async(email) => {
    try {
        const query = `SELECT idUser, email, role, lim_consult FROM ${process.env.USERTABLE} WHERE email= ?`;

        const paramsQuery = [email];
        const [user] = await dbConsult(query, paramsQuery);

        return user.length === 0 ? null : user[0];
    } catch (error) {
        throw error;
    }
}

const userList = async(data) => {
    try {
        let paramsQuery = [];
        let query = `SELECT idUser, email, role, lim_consult FROM ${process.env.USERTABLE}`;

        if(data.querySearch){
            query += ` WHERE email LIKE ?`;
            paramsQuery.push(data.querySearch);
        }

        // Se realiza una busqueda de todos los usuarios para poder hacer la paginación
        const [total] = await dbConsult(query, paramsQuery);

        query += ` LIMIT ?, ?`;

        paramsQuery.push(data.desde);
        paramsQuery.push(data.registropp);

        const [users] = await dbConsult(query, paramsQuery);

        return users.length === 0 ? [[], total.length] : [users, total.length];
    } catch (error) {
        throw error;
    }
}

const userById = async(id) => {
    try {
        const query = `SELECT idUser, email, role, lim_consult FROM ${process.env.USERTABLE} WHERE idUser = ? LIMIT 1`;

        const paramsQuery = [id];
        const [user] = await dbConsult(query, paramsQuery);

        return user.length === 0 ? null : user[0];
    } catch (error) {
        throw error;
    }
}

const userCreate = async(data) => {
    try {

        const query = `INSERT INTO ${process.env.USERTABLE} (${Object.keys(data).join(',')}) VALUES (?)`;
        const paramsQuery = [Object.values(data)]
        await dbConsult(query, paramsQuery);

    } catch (error) {
        throw error;
    }
}

const userUpdate = async(data) =>  {
    try {

        const query = `UPDATE ${process.env.USERTABLE} SET ? WHERE idUser = ?`;
        const paramsQuery = [data, data.idUser]
        await dbConsult(query, paramsQuery);

    } catch (error) {
        throw error;
    }
}

const userDelete = async(id) => {
    try {
        
        const query = `DELETE FROM ${process.env.USERTABLE} WHERE idUser= ?`;
        const paramsQuery = [id];
        await dbConsult(query, paramsQuery);

    } catch (error) {
        throw error;
    }
}

// Funcion que devuelve la contraseña hasheada para hacer comprobaciones (login, cambiar contraseña...)
const getHash = async(id) => {
    try {
        
        const query = `SELECT password FROM ${process.env.USERTABLE} WHERE idUser = ? LIMIT 1`;
        const paramsQuery = [id];
        const [pass] = await dbConsult(query, paramsQuery);

        return pass.length === 0 ? null : pass[0];
    } catch (error) {
        throw error;
    }
}

module.exports = {userByEmail, userList, userById, userCreate, userUpdate, userDelete, getHash}