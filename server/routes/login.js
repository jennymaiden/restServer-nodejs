/**
 * Controlador del login para usuar los Tokens de autenticacion
 */

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');


const app = express();

//Crear peticiones POST
app.post('/login', (req, res) => {

    //Obtener el body que me envian
    let body = req.body;

    //Realizar la consulta a la base de datos
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrecta'
                }
            });
        }

        //Evaluar la contraseña
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrecta.'
                }
            });
        }
        //Generar Token
        let token = jwt.sign({
            usuario: usuarioDB

        }, process.env.SEDD, { expiresIn: process.env.CADUCIDAD_TOKEN });
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })

    });

});



module.exports = app;