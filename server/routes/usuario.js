/**
 * Controlador de usuario
 */
const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');

const app = express();


app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                })

            });



        })
        // res.json('get usuario')
});

app.post('/usuario', function(req, res) {

    let body = req.body;

    //Crear un usuario
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    //Guardarla en la db
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        // usuarioDB.password = null   

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });


});


app.put('/usuario/:id', function(req, res) {

    //Obtener el usuario por el id y actualizarlo en la DB
    let pId = req.params.id;
    let pBody = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(pId, pBody, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB,
            id: pId
        })
    });


});

app.delete('/usuario/:id', function(req, res) {
    // res.json('delete usuario')

    let id = req.params.id;

    //Este metodo elimina el registro fisicamente
    // Usuario.findByIdAndRemove(id, (err, usuarioEliminado) => {

    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if (!usuarioEliminado) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         });
    //     }

    //     res.json({
    //         ok: true,
    //         usuario: usuarioEliminado
    //     })
    // });

    //Este metodo actualizara el estado del registro
    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioEliminado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioEliminado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioEliminado
        })

    });
});

module.exports = app;