var express = require('express');

var mdAutentication = require('../middleware/autentication');

var app = express();

var Product = require('../models/product');


// ================================================
// CREAR UN NUEVO PRODUCTO 
// ================================================
app.post('/', (req, res, next ) => {

    var body = req.body;

    var product = new Product({
        provider_id: body.provider_id,
        name: body.name,
        price_may: body.price_may,
        price_client: body.price_client,
        image: body.image
    });

    product.save((err, productSave) => {
        if(err) {
            return res.status({
                ok: false,
                message: 'Error al crear producto',
                errors: err
            });
        }
        res.status(200).json({
            ok:true,
            product: productSave
        });
    });
});


// ================================================
// OBTENER TODOS LOS USUARIOS 
// ================================================
app.get('/', mdAutentication.verificaToken, (req, res) => {

    Product.find({})
        .populate('provider_id')
        .exec(
            (err, product) => {
                if(err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error al obtener usuario',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    product: product
                });
            });
        
});


// ================================================
// ACTUALIZAR PRODUCTOS 
// ================================================
app.put('/:id', mdAutentication.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Product.findById(id, (err, product) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al busca producto',
                errors: err
            });
        }

        if(!product) {
            return res.status(400).json({
                ok: false,
                message: 'El usuario con el id ' + id + 'no existe',
                errors: err
            });
        }

        product.provider_id = body.provider_id;
        product.name = body.name;
        product.price_may = body.price_may;
        product.price_client = body.price_client;
        product.image = body.image;

        product.save((err, productSave) => {

            if(err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error al actualizar',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                product: productSave
            });
        });
    });
});


// ================================================
// ELIMINAR UN PRODUCTO 
// ================================================
app.delete('/:id', mdAutentication.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Product.findByIdAndRemove(id, (err, productDelete) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al obtener pedido',
                errors: err
            });
        }

        if(!productDelete) {
            return res.status(400).json({
                ok: false,
                message: 'El pedido con el id ' + id + 'no existee',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            product: productDelete
        });
    });

});

module.exports = app;