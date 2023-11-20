// Llamadas a la tabla de qr de la base de datos

const { dbConsult } = require("../database/db");

const qrList = async(data) => {
    try {
        let paramsQuery = [];
        let query = `SELECT LOWER(HEX(AES_ENCRYPT(idQr, '${process.env.CODE}'))) AS uid, ${process.env.QRTABLE}.* FROM ${process.env.QRTABLE}`;

        // Si el usuario no es admin se le devuelven solo sus codigos qr
        if(data.role === 0){
            query += ` WHERE user = ?`;
            paramsQuery.push(data.uid);

            // Si ademas existe la query de busqueda
            if(data.querySearch){
                query += ` AND description LIKE ?'`;
                paramsQuery.push(data.querySearch);
            }
        }
        else{
            // Si el usuario es amdmin y ademas existe la query de busqueda
            if(data.querySearch){
                query += ` WHERE description LIKE ?`
                paramsQuery.push(data.querySearch);
            }
        }

        // Se realiza una busqueda de todos los usuarios para poder hacer la paginación
        const [total] = await dbConsult(query, paramsQuery);

        query += ` LIMIT ?, ?`;

        paramsQuery.push(data.desde);
        paramsQuery.push(data.registropp);

        const [qr] = await dbConsult(query, paramsQuery);

        return qr.length === 0 ? [[], total.length] : [qr, total.length];
    } catch (error) {
        throw error;
    }
}

const qrById = async(id) =>{
    try {

        const query = `SELECT LOWER(HEX(AES_ENCRYPT(idQr, '${process.env.CODE}'))) AS uid, ${process.env.QRTABLE}.* FROM ${process.env.QRTABLE} WHERE idQr = ? LIMIT 1`;
        const paramsQuery = [id];
        const [qr] = await dbConsult(query, paramsQuery);

        return qr.length === 0 ? null : qr[0];
    } catch (error) {
        throw error;
    }
}

const qrCreate = async(data) => {
    try {

        const query = `INSERT INTO ${process.env.QRTABLE} (${Object.keys(data).join(',')}) VALUES (?)`;
        const paramsQuery = [Object.values(data)];
        const [qr] = await dbConsult(query, paramsQuery);

        return qr.insertId;
    } catch (error) {
        throw error;
    }
}

const qrUpdate = async(data) =>{
    try {

        const query = `UPDATE ${process.env.QRTABLE} SET ? WHERE idQr = ?`;
        const paramsQuery = [data, data.idQr];
        await dbConsult(query, paramsQuery);

    } catch (error) {
        throw error;
    }
}

const qrDelete = async(id) => {
    try {

        const query = `DELETE FROM ${process.env.QRTABLE} WHERE idQr = ?`;
        const paramsQuery = [id];
        await dbConsult(query, paramsQuery);

    } catch (error) {
        throw error;
    }    
}

// Desencriptar uid 
const decrypt = async(uid) => {

    try {
        const query = `SELECT AES_DECRYPT(UNHEX('${uid}'), '${process.env.CODE}') AS idQr`;
        let res = await dbConsult(query);

        return res[0][0].idQr === null ? null : res[0][0].idQr.toString();
    } catch (error) {
        throw error;
    }
    
}



module.exports = {qrList, qrById, qrCreate, qrUpdate, qrDelete, decrypt}