const mongosee = require('mongoose');
const Schema = mongosee.Schema;

//create Schema 
const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
},
    { timestamps: true }
)

module.exports = Post = mongosee.model('post', PostSchema)