/**
 * Puerto
 */
process.env.PORT = process.env.PORT || 3000;

/**
 * Entorno
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 * Base de datos
 */
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;

}

process.env.URLDB = urlDB;

/**
 * Fecha de expiracion del token
 * 60 Segundos
 * 60 minutos
 * 24 horas
 * 30 días
 */
process.env.CADUCIDAD_TOKEN = '48h';

/***
 * SEDD de autenticacion
 */
process.env.SEDD = process.env.SEDD || 'mi-llave-secreta-desarrollo';


/**
 * ID CLIENT GOOGLE
 */
process.env.CLIENT_ID = process.env.CLIENT_ID || '407946141794-s813a4v5r62ca6pamv4qslbkv1be78nc.apps.googleusercontent.com';