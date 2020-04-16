var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();
var User = require('../models/user');


app.post('/', (req, res) => {

    var body = req.body;

    User.findOne({ email: body.email }, (err, userBd) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!userBd) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, userBd.password)) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas',
                errors: err
            });
        }

        // Crear un token
        userBd.password = ':)';
        var token = jwt.sign({ user: userBd }, SEED, { expiresIn: 1440000000 }); // 4 horas


        res.status(200).json({
            ok: true,
            user: userBd,
            token: token,
            id: userBd._id
        });
    });
});







module.exports = app;