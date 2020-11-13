const mongosee = require('mongoose');
const Schema = mongosee.Schema;

//create Schema 
const OrderSchema = new Schema({
    customerId: {
        type: String,
        required: true
    },
    product: {               
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    cash: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = Order = mongosee.model('order',OrderSchema)