// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//Inicializar varaibles
var app = express();


// body parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Importar rutas
var appRoutes = require('./routes/app');
var userRoutes = require('./routes/user');


// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/tienda', (err, res) => {
    if( err ) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

//Rutas
app.use('/usuario', userRoutes);
app.use('/', appRoutes);


// Escuchar peticiones
app.listen(3000, () => {
    console.log('Exress server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});