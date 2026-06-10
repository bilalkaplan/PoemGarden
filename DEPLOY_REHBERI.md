# PoemGarden - Canlıya Alma (Deployment) Rehberi

Dönem projenizi başarıyla tamamladık! Şimdi projeyi internete açmak (deploy etmek) için aşağıdaki adımları sırasıyla uygulayabilirsiniz. Bu rehber MERN stack projeleri için standart, ücretsiz ve en kolay yolları içerir.

## 1. Veritabanını Canlıya Almak (MongoDB Atlas)
Harika bir haber: Siz projeye başlarken zaten veritabanınızı **MongoDB Atlas** üzerinde kurmuştunuz! Bu yüzden sıfırdan bir veritabanı oluşturmanıza gerek yok. 

**Tek yapmanız gereken:**
1. Bilgisayarınızdaki `backend/.env` dosyasını açın.
2. İçerisindeki `MONGO_URI=` kısmının karşısında yazan `mongodb+srv://...` ile başlayan uzun bağlantı linkini kopyalayın.
*(Not: Eğer bu dosya silindiyse MongoDB Atlas sitesine girip "Connect" diyerek linkinizi tekrar kopyalayabilirsiniz.)*

## 2. Backend'i Canlıya Almak (Render)
Node.js/Express arka planınızı ücretsiz ve hızlıca Render.com üzerinden yayınlayabilirsiniz.
1. [Render.com](https://render.com)'a GitHub hesabınızla giriş yapın.
2. "New Web Service" seçeneğine tıklayın.
3. GitHub deponuzu (repository) bağlayın ve proje dizini olarak `backend` klasörünüzü seçin (veya root directoy `backend` yazın).
4. Build komutu olarak `npm install`, Start komutu olarak `node server.js` yazın.
5. **En Önemli Adım:** `Environment Variables` (Ortam Değişkenleri) kısmına şunları ekleyin:
   - `MONGO_URI` = (MongoDB Atlas'tan aldığınız bağlantı linki)
   - `JWT_SECRET` = (Güvenlik için rastgele bir kelime, örn: `supergizlisifre123`)
6. Deploy tuşuna basın. Render size bir URL verecektir (Örn: `https://poemgarden-api.onrender.com`). Bu sizin canlı Backend adresiniz!

## 3. Frontend Bağlantılarını Güncellemek (Kritik Adım!)
Şu an Frontend kodlarınızda (React) backend adresi olarak `http://127.0.0.1:5000` yazıyor. Canlıya almadan önce Frontend kodlarınızdaki tüm bu `127.0.0.1:5000` adreslerini, Render'dan aldığınız yeni API URL'si ile **değiştirmeniz** gerekmektedir. 
*(Örneğin VS Code'da arama simgesine tıklayıp `http://127.0.0.1:5000` yazın ve hepsini `https://poemgarden-api.onrender.com` ile değiştirin.)*

## 4. Frontend'i Canlıya Almak (Vercel)
React tarafını internete açmak için Vercel veya Netlify mükemmel bir seçenektir. Vercel kullanacağız.
1. [Vercel.com](https://vercel.com)'a GitHub ile giriş yapın.
2. "Add New Project" deyip GitHub deponuzu seçin.
3. "Root Directory" ayarından `frontend` klasörünü seçin.
4. "Deploy" butonuna basın. Vercel uygulamanızı anında derleyecek ve size canlı bir web sitesi linki verecektir.

**Tebrikler!** Artık siteniz tüm dünyanın erişimine açık. Linki ödev dosyanıza/raporunuza ekleyebilirsiniz.
