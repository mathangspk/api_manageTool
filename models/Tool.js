const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ToolSchema = Schema({
    status:{
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    manufacturer: {
        type: String,
        required: true,
    },
    type:{
        type: String,
        required:true,
    },
    quantity:{
        type: Number,
        required: true
    },
    images:[{
        filename: {
            type: String,
        }
    }],
    currentUser:{
        type: String,
    },
    date: {
        type:Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Tool', ToolSchema);