/**
 * HELPER JSON Web Token
 */

// Importa JSON Web Token.
const jwt = require( 'jsonwebtoken' );

//Funcion que genera y devuelve un JasonWebToken
const generateJWT = ( uid , role ) => {
    return new Promise( ( resolve , reject ) => {
        const payload = {
            uid,
            role
        }
        jwt.sign( payload , process.env.JWTSECRET , {
            expiresIn: process.env.JWTEXPIRE
        } , ( err , token ) => {
            if( err ){
                console.error( err );
                reject( 'No se pudo generar el JWT' );
            } else {
                resolve( token );
            }
        });
    });
}
module.exports = { generateJWT };