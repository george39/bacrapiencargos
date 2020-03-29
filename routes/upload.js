var express = require('express');
var app = express();

var fileUpload = require('express-fileupload');

app.use(fileUpload());


app.put('/', (req, res, next ) => {

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



    res.status(200).json({
        ok: true,
        extencionArchivo: extencionArchivo
    });
});





module.exports = app;