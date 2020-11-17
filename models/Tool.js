const mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');

const ToolSchema = mongoose.Schema({
    toolId: {
        type: Number,
        required: true,
        unique: true
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

// Apply the uniqueValidator plugin to userSchema.
ToolSchema.plugin(uniqueValidator,{ message: 'Lỗi, đã có {PATH} = {VALUE}' });

module.exports = mongoose.model('Tool', ToolSchema);