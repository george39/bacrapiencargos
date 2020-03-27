var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var orderProviderSchema = new Schema({
    provider_id: {type: Schema.Types.ObjectId, ref:'Provider'},
    name_product: {type: String, required: [true, 'El nombre del producto es necesario']},
    quantity: {type: Number, required: [true, 'La cantidad es necesaria']},
    price: {type: Number, required: [true, 'El precio es necesario']},
    date: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('OrderProvider', orderProviderSchema);