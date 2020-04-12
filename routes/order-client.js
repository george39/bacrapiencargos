var express = require('express');
var mdAutentication = require('../middleware/autentication');

var OrderClient = require('../models/order-client');

var app = express();



// ================================================
// OBTENER TODOS LOS PEDIDOS 
// ================================================
app.get('/', mdAutentication.verificaToken, (req, res, next) => {

    OrderClient.find({})
        .populate('userId')
        .populate('product_id')
        .exec(
            (err, order) => {
                if(err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error cargando pedido',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    order: order
                });
            }
        )
});



// ================================================
// ACTUALIZAR UN PEDIDO 
// ================================================
app.put('/:id', mdAutentication.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    OrderClient.findById(id, (err, order) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar el pedido',
                errors: err
            });
        }

        if(!order) {
            return res.status(400).json({
                ok: true,
                message: 'El pedido con id ' + id + ' no existe',
                errors: {message: 'No existe el pedido con ese id'}
            });
        }

        order.userId = body.userId;
        order.product_id = body.product_id;
        order.detail = body.detail;
        order.price = body.price;

        order.save((err, orderSave) => {
            if(err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error al actualizar el pedido',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                order: orderSave
            });
        });
    });
});


// ================================================
// GUARDAR UN NUEVO PEDIDO 
// ================================================
app.post('/', mdAutentication.verificaToken, (req, res) => {

    var body = req.body;

    var order = new OrderClient({
        userId: body.userId,
        product_id: body.product_id,
        detail: body.detail,
        price: body.price

    });

    order.save((err, orderSave) => {

        if (err) {
            return res.status(500).json({
                ok: true,
                message: 'Error al crear pedido',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            order: orderSave,

        });
    });
});

// ================================================
// BORRAR UN PEDIDO ESPECIFICO
// ================================================
app.delete('/:id', mdAutentication.verificaToken, (req, res) => {
    var id = req.params.id;

    OrderClient.findByIdAndRemove(id, (err, orderDelete) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al eliminar pedido',
                errors: err
            });
        }

        if(!orderDelete) {
            return res.status(400).json({
                ok: false,
                message: 'El pedido no existe',
                errors: {message: 'No existe el pedido'}
            });
        }

        res.status(200).json({
            ok: true,
            order: orderDelete
        });
    });
});

module.exports = app;