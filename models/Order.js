const mongosee = require('mongoose');
const Schema = mongosee.Schema;

//create Schema 
const OrderSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    toolId: [{               
        type: String,
        required: true
    }],
    WO: {
        type: Number,
        required: true
    },
    PCT: {
        type: String,
        required: true
    },
    timeStart: {
        type: Date,
        required: true
    },
    timeStop: {
        type: Date,
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