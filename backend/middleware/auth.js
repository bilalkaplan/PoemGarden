const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token || token === 'null' || token === 'undefined') {
        return res.status(401).json({ message: 'Oturum bulunamadı. Lütfen çıkış yapıp tekrar giriş yapın.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123', { ignoreExpiration: true });
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
            return res.status(401).json({ message: 'Kullanıcı hesabı doğrulanamadı. Lütfen çıkış yapıp tekrar giriş yapın.' });
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Yetkisiz erişim, lütfen çıkış yapıp tekrar giriş yapın.' });
    }
};

module.exports = { protect };
