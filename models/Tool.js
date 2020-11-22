const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ToolSchema = mongoose.Schema({
    status:{
        type: Boolean,
        required: true,
    },
    name: {
        type: String,
        required: true,
        min:6
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
    date: {
        type:Date,
        default: Date.now
    }
})


module.exports = mongoose.model('Tool', ToolSchema);