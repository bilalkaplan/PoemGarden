const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const poemRoutes = require('./routes/poemRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"], credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Veritabanı Bağlantısı
const MONGO_URI = process.env.MONGO_URI;

console.log("Sunucu başlatılmaya çalışılıyor...");

mongoose.connect(MONGO_URI)
    .then(() => console.log('>>> MONGODB BAĞLANTISI BAŞARILI! <<<'))
    .catch((err) => console.error('>>> MONGODB BAĞLANTI HATASI: <<<', err));

// Rotalar
app.use('/api/auth', authRoutes);
app.use('/api/poems', poemRoutes);
app.use('/api/admin', adminRoutes);
console.log('>>> adminRoutes mounted');

app.get('/api/admin/ping', (req, res) => {
    res.json({ status: 'ok', route: '/api/admin/ping' });
});

app.get('/', (req, res) => {
    res.send('Backend Aktif ve Çalışıyor!');
});

// Error Handler Middleware
app.use(errorHandler);

// Portu dinle
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`>>> SUNUCU ${PORT} PORTUNDA BAŞARIYLA BAŞLATILDI! <<<`);
});