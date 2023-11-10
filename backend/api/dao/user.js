// Llamadas a la tabla de usuarios de la base de datos

const { dbConsult } = require("../database/db");

const userByEmail = async(email) => {
    try {
        const query = `SELECT * FROM ${process.env.USERTABLE} WHERE email= ?`;

        const paramsQuery = [email];
        const [user] = await dbConsult(query, paramsQuery);
        console.log(user)

        return user.length === 0 ? false : true;
    } catch (error) {
        throw error;
    }
}

const userList = async(data) => {
    try {
        let paramsQuery = [];
        let query = `SELECT * FROM ${process.env.USERTABLE}`;

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
        const query = `SELECT * FROM ${process.env.USERTABLE} WHERE idUser= ? LIMIT 1`;

        const paramsQuery = [id];
        const [user] = await dbConsult(query, paramsQuery);

        return user.length === 0 ? null : user[0];
    } catch (error) {
        throw error;
    }
}

const userCreate = async(data) => {
    try {
        let paramsQuery = [data.email, data.password];
        let query = `INSERT INTO ${process.env.USERTABLE} (email, password`;

        // Se comprueba si se pasa el rol y el limite de consultas
        if(data.lim_consult){
            query += `, lim_consult`;
        }

        if(data.role === 1 || data.role === 0){
            query += `, role`;
        }

        query += `) VALUES (?, ?`;

        if(data.lim_consult){
            query += `, ?`;
            paramsQuery.push(data.lim_consult);
        }

        if(data.role === 1 || data.role === 0){
            query += `, ?`;
            paramsQuery.push(data.role);
        }

        query += ')';

        const user = await dbConsult(query, paramsQuery);

        return user.length === 0 ? null : user[0];
    } catch (error) {
        throw error;
    }
}

const userUpdate = async(data) =>  {
    try {
        let paramsQuery = [];
        // En este array se van almacenando todos los campos a actualizar
        let updateFields = [];

        let query = `UPDATE ${process.env.USERTABLE} SET `;

        // Dependiendo de los campos que se envien la query es de una forma u otra.
        if(data.email){
            updateFields.push('email = ?');
            paramsQuery.push(data.email);
        }

        if(data.password){
            updateFields.push('password = ?');
            paramsQuery.push(data.password);
        }

        if(data.role === 1 || data.role === 0){
            updateFields.push(`role = ?`);
            paramsQuery.push(data.role);

        }
        // Se comprueba si se pasa el rol y el limite de consultas
        if(data.lim_consult){
            updateFields.push(`lim_consult = ?`);
            paramsQuery.push(data.lim_consult);
        }

        // Se unen los campos enviados por la peticion con una coma en el caso que haya mas de uno
        query += updateFields.join(',');
        query += ' WHERE idUser=?';
        paramsQuery.push(data.uid);

        const [user] = await dbConsult(query, paramsQuery);

        return user.length === 0 ? null : user[0];
    } catch (error) {
        throw error;
    }
}

const userDelete = async(id) => {
    try {
        const query = `DELETE FROM ${process.env.USERTABLE} WHERE idUser= ?`;

        const paramsQuery = [id];
        const [user] = await dbConsult(query, paramsQuery);

        return user.length === 0 ? null : user[0];
    } catch (error) {
        throw error;
    }
}

module.exports = {userByEmail, userList, userById, userCreate, userUpdate, userDelete}