const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Tool = require('./Tool');
//create Schema 
const CchttSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    PCCHTT: {
        type: String,
        required: true
    },
    WO: {
        type: String,
        required: true
    },
    PCT: {
        type: String,
        required: true
    },
    NV: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    timeChange: {
        type: Date,
        required: true
    },
    note: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = Cchtt = mongoose.model('cchtt', CchttSchema)