// Llamadas a la tabla de llamadas de la base de datos

const { dbConsult } = require("../database/db");

const consultList = async(data) => {
    try {
        let paramsQuery = [];
        let query = `SELECT * FROM ${process.env.CONSULTTABLE} WHERE qrCode = ?`;

        paramsQuery.push(data.idQr);

        if(data.querySearch){
            query += ' AND name LIKE ?';
            paramsQuery.push(data.querySearch);
        }

        query += ' ORDER BY orderConsult';

        // Se realiza una busqueda de todas las llamadas para poder hacer la paginación
        const [total] = await dbConsult(query, paramsQuery);

        query += ` LIMIT ?, ?`;

        paramsQuery.push(data.desde);
        paramsQuery.push(data.registropp);

        const [consult] = await dbConsult(query, paramsQuery);

        return consult.length === 0 ? [[], total.length] : [consult, total.length];
    } catch (error) {
        throw error;
    }
}

const consultListAll = async(id) => {
    try {
        const query = `SELECT * FROM ${process.env.CONSULTTABLE} WHERE qrCode = ? ORDER BY orderConsult`;
        const paramsQuery = [id];
        const [consults] = await dbConsult(query, paramsQuery);

        return consults.length === 0 ? [[]] : consults;
    } catch (error) {
        throw error;
    }
}

const consultById = async(id) => {
    try {
        const query = `SELECT * FROM ${process.env.CONSULTTABLE} WHERE idConsult= ? LIMIT 1`;

        const paramsQuery = [id];
        const [consult] = await dbConsult(query, paramsQuery);

        return consult.length === 0 ? null : consult[0];
    } catch (error) {
        throw error;
    }
}

const consultByOrder = async(data) => {
    try {
        const query = `SELECT * FROM ${process.env.CONSULTTABLE} WHERE orderConsult= ? AND qrCode = ? LIMIT 1`;

        const paramsQuery = [data.order, data.id];
        const [consult] = await dbConsult(query, paramsQuery);

        return consult.length === 0 ? null : consult[0];
    } catch (error) {
        throw error;
    }
}

const consutlCreate = async(data) => {
    try {
        // Se obtienen todas las llamadas del QR para saber cuantas tiene y poder añadirle el numero del orden a la nueva
        let query = `SELECT * FROM ${process.env.CONSULTTABLE} WHERE qrCode = ?`;
        let paramsQuery = [data.qrCode];
        let [list] = await dbConsult(query, paramsQuery);

        data.orderConsult = list.length;

        query = `INSERT INTO ${process.env.CONSULTTABLE} (${Object.keys(data).join(',')}) VALUES (?)`;
        paramsQuery = [Object.values(data)];
        const [consult] = await dbConsult(query, paramsQuery);

        return consult.insertId;
    } catch (error) {
        throw error;
    }
}

const consultUpdate = async(data) => {
    try {

        const query = `UPDATE ${process.env.CONSULTTABLE} SET ? WHERE idConsult = ?`;
        const paramsQuery = [data, data.idConsult]
        await dbConsult(query, paramsQuery);

    } catch (error) {
        throw error;
    }
}

const consultDelete = async(id) => {
    try {
        
        const query = `DELETE FROM ${process.env.CONSULTTABLE} WHERE idConsult = ?`;
        const paramsQuery = [id];
        await dbConsult(query, paramsQuery);

    } catch (error) {
        throw error;
    }   
}

module.exports = {consultList, consultListAll, consultById, consultByOrder, consutlCreate, consultUpdate, consultDelete}