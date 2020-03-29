var express = require('express');

var app = express();

var User = require('../models/user');
var Provider = require('../models/provider');
var OrderProvider = require('../models/order-provider');
var OrderUser = require('../models/order-client');
var Product = require('../models/product');



// ================================================
// BUSQUEDA UNA SOLA COLECCÓN 
// ================================================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa; 

    switch(tabla) {

        case 'users': 
            promesa = searchUser(busqueda, regex);
            break;
        
        case 'orderClient':
            promesa = searchOrderUser(busqueda, regex);
        break;    

        case 'orderproviders': 
            promesa = searchOrderProvider(busqueda, regex);
        break;
        
        case 'products':
            promesa = searchProduct(busqueda, regex);
        break;
        
        case 'providers':
            promesa = searchProvider(busqueda, regex);
        break;
        
        default:
            return res.status(400).json({
                ok: false,
                message: 'No existe ese tipo de busqueda',
                error:  {message: 'No existe esa tabla'}
            });
            
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });
});


// ================================================
// BUSQUEDA DE TODAS LAS COLECCIONES 
// ================================================
app.get('/todo/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

   Promise.all([
       searchUser(busqueda, regex),
       searchProvider(busqueda, regex),
       searchOrderProvider(busqueda, regex),
       searchOrderUser(busqueda, regex),
       searchProduct(busqueda, regex),
   ])
   .then(respuestas => {
       res.status(200).json({
           ok: true,
           user: respuestas[0],
           provider: respuestas[1],
           orderProvider: respuestas[2],
           orderUser: respuestas[3],
           product: respuestas[4],
       });
   });

    

});

function searchUser(busqueda, regex) {

    return new Promise((resolve, reject) => {

        User.find({name: regex}, (err, user) => {

            if(err) {
                reject('Error al cargar usuario', err);
            } else {
                resolve(user)
            }
        });
    });
}

function searchProvider(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Provider.find({nombre_proveedor: regex}, (err, provider) => {

            if(err) {
                reject('Error al cargar proveedor', err);
            } else {
                resolve(provider)
            }
        });
    });
}

function searchOrderProvider(busqueda, regex) {

    return new Promise((resolve, reject) => {

        OrderProvider.find({name_product: regex})
            .populate('provider_id')
            .exec((err, order) => {

                if(err) {
                    reject('Error al cargar orden de proveedor')
                } else {
                    resolve(order);
                }
            });
    });    
}

function searchOrderUser(busqueda, regex) {

    return new Promise((resolve, reject) => {

        OrderUser.find({detail: regex})
            .populate('userId')
            .populate('product_id')
            .exec((err, order) => {

                if(err) {
                    reject('Error al cargar orden del cliente', err);
                } else {
                    resolve(order)
                }
            });
        
    });
}

function searchProduct(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Product.find({name: regex}, (err, product) => {

            if(err) {
                reject('Error al cargar producto');
            } else {
                resolve(product);
            }
        });
    });
}


module.exports = app;