const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const toppingsSchema = new Schema({
    title: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Toppings', toppingsSchema);