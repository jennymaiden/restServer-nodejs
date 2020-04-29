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
    urlDB = 'mongodb+srv://emily_2020:5ETB8ND3fZCVSxPV@cluster0-4mcn5.mongodb.net/cafe?retryWrites=true&w=majority';
    // urlDB = 'mongodb://emily_2020:5ETB8ND3fZCVSxPV@cluster0-4mcn5.mongodb.net/cafe';
}

process.env.URLDB = urlDB;