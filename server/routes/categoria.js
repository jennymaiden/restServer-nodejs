const express = require('express');
const _ = require('underscore');

let { verificarToken, verificarAdmin_Role } = require('../middelwares/autentication');

let app = express();

let Categoria = require('../models/categoria');

// ============================
// Listar todas las categorias
// ============================
app.get('/categoria', verificarToken, (req, res) => {

    Categoria.find({ estado: true }, 'nombre descripcion estado')
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoria) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    categoria,
                    cuantos: conteo
                })

            });
        })

});

// ============================
// Mostrar una categoria por id
// ============================
app.get('/categoria/:id', verificarToken, (req, res) => {

    //Obtener el id desde el body
    // console.log('REQ::::::::::.', req.body);
    let body = req.body;
    //console.log('id categoria: ....', body.identidad);
    let pId = req.params.id;
    //console.log('por parametro ', pId);

    Categoria.findById(pId, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });

});

// ============================
// Crear una nueva categoria
// ============================
app.post('/categoria', [verificarToken, verificarAdmin_Role], (req, res) => {
    //Regresar la nueva categoria
    //req.usuario._Id

    let body = req.body;

    //Crear categoria
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    //Guardarla en la db
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });
});

// ============================
// Actualizar  categoria
// ============================
app.put('/categoria/:id', [verificarToken, verificarAdmin_Role], (req, res) => {
    //Solo actulizar la descripcion del categoria
    //Obtener el id de la categoria que viene en la url
    let pId = req.params.id;
    //Los parametros que estan en el body
    // let pBody = _.pick(req.body, ['nombre', 'descripcion', 'estado']);
    let actulizarCategoria = {
        descripcion: req.body.descripcion
    }

    Categoria.findByIdAndUpdate(pId, actulizarCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB,
            id: pId
        })
    });

});

// ============================
// Borrar  categoria
// ============================
app.delete('/categoria/:id', [verificarToken, verificarAdmin_Role], (req, res) => {
    //Solo lo puede hacer un administrador

    //Obtener el id de la categoria que viene en la url
    let pId = req.params.id;

    Categoria.findByIdAndRemove(pId, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            mensaje: `Se elimino correctamente la categoria  '${categoriaDB.descripcion}'`,
            categoria: categoriaDB,
            id: pId
        })
    });

});

module.exports = app;