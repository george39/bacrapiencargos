var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');


var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un role valido'
};

var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {type: String, required: [true, 'El nombre es necesario']}, 
    surname: {type: String, required: [true, 'El apellido es obligatorio']},
    address: {type: String, required: [true, 'La dirección es necesaria']},
    email: {type: String, unique: true, required: [true, 'El email es necesario']},
    password: {type: String, required: [true, 'La contraseña es necesaria']},
    date: { type: Date, default: Date.now() },
    role: {type: String, required: true, default: 'USER_ROLE', enum: rolesValidos},
    image: {type: String, required: false}
});

userSchema.plugin(uniqueValidator, {message: 'El correo debe de ser único'});

module.exports = mongoose.model('User', userSchema);