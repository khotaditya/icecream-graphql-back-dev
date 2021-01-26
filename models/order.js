const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    icecream: {
        type: Schema.Types.ObjectId,
        ref: 'Icecream'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},
{ timestamps: true }
);
module.exports = mongoose.model('Order', orderSchema);