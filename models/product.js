var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    provider_id: {type: Schema.Types.ObjectId, ref:'Provider'},
    name: {type: String, required: [true, 'El nombre es necesario']},
    price_may: {type: Number, required: [true, 'El precio al por mayor es necesario']},
    price_client: {type: Number, required: [true, 'El precio del cliente es necesario']},
    image: {type: String, required: false}
});

module.exports = mongoose.model('Product', ProductSchema);