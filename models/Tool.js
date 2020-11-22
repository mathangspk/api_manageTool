const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ToolSchema = mongoose.Schema({
    // toolId: {
    //     // type: Number,
    //     // required: false,
    //     // unique: true
    //     type: Schema.Types.ObjectId,
    //     ref: Order
    // },
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