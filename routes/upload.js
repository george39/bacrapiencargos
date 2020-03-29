var express = require('express');
var app = express();
var fs = require('fs');

var User = require('../models/user');
var Product = require('../models/product');

var fileUpload = require('express-fileupload');

app.use(fileUpload());


app.put('/:tipo/:id', (req, res, next ) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // tipos de coleccion
    var tiposValidos = ['user', 'product'];
    if(tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colecion no es valido',
            error: {message: 'Tipo de coleccion no es valida'}
        });
    }

    if (!req.files) {

        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciona nada',
            error: {message: 'Debe seleccionar una imagen'}
        });
    }
    
    //obtener nombre del archivo
    var archivo = req.files.image;
    var nombreCortado = archivo.name.split('.');
    var extencionArchivo = nombreCortado[nombreCortado.length -1];
    
    // Sólo estas extenciones aceptamos
    var extencionesValidas =  ['png', 'jpeg', 'gif', 'jpg'];
    if (extencionesValidas.indexOf(extencionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extencion no valida',
            error: {message: 'Las extenciones validas son ' + extencionesValidas.join(', ')}
        });
    }


    // Nombre de archivo personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extencionArchivo}`;

    // Mover el archivo del temporal a un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {

        if(err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al mover el archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);
        // res.status(200).json({
        //     ok: true,
        //     message: 'Archivo movido',
        //     extencionArchivo: extencionArchivo
        // });
    });

});


function subirPorTipo(tipo, id, nombreArchivo, res) {

    if(tipo === 'user') {

        User.findById(id, (err, user) => {

            if (!user) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuaro no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }

            var pathViejo = './uploads/user/' + user.image;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            user.image = nombreArchivo;

            user.save((err, userUpdated) => {

                userUpdated.password = ':)';
                return  res.status(200).json({
                    ok: true,
                    message: 'Imagen de usuario actualizada',
                    user: userUpdated
                });
            });
        });
    }

    
    
    if(tipo === 'product') {

        Product.findById(id, (err, product) => {

            if (!product) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'El producto no existe',
                    errors: { message: 'Producto no existe' }
                });
            }

            var pathViejo = './uploads/product/' + product.image;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            product.image = nombreArchivo;

            product.save((err, productUpdated) => {
                return  res.status(200).json({
                    ok: true,
                    message: 'Imagen de producto actualizada',
                    user: productUpdated
                });
            });
        });
    }
}





module.exports = app;