/**
 * VALIDADOR DE JSON
 */

// === IMPORTAR ===


/**
 * Valida si la cadena es un json valido para el campo de los filtros de las consultas
 * 
 * @param {*} json Cadena
 */
const validateJSON = (json) => {
    try {
        JSON.parse(json);
    } catch (error) {
        return false;
    }
    return true;
}

// Marcar para exportar.
module.exports = { validateJSON }