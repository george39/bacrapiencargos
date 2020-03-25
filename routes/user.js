var express = require('express');

var app = express();
var bcrypt = require('bcryptjs');

var User = require('../models/user'); 



// ================================================
// OBTENER TODOS LOS USUARIOS 
// ================================================

app.get('/', (req, res, next ) => {

    User.find({}, 'name surname address email date role')
        .exec(    
            (err, usuarios) => {
                if(err) {
                    return res.status(200).json({
                        ok:true,
                        mensaje: 'Error cargando usuario',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    usuarios: usuarios
                });
            });
    
});


// ================================================
// ACTUALIZAR UN USUARIO 
// ================================================
app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    User.findById(id, (err, user) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar usuario',
                error: err
            });
        }

        if(!user) {
            return res.status(400).json({
                ok: false,
                message: 'El usuario con id' + id + 'no existe',
                errors: {message: 'No existe un usuario con ese id'}
            });
        }

        user.name = body.name;
        user.surname = body.surname;        
        address = body.address;
        email = body.email;        
        role = body.role;


        user.save((err, userSave) => {
            if(err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar usuario',
                    error: err
                });
            }

            userSave.password = ':)';
            res.status(200).json({
                ok: true,
                user: userSave 
            });
        });
    });

    
});


// ================================================
// CREAR UN NUEVO USUARIO 
// ================================================
app.post('/', (req, res) => {
    var body = req.body;

    var user = new User({
        name: body.name,
        surname: body.surname,
        address: body.address,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10 ),
        role: body.role
    });

    user.save((err, userSave) => {

        if(err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al crear usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            user: userSave
        });

    });

});


// ================================================
// BORRAR UN USUARIO 
// ================================================
app.delete('/:id', (req, res) => {

    var id = req.params.id;

    User.findByIdAndRemove(id, (err, userDelete) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al borrar usuario',
                errors: err
            });
        }

        if (!userDelete) {
            return res.status(400).json({
                ok: false,
                message: 'No existe un usuario con ese id',
                errors: {message: 'No existe un usuario con ese id'}
            });
        }

        res.status(200).json({
            ok: true,
            user: userDelete
        });
    });
});


module.exports = app;