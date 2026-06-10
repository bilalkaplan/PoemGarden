# PoemGarden

**Canlı Demo (Live):** [https://poem-garden.vercel.app](https://poem-garden.vercel.app)

Bu proje, Web Geliştirme dersi dönemi projesi kapsamında geliştirilmiş bir MERN Stack (MongoDB, Express.js, React, Node.js) web uygulamasıdır. Kullanıcıların kayıt olup giriş yapabileceği, kendi şiirlerini paylaşıp diğer kullanıcıların şiirlerine yorum yapabileceği tam kapsamlı bir platformdur. Veritabanı ve sunucu kısımları buluta taşınmış olup, uygulama herkesin erişebileceği şekilde Vercel ve Render üzerinden **canlıya (deploy)** alınmıştır.

## Kullanılan Teknolojiler

**Frontend:**
- React.js
- React Router DOM
- Axios
- i18next (Çoklu dil desteği için: TR, EN, DE, SR)

**Backend:**
- Node.js
- Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT) ve bcryptjs (Kimlik doğrulama işlemleri için)

## Öne Çıkan Özellikler
- **Çoklu Dil Desteği (i18n):** TR, EN, SR, DE dillerinde tam senkronizasyon.
- **Rol Tabanlı Erişim:** Admin ve Şair (Poet) rolleri ile genişletilmiş yönetim.
- **Gerçek Zamanlı Bildirimler:** Yorum ve yanıtlarda renk kodlu bildirim sistemi.
- **Sosyal Paylaşım & Tekil Şiir Görünümü:** Şiir linklerini kopyalama ve paylaşılan linkle direkt sadece o şiiri (Tüm Şiirleri Gör butonu ile birlikte) özel sayfada görüntüleme.
- **Optimistic UI:** Yorum silme/düzenleme işlemlerinde anında tepki süresi.

## Kurulum Adımları

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyebilirsiniz.

1. Projeyi bilgisayarınıza indirin ve klasöre girin:
```bash
git clone https://github.com/bilalkaplan/PoemGarden.git
cd PoemGarden
```

2. Backend (Sunucu) bağımlılıklarını kurun ve başlatın:
```bash
cd backend
npm install
npm run dev
```

3. Frontend (Ön Yüz) bağımlılıklarını kurun ve başlatın (yeni bir terminal sekmesinde):
```bash
cd frontend
npm install
npm run dev
```

## Ekran Görüntüleri

![Ana Sayfa Görünümü](./screenshots/home.png)
*Ana Sayfa ve Şiir Listesi*

![Profil ve Şiir Ekleme](./screenshots/profile.png)
*Kullanıcı Profili ve Şiir Ekleme Ekranı*

## Geliştirici
Bilal Kaplan
