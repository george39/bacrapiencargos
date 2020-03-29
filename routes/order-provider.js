var express = require('express');

var mdAutentication = require('../middleware/autentication');

var OrderProvider = require('../models/order-provider');

var app = express();



// ================================================
// CREAR UN PEDIDO DE PROVEEDOR 
// ================================================
app.post('/', mdAutentication.verificaToken, (req, res) => {

    var body = req.body;

    var orderProvider = new OrderProvider({
        provider_id: body.provider_id,
        name_product: body.name_product,
        quantity: body.quantity,
        price: body.price
    });

    orderProvider.save((err, orderProviderSave) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al crear pedido',
                errors: err

            });
        }

        res.status(200).json({
            ok: true,
            orderProider: orderProviderSave
        });
    });
});


// ================================================
// OBTENER TODOS LOS PEDIDOS DE PROVEEDORES 
// ================================================
app.get('/', mdAutentication.verificaToken, (req, res) => {

    OrderProvider.find({})
        .populate('provider_id')
        .exec(
            (err, orderProvider) => {

                if(err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error al obtener el usuario',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    orderProvider: orderProvider
                });
            });
});


// ================================================
// ACTUALIZAR PEDIDO 
// ================================================
app.put('/:id', mdAutentication.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    OrderProvider.findById(id, (err, orderProvider) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar pedido',
                errors: err
            });
        }

        if(!orderProvider) {

            return res.status(400).json({
                ok: false,
                message: 'El usuario con ese id no existe',
                errors: err
            });
        }

        orderProvider.provider_id = body.orderProider;
        orderProvider.name_product = body.name_product;
        orderProvider.quantity = body.quantity;
        orderProvider.price = body.price;

        orderProvider.save((err, orderProviderSave) => {

            if(err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error al actualizar el pedido',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                orderProvider: orderProviderSave
            });
        });
    });
});


// ================================================
// ELIMINAR UN PEDIDO DE PROVEEDOR 
// ================================================
app.delete('/:id', mdAutentication.verificaToken, (req, res) => {

    var id = req.params.id;
    
    OrderProvider.findByIdAndRemove(id, (err, orderProviderDelete) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al eliminar pedido',
                errors: err
            });
        }

        if(!orderProviderDelete) {
            return res.status(400).json({
                ok: false,
                message: 'El pedido con ese id no existe',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            orderProvider: orderProviderDelete
        });
    });
});


module.exports = app;