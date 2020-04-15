// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//Inicializar varaibles
var app = express();


// cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});


// body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Importar rutas
var appRoutes = require('./routes/app');
var userRoutes = require('./routes/user');
var loginRoutes = require('./routes/login');
var orderClientRoutes = require('./routes/order-client');
var providerRoutes = require('./routes/provider');
var orderProviderRoutes = require('./routes/order-provider');
var productRoutes = require('./routes/product');
var searchRoutes = require('./routes/search');
var uploadRoute = require('./routes/upload');


// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/tienda', (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

//Rutas
app.use('/usuario', userRoutes);
app.use('/login', loginRoutes);
app.use('/pedido-cliente', orderClientRoutes);
app.use('/proveedor', providerRoutes);
app.use('/pedido-proveedor', orderProviderRoutes);
app.use('/productos', productRoutes);
app.use('/buscar', searchRoutes);
app.use('/upload', uploadRoute);
app.use('/', appRoutes);


// Escuchar peticiones
app.listen(3000, () => {
    console.log('Exress server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});