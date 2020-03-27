var express = require('express');
var mdAutentication = require('../middleware/autentication');

var Provider = require('../models/provider');

var app = express();


// ================================================
// CREAR UN NUEVO PROVEEDOR 
// ================================================
app.post('/', mdAutentication.verificaToken, (req, res) => {

    var body = req.body;

    var provider = new Provider({
        nombre_proveedor: body.nombre_proveedor,
        nombre_empresa: body.nombre_empresa
    });

    provider.save((err, providerSave) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al crear proveedor',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            provider: providerSave
        });
    });
});


// ================================================
// ACTUALIZAR PROVEEDOR 
// ================================================
app.put('/:id', mdAutentication.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Provider.findById(id, (err, provider) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar el proveedor',
                errors: err
            });
        }

        if(!provider) {

            return res.status(400).json({
                ok: false,
                message: 'El pedido con id ' + id + ' no existe',
                errors: {message: 'El pedido con ese id no existe'}
            });
        }

        provider.nombre_proveedor = body.nombre_proveedor;
        provider.nombre_empresa = body.nombre_empresa;

        provider.save((err, providerSave) => {

            if(err) {
                return res.status(500).json({
                    ok: false, 
                    message: 'Error al actualizar proveedor',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                provider: providerSave
            });
        });
    });
});


// ================================================
// OBTENER TODOS LOS USUARIOS 
// ================================================
app.get('/', mdAutentication.verificaToken, (req, res) => {


    Provider.find({})
        .exec(
            (err, provider) => {
                if(err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error al cargar proveedor',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    provider: provider
                });
            }
        )
});


// ================================================
// BORRAR UN PROVEEDOR 
// ================================================
app.delete('/:id', mdAutentication.verificaToken, (req, res) => {

    var id = req.params.id;

    Provider.findByIdAndRemove(id, (err, providerDelete) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al eliminar el proveedor',
                errors: err
            });
        }

        if(!providerDelete) {

            return res.status(400).json({
                ok: false,
                message: 'El proveedor con ese id no existe',
                errors: {message: 'No existe el proveedor'}
            });
        }

        res.status(200).json({
            ok: true,
            provider: providerDelete
        });
    });
});


module.exports = app;