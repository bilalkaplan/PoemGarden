const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const notificationSchema = new mongoose.Schema({
    type: { type: String, enum: ['comment', 'reply'], required: true },
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    poem: { type: mongoose.Schema.Types.ObjectId, ref: 'Poem', required: true },
    commentId: mongoose.Schema.Types.ObjectId,
    message: String,
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    nickname: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    bio: { type: String, default: 'Edebiyat aşığı.' },
    avatar: { type: String, default: 'https://via.placeholder.com/150' },
    role: { type: String, enum: ['poet', 'admin'], default: 'poet' },
    notifications: [notificationSchema]
}, { timestamps: true });

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);