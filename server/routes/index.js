/**
 * Definicion de todas las rutas de los controladores
 * 
 */
const express = require('express')
const app = express();


app.use(require('./usuario'));
app.use(require('./login'));

module.exports = app;