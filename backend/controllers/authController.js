const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
};

const register = async (req, res) => {
    try {
        const { firstName, lastName, email, nickname, password } = req.body;
        
        // Nickname'i @ ile başlasın diye kontrol et
        let cleanNickname = nickname.trim();
        if (!cleanNickname.startsWith('@')) {
            cleanNickname = '@' + cleanNickname;
        }
        
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'Bu e-posta zaten kullanımda.' });
        
        const nicknameExists = await User.findOne({ nickname: cleanNickname });
        if (nicknameExists) return res.status(400).json({ message: 'Bu kullanıcı adı zaten alınmış.' });

        const user = await User.create({ firstName, lastName, email, nickname: cleanNickname, password });
        res.status(201).json({ _id: user._id, firstName: user.firstName, lastName: user.lastName, nickname: user.nickname, email: user.email, bio: user.bio, avatar: user.avatar, token: generateToken(user._id) });
    } catch (error) {
        res.status(500).json({ message: 'Kayıt hatası: ' + error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({ _id: user._id, firstName: user.firstName, lastName: user.lastName, nickname: user.nickname, email: user.email, bio: user.bio, avatar: user.avatar, token: generateToken(user._id) });
        } else {
            res.status(401).json({ message: 'Geçersiz bilgiler' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Giriş hatası: ' + error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, bio, avatar } = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, { firstName, lastName, bio, avatar }, { new: true });
        res.json({ _id: user._id, firstName: user.firstName, lastName: user.lastName, nickname: user.nickname, email: user.email, bio: user.bio, avatar: user.avatar });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getNotifications = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('notifications')
            .populate('notifications.from', 'nickname avatar')
            .populate('notifications.poem', 'title');
        res.json(user?.notifications || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const markNotificationRead = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const notif = user.notifications.id(req.params.notifId);
        if (!notif) return res.status(404).json({ message: 'Bildirim bulunamadı' });
        notif.read = true;
        await user.save();
        res.json({ message: 'Bildirim okundu' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { register, login, updateProfile, getUserById, getNotifications, markNotificationRead };