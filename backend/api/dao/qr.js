// Llamadas a la tabla de qr de la base de datos

const { dbConsult } = require("../database/db");

const qrList = async(data) => {
    try {
        let paramsQuery = [];
        let query = `SELECT * FROM ${process.env.QRTABLE}`;

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
        const query = `SELECT * FROM ${process.env.QRTABLE} WHERE idQr= ?`;

        const paramsQuery = [id];
        const [qr] = await dbConsult(query, paramsQuery);

        return qr.length === 0 ? null : qr[0];
    } catch (error) {
        throw error;
    }
}

const qrCreate = async(data) => {
    try {
        // En este array se van almacenando todos los campos a insertar
        let createFields = [];

        // En este array se van almacenando las parametrizaciones necesarias
        let valueFields = [];

        let paramsQuery = [];

        if(data.description){
            createFields.push(`description`);
            valueFields.push('?');
            paramsQuery.push(data.description);
        }
        if(data.tagName){
            createFields.push(`tagName`);
            valueFields.push('?');
            paramsQuery.push(data.tagName);
        }
        if(data.tagDescription){
            createFields.push(`tagDescription`);
            valueFields.push('?');
            paramsQuery.push(data.tagDescription);
        }
        if(data.sizePrint){
            createFields.push(`sizePrint`);
            valueFields.push('?');
            paramsQuery.push(data.sizePrint);
        }

        // Creamos la fecha de validez del QR si no se ha enviado ninguna por el cuerpo
        if(!data.date){
            data.date = new Date();
            data.date.setDate(data.date.getDate() + Number(process.env.DAYS));
            data.date = format(data.date, "yyyy-MM-dd'T'HH:mm:ss.SSS");
        }

        createFields.push(`date`);
        valueFields.push('?');
        paramsQuery.push(data.date);

        createFields.push(`user`);
        valueFields.push('?');
        paramsQuery.push(data.uid); 

        const query = `INSERT INTO ${process.env.QRTABLE} (${createFields.join(',')}) VALUES (${valueFields.join(',')})`;

        const qr = await dbConsult(query, paramsQuery);

        return qr.length === 0 ? null : qr[0];
    } catch (error) {
        throw error;
    }
}

const qrUpdate = async(data) =>{
    try {
        let paramsQuery = [];
        // En este array se van almacenando todos los campos a actualizar
        let updateFields = [];

        // Dependiendo de los campos que se envien la query es de una forma u otra.
        if(data.description){
            updateFields.push(`description = ?`);
            paramsQuery.push(data.description);
        }
        if(data.tagName){
            updateFields.push(`tagName = ?`);
            paramsQuery.push(data.tagName);
        }
        if(data.tagDescription){
            updateFields.push(`tagDescription = ?`);
            paramsQuery.push(data.tagDescription);
        }
        if(data.date){
            updateFields.push(`date = ?`);
            paramsQuery.push(data.date);
        }
        if( data.activated === 1 || data.activated === 0 ){
            updateFields.push(`activated = ?`);
            paramsQuery.push(data.activated);
        }
        if(data.sizePrint){
            updateFields.push(`sizePrint = ?`);
            paramsQuery.push(data.sizePrint);
        }

        const query = 
        `UPDATE ${process.env.QRTABLE} 
        SET ${updateFields.join(',')} 
        WHERE idQr = ?`;

        paramsQuery.push(data.idQr);

        const qr = await dbConsult(query, paramsQuery);
        console.log(query)

        return qr.length === 0 ? null : qr[0];
    } catch (error) {
        throw error;
    }
}

const qrDelete = async(id) => {
    try {
        const query = `DELETE FROM ${process.env.QRTABLE} WHERE idQr = ?`;

        const paramsQuery = [id];
        const qr = await dbConsult(query, paramsQuery);

        return qr.length === 0 ? null : qr[0];
    } catch (error) {
        throw error;
    }    
}



module.exports = {qrList, qrById, qrCreate, qrUpdate, qrDelete}