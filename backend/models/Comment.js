const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    poem: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Poem', 
        required: true 
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);