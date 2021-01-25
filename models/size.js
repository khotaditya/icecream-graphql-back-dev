const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sizeSchema = new Schema({
    size: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Size', sizeSchema);