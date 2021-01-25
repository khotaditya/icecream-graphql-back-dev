const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const icecreamSchema = new Schema({
    flavor1: {
        type: String,
        required: true,
    },
    flavor2: {
        type: String
    },
    flavor3: {
        type: String
    },
    size: {
        type: String,
        required: true
    },
    toppings: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    orderby: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Icecream', icecreamSchema);