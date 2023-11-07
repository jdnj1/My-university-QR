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

        // Se realiza una busqueda de todos los usuarios para poder hacer la paginación
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

const consultById = async(id) => {
    try {
        const query = `SELECT * FROM ${process.env.CONSULTTABLE} WHERE idConsult= ?`;

        const paramsQuery = [id];
        const [consult] = await dbConsult(query, paramsQuery);

        return consult.length === 0 ? null : consult[0];
    } catch (error) {
        throw error;
    }
}

const consutlCreate = async(data) => {
    try {
        let paramsQuery = [];
        // Se obtienen todas las llamadas del QR para saber cuantas tiene y poder añadirle el numero del orden a la nueva
        let query = `SELECT * FROM ${process.env.CONSULTTABLE} WHERE qrCode = ?`;
        paramsQuery.push(data.qrCode);

        let [list] = await dbConsult(query, paramsQuery);

        paramsQuery = [];

        // En este array se van almacenando todos los campos a insertar
        let createFields = [];

        // En este array se van almacenando todos los calores de los campos a insertar
        let valueFields = [];

        if(data.name){
            createFields.push('name');
            valueFields.push('?');
            paramsQuery.push(data.name);
        }
        if(data.token){
            createFields.push('token');
            valueFields.push('?');
            paramsQuery.push(data.token);
        }
        if(data.typeDate === 1 || data.typeDate === 0){
            createFields.push('typeDate');
            valueFields.push('?');
            paramsQuery.push(data.typeDate);
        }

        if(data.dateFrom && data.dateTo){
            createFields.push('dateFrom');
            valueFields.push('?');
            paramsQuery.push(data.dateFrom);

            createFields.push('dateTo');
            valueFields.push('?');
            paramsQuery.push(data.dateTo);
        }

        if(data.number >= 0){
            createFields.push('number');
            valueFields.push('?');
            paramsQuery.push(data.number);
        }
        if(data.unit >= 1){
            createFields.push('unit');
            valueFields.push('?');
            paramsQuery.push(data.unit);
        }
        if(data.filters){
            createFields.push('filters');
            valueFields.push('?');
            paramsQuery.push(data.filters);
        }
        if(data.chart){
            createFields.push('chart');
            valueFields.push('?');
            paramsQuery.push(data.chart);
        }
        if(data.operation){
            createFields.push('operation');
            valueFields.push('?');
            paramsQuery.push(data.operation);
        }

        createFields.push('qrCode');
        valueFields.push('?');
        paramsQuery.push(data.qrCode);
        console.log(data.qrCode)

        createFields.push('orderConsult');
        valueFields.push('?');
        paramsQuery.push(list.length);
        console.log(list.length)

        query = `INSERT INTO ${process.env.CONSULTTABLE} (${createFields.join(',')}) VALUES (${valueFields.join(',')})`;

        const consult = await dbConsult(query, paramsQuery);

        return consult.length === 0 ? null : consult[0];
    } catch (error) {
        throw error;
    }
}

const consultUpdate = async(data) => {
    try {
        let paramsQuery = [];
        // En este array se van almacenando todos los campos a actualizar
        let updateFields = [];

        // Dependiendo de los campos que se envien la query es de una forma u otra.
        if(data.name){
            updateFields.push(`name = ?`);
            paramsQuery.push(data.name);
        }
        if(data.token){
            updateFields.push(`token = ?`);
            paramsQuery.push(data.token);
        }
        if(data.dateFrom){
            updateFields.push(`dateFrom = ?`);
            paramsQuery.push(data.dateFrom);
        }
        if(data.dateTo){
            updateFields.push(`dateTo = ?`);
            paramsQuery.push(data.dateTo);
        }
        if(data.filters){
            updateFields.push(`filters = ?`);
            paramsQuery.push(data.filters);
        }
        if(data.chart){
            updateFields.push(`chart = ?`);
            paramsQuery.push(data.chart);
        }
        if(data.operation){
            updateFields.push(`operation = ?`);
            paramsQuery.push(data.operation);
        }
        if(data.activated === 1 || data.activated === 0){
            updateFields.push(`activated = ?`);
            paramsQuery.push(data.activated);
        }
        if(data.orderConsult >= 0){
            updateFields.push(`orderConsult = ?`);
            paramsQuery.push(data.orderConsult);
        }
        if(data.typeDate === 1 || data.typeDate === 0){
            updateFields.push(`typeDate = ?`);
            paramsQuery.push(data.typeDate);
        }
        if(data.number >= 0){
            updateFields.push(`number = ?`);
            paramsQuery.push(data.number);
        }
        if(data.unit >= 1){
            updateFields.push(`unit = ?`);
            paramsQuery.push(data.unit);
        }

        const query = `UPDATE ${process.env.CONSULTTABLE} SET ${updateFields.join(',')} WHERE idConsult = ?`;

        paramsQuery.push(data.idConsult)

        const consult = await dbConsult(query, paramsQuery);
        console.log(query)

        return consult.length === 0 ? null : consult[0];
    } catch (error) {
        throw error;
    }
}

const consultDelete = async(id) => {
    try {
        const query = `DELETE FROM ${process.env.CONSULTTABLE} WHERE idConsult = ?`;

        const paramsQuery = [id];
        const consult = await dbConsult(query, paramsQuery);

        return consult.length === 0 ? null : consult[0];
    } catch (error) {
        throw error;
    }   
}

module.exports = {consultList, consultById, consutlCreate, consultUpdate, consultDelete}