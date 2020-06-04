/**
 * Controlador de producto
 */
const express = require('express');
const { verificarToken, verificarAdmin_Role } = require('../middelwares/autentication');

let app = express();

let Producto = require('../models/producto');

// ============================
// Listar todos los productos
// ============================
app.get('/productos', verificarToken, (req, res) => {
    //listar todos los productos
    // populate: usuario categoria
    //paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true }, 'nombre precioUni descripcion')
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .skip(desde)
        .limit(limite)
        .exec((err, productosDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    productos: productosDB,
                    cuantos: conteo
                })

            });



        })
});


// ============================
// Buscar productos por un termino
// ============================
app.get('/productos/buscar/:termino', verificarToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se enconto el producto'
                    }
                });
            }
        });
});

// ============================
//Obtener un producto por id
// ============================
app.get('/producto/:id', verificarToken, (req, res) => {

    let pId = req.params.id;
    // populate: usuario categoria
    Producto.findById(pId)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El id no existe'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            })
        });


});

// ============================
// Crear un nuevo producto
// ============================
app.post('/producto', [verificarToken, verificarAdmin_Role], (req, res) => {

    let body = req.body;
    // console.log('usuario ::::.....', req);
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    menssage: 'No fue posible guardar el producto'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        })
    });
});

// ============================
// Actualizar un producto
// ============================
app.put('/producto/:id', [verificarToken, verificarAdmin_Role], (req, res) => {

    //Obtener el id por la url
    let pId = req.params.id;
    //Leer los parametros que vienen en el body
    let body = req.body;

    let productoUpdate = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });
    Producto.findById(pId, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no esta registrado como producto'
                }
            });
        }
        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.descripcion = body.descripcion;
        productoDB.disponible = body.disponible;
        productoDB.categoria = body.categoria;

        productoDB.save((err2, productoSave) => {

            if (err2) {
                return res.status(500).json({
                    ok: false,
                    err2
                });
            }
            if (!productoSave) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se pudo actualizar el producto'
                    }
                });
            }
            res.json({
                ok: true,
                mensage: 'Producto actualizado',
                id: pId,
                producto: productoSave
            })

        });

    });
    // Producto.findOneAndUpdate(pId, productoUpdate, { new: true, runValidators: true }, (err, productoDB) => {
    //     if (err) {
    //         return res.status(500).json({
    //             ok: false,
    //             err
    //         });
    //     }
    //     if (!productoDB) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }
    //     res.json({
    //         ok: true,
    //         mensage: 'Producto actualizado',
    //         id: pId,
    //         producto: productoDB
    //     })
    // });
    // grabar el usuario
    //grabar la categoria
});

// ============================
// Borrar   un producto
// ============================
app.delete('/producto/:id', [verificarToken, verificarAdmin_Role], (req, res) => {

    //actualizar el disponible a false
    let pId = req.params.id;
    Producto.findByIdAndUpdate(pId, { disponible: false }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No fue posible elimina el producto'
                }
            });
        }
        res.json({
            ok: true,
            mensage: 'Producto desabilitado',
            id: pId,
            producto: productoDB
        })
    });
});

module.exports = app;