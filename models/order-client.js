var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var orderClientSchema = new Schema ({
    userId: {type:Schema.Types.ObjectId, ref:'User'},
    product_id: {type: Schema.Types.ObjectId, ref:'Product'},
    detail: {type: String, required: [true, 'La descripción es necesaria']},
    price: {type: Number, required: [true, 'El precio es obligatorio']},
    date: {type: Date, default: Date.now()}
}, {collection:'orderClient'});

module.exports = mongoose.model('OrderClient', orderClientSchema);