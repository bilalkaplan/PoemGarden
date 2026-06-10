const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    edited: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    replies: [replySchema],
    edited: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const poemSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    font: { type: String, default: 'Arial' },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    comments: [commentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Poem', poemSchema);