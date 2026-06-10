# PoemGarden - Full Stack Web Application

## 📚 Proje Tanımı

PoemGarden, MERN Stack (MongoDB, Express.js, React.js, Node.js) kullanarak geliştirilen, kullanıcıların şiir paylaşabildiği, yorumlar ekleyebildiği, profil yönetimi yapabildiği tam işlevli bir web uygulamasıdır.

### 🎯 Proje Amacı

Modern web geliştirme mimarisini uygulayarak:
- Sunucu tarafında güçlü bir RESTful API tasarımı
- İstemci tarafında kullanıcı dostu React interface
- MongoDB ile veri depolama ve yönetim
- JWT tabanlı güvenli kimlik doğrulama sistemi

## 🛠️ Teknolojiler

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM (Object Data Modeling)
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variables management

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **i18next** - Internationalization (TR, EN, SR, DE)
- **Vite** - Build tool

### Database
- **MongoDB Atlas** - Cloud database service

## 📁 Klasör Yapısı

```
poemgarden/
├── backend/
│   ├── controllers/
│   │   ├── authController.js      # Kimlik doğrulama işlemleri
│   │   └── poemController.js      # Şiir yönetim işlemleri
│   ├── models/
│   │   ├── User.js                # Kullanıcı şeması
│   │   ├── Poem.js                # Şiir şeması
│   │   └── Comment.js             # Yorum şeması
│   ├── routes/
│   │   ├── authRoutes.js          # Auth endpoint'leri
│   │   └── poemRoutes.js          # Poem endpoint'leri
│   ├── middleware/
│   │   └── auth.js                # JWT doğrulama middleware
│   ├── server.js                  # Server başlangıcı
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Ana sayfa - şiir listesi
│   │   │   ├── Login.jsx          # Giriş sayfası
│   │   │   ├── Register.jsx       # Kayıt sayfası
│   │   │   └── Profile.jsx        # Profil sayfası
│   │   ├── App.jsx                # Ana component
│   │   ├── i18n.js                # Çok dil desteği
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Global stiller
│   ├── vite.config.js
│   └── package.json
├── .env                           # Environment variables
├── .gitignore                     # Git ignored files
└── package.json                   # Root package.json (npm start ile başlatmak için)
```

## 🚀 Kurulum ve Başlatma

### Gereksinimler
- Node.js (v14 veya üzeri)
- npm veya yarn
- MongoDB Atlas hesabı

### 1. Projeyi Klonlayın
```bash
git clone <repo-url>
cd poemgarden
```

### 2. Root Dizinde
```bash
# Tüm bağımlılıkları yükle
npm install

# Backend ve Frontend'i aynı anda başlat
npm start
```

### 3. Backend Klasöründe (ayrı terminal)
```bash
cd backend
npm install
npm run dev
```

### 4. Frontend Klasöründe (ayrı terminal)
```bash
cd frontend
npm install
npm run dev
```

## 🌐 API Endpoints

### Kimlik Doğrulama
- `POST /api/auth/register` - Yeni kullanıcı kayıt
- `POST /api/auth/login` - Kullanıcı giriş
- `PUT /api/auth/profile` - Profil güncelleme (Protected)

### Şiir Yönetimi
- `GET /api/poems` - Tüm şiirleri getir
- `POST /api/poems` - Yeni şiir oluştur (Protected)
- `PUT /api/poems/:id` - Şiir güncelle (Protected)
- `DELETE /api/poems/:id` - Şiir sil (Protected)
- `POST /api/poems/:id/comments` - Yorum ekle (Protected)

## 🗄️ Veritabanı Şeması

### User Model
```javascript
{
  firstName: String,
  lastName: String,
  nickname: String (unique, @ ile başlar),
  email: String (unique),
  password: String (hashed with bcrypt),
  createdAt: Date
}
```

### Poem Model
```javascript
{
  title: String,
  content: String,
  font: String,
  author: ObjectId (ref: User),
  comments: [CommentSchema],
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Schema
```javascript
{
  text: String,
  author: ObjectId (ref: User),
  createdAt: Date
}
```

## 🔐 Kimlik Doğrulama

- JWT token ile session yönetimi
- Şifreler bcryptjs ile hashlenmektedir
- Protected routes frontend ve backend tarafında kontrol edilir
- Token localStorage'de saklanır

## 🌍 Çok Dil Desteği

Uygulama 4 dili destekler:
- 🇹🇷 Türkçe (TR)
- 🇬🇧 İngilizce (EN)
- 🇷🇸 Sırpça (SR)
- 🇩🇪 Almanca (DE)

Dil değişikliği header'daki düğmelerle yapılır.

## 👤 Kullanıcı Özellikleri

### Kayıt Ol
- Ad, Soyad, Kullanıcı Adı, E-posta girdileri
- Şifre minimum 8 karakter ve en az 1 özel karakter içermesi gerekir
- Şifre göster/gizle toggle
- Real-time şifre doğrulama feedback

### Giriş Yap
- E-posta ve şifre ile giriş
- Şifre göster/gizle toggle
- JWT token elde etme

### Profil
- Kendi şiirlerini görüntüleme
- Ad/Soyad güncelleme
- Şiir oluşturma/düzenleme/silme
- Font seçeneği (Arial, Georgia, Times New Roman vb.)

### Ana Sayfa
- Tüm şiirleri görüntüleme
- Okunmayan kısımları göster/gizle
- Yorum ekleme
- Real-time şiir güncelleme (3 saniye aralığı)

## 📊 Proje Özellikleri

✅ **RESTful API** - 7+ endpoint  
✅ **MVC Mimarisi** - Controllers, Models, Routes ayrımı  
✅ **JWT Authentication** - Güvenli kimlik doğrulama  
✅ **Responsive Design** - Mobil uyumlu  
✅ **Çok Dil Desteği** - 4 dil  
✅ **Form Validasyonu** - Client ve server tarafı  
✅ **Error Handling** - Kapsamlı hata yönetimi  
✅ **Protected Routes** - Backend ve Frontend koruma  
✅ **Password Security** - bcrypt hashing ve şifre şartları  
✅ **MongoDB Relationships** - populate ile ilişki yönetimi  

## 📝 UML Diyagramları

### Use Case Diagram

```
┌─────────────────────────────────────┐
│          PoemGarden                 │
└─────────────────────────────────────┘
           
    Anonim Kullanıcı        Kimlik Doğrulanmış Kullanıcı
          │                              │
    ┌─────┴─────┐                    ┌──┴──────────────────┐
    │           │                    │                     │
   Kayıt      Giriş              Profil Yönetimi      Şiir Yönetimi
    │           │                │   │   │   │         │   │  │  │
    │           │                │   │   │   │         │   │  │  │
   [Kayıt]    [Giriş]      [Güncelle] │   │  [Çıkış]  [Yeni] [Düzenle]
                            [Profili Görüntüle]         [Sil] [Yorum]
```

### Activity Diagram - Kullanıcı Kayıt Akışı

```
Start
  │
  ▼
[Kayıt Sayfasını Aç]
  │
  ▼
[Bilgileri Gir]
  │
  ▼
{Şifre Validi?} ──X──> [Hata: Şifre Şartları]
  │                    │
  Y                    ▼
  │            [Tekrar Dene]
  ▼
[Kayıt Butonuna Bas]
  │
  ▼
{Email Zaten Kayıtlı?} ──X──> [Hata: Email Mevcut]
  │                           │
  Y                           ▼
  │                    [Tekrar Dene]
  ▼
{Username Zaten Alınmış?} ──X──> [Hata: Username Mevcut]
  │                              │
  Y                              ▼
  │                       [Tekrar Dene]
  ▼
[Şifre Hash'le (bcrypt)]
  │
  ▼
[Veritabanına Kaydet]
  │
  ▼
[JWT Token Oluştur]
  │
  ▼
[Başarı Mesajı + Login'e Yönlendir]
  │
  ▼
End
```

### ER Diagram - Veritabanı Şeması

```
┌──────────────┐           ┌──────────────┐
│    User      │           │    Poem      │
├──────────────┤           ├──────────────┤
│ _id (PK)     │           │ _id (PK)     │
│ firstName    │           │ title        │
│ lastName     │           │ content      │
│ nickname     │◄──────────│ font         │
│ email        │           │ author (FK)  │
│ password     │           │ createdAt    │
│ createdAt    │           │ updatedAt    │
└──────────────┘           └──────────────┘
                                  │
                                  │
                           ┌──────┴──────┐
                           │  Comment    │
                           ├─────────────┤
                           │ _id (PK)    │
                           │ text        │
                           │ author (FK) │
                           │ createdAt   │
                           └─────────────┘
```

### Component Hiyerarşisi

```
App
├── Navigation (Header)
│   ├── Logo
│   ├── NavLinks
│   └── LanguageSwitcher
├── Routes
│   ├── Home
│   │   ├── PoemList
│   │   │   └── PoemItem
│   │   │       └── CommentSection
│   │   └── AddPoemForm
│   ├── Login
│   │   └── LoginForm
│   ├── Register
│   │   ├── RegisterForm
│   │   └── PasswordValidator
│   └── Profile
│       ├── UserInfo
│       ├── EditProfileForm
│       └── MyPoemsList
│           └── PoemCard
```

## 🔍 Hata Yönetimi

- **Server Tarafı**: Try-catch blokları ve error middleware
- **İstemci Tarafı**: Axios interceptors ve user-friendly error messages
- **Validasyon**: Schema validasyonu ve form kontrolü
- **Logging**: Console ve file logging (isteğe bağlı)

## 🎨 Tasarım Özellikleri

- **Dark Theme**: Koyu tema arayüz
- **Responsive**: Mobile, tablet, desktop uyumlu
- **Accessible**: Kullanıcı dostu
- **Performant**: Lazy loading ve optimization

## 📦 Paket Versiyonları

Backend:
- express: ^5.2.1
- mongoose: ^9.6.3
- jsonwebtoken: ^9.0.3
- bcryptjs: ^3.0.3

Frontend:
- react: ^19.2.6
- react-router-dom: ^7.17.0
- axios: ^1.17.0
- i18next: ^26.3.1

## ✅ Kontrol Listesi

- [x] RESTful API (7+ endpoint)
- [x] MVC Architecture
- [x] JWT Authentication
- [x] MongoDB Integration
- [x] React Components (4+ pages)
- [x] Form Validation
- [x] Error Handling
- [x] Responsive Design
- [x] Multi-language Support
- [x] Protected Routes
- [x] Password Security
- [x] Git Repository

## 📄 Lisans

Bu proje eğitim amaçlı oluşturulmuştur.

## 👨‍💻 Geliştirici

**Proje Adı**: PoemGarden  
**Versiyon**: 1.0.0  
**Teslim Tarihi**: 2026

---

## 🐛 Sorun Giderme

### MongoDB Bağlantı Hatası
```bash
# .env dosyasında MONGO_URI'ı kontrol edin
# MongoDB Atlas'ta whitelist IP'niz ekli mi kontrol edin
```

### Port Hatası (Port 5000 kullanımda)
```bash
# .env dosyasında PORT değerini değiştirin
PORT=3001
```

### CORS Hatası
```bash
# Backend'de CORS ayarları:
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));
```

### Frontend Başlamıyor
```bash
cd frontend
npm install
npm run dev
```

## 📞 İletişim

Herhangi bir sorun için lütfen issue açınız.
