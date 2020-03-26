var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var orderClientSchema = new Schema ({
    userId: {type:Schema.Types.ObjectId, ref:'User'},
    detail: {type: String, required: [true, 'La descripción es necesaria']},
    price: {type: String, required: [true, 'El precio es obligatorio']},
    date: {type: Date, default: Date.now()}
}, {collection:'orderClient'});

module.exports = mongoose.model('OrderClient', orderClientSchema);