var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProviderSchema = new Schema({
    nombre_proveedor: {type: String, required: [true, 'El nombre es obligatorio']},
    nombre_empresa: {type: String, required: [true, 'El nombre de la empresa es obligatorio']}
});

module.exports = mongoose.model('Provider', ProviderSchema);