# DÖNEM PROJESİ RAPORU
## Proje Adı: PoemGarden (Sosyal Şiir Paylaşım Platformu)
**Hazırlayan:** Bilal Kocakaplan

---

### 1. PROJENİN AMACI VE KAPSAMI
Bu proje kapsamında, MERN Stack (MongoDB, Express.js, React.js, Node.js) teknolojileri kullanılarak tam kapsamlı (full-stack) bir web uygulaması geliştirilmiştir. "PoemGarden", edebiyatseverlerin kendi şiirlerini yayınlayabildikleri, diğer şairlerin eserlerini okuyup yorum yapabildikleri ve interaktif bir şekilde etkileşime geçebildikleri bir sosyal platformdur.

Projede **Rol Tabanlı Erişim (Role-Based Access Control - RBAC)** kullanılmış olup sistemde *Şair (Poet)* ve *Yönetici (Admin)* rolleri bulunmaktadır. Uygulama tamamen **Çoklu Dil (i18n)** destekli olup Türkçe, İngilizce, Sırpça ve Almanca dillerinde çalışabilmektedir.

### 2. KULLANILAN TEKNOLOJİLER
* **Frontend:** React.js, React Router DOM, Axios, i18next (Çoklu dil desteği), CSS3.
* **Backend:** Node.js, Express.js, JWT (JSON Web Token), Bcrypt.js (Şifreleme).
* **Veritabanı:** MongoDB (Atlas Cloud), Mongoose (ODM).
* **Versiyon Kontrol ve Dağıtım:** Git, GitHub, Vercel (Frontend), Render (Backend).

### 3. TEMEL ÖZELLİKLER (FEATURES)
* **Kullanıcı İşlemleri:** Kayıt olma (Register), Giriş yapma (Login), JWT tabanlı kimlik doğrulama, Profil resmi, biyografi güncelleme ve çoklu dil destekli platforma kayıt tarihi (Joined in) gösterimi.
* **Şiir Yönetimi:** Şiir ekleme, dinamik yazı tipi (font) seçme, şiiri düzenleme ve silme. Uzun şiirler için dinamik "Devamını Oku" metin yönetimi.
* **Etkileşim ve Sosyal Ağ:** Şiirlere yorum yapma, yorumlara yanıt (reply) verme, kendi yorumlarını düzenleme ve silme (İyimser/Optimistic UI güncellemeleri ile anında tepki süresi). Okunabilirlik odaklı, renk kodlu anlık bildirim sistemi.
* **Sosyal Paylaşım:** Şiirler için eklenmiş "üç nokta" menüsü ile direkt şiire giden bağlantıyı (URL) panoya kopyalama ve paylaşma özelliği.
* **Admin Yetkileri:** Yöneticilerin sistemdeki herhangi bir kullanıcıyı, şiiri veya yorumu silebilmesi. İlişkisel veri silme (Kullanıcı silindiğinde ona ait tüm şiirlerin ve yorumların otomatik temizlenmesi - Cascading Delete).

---

### 4. UML VE TASARIM DİYAGRAMLARI

Aşağıdaki diyagramlar sistemin mimarisini ve akışını görselleştirmektedir. *(Not: Markdown destekli okuyucularda diyagramlar otomatik render edilir, rapora eklerken ekran görüntüsü olarak alabilirsiniz.)*

#### 4.1. Use-Case Diyagramı
Sistemdeki aktörlerin (Ziyaretçi, Kayıtlı Kullanıcı, Admin) yapabildikleri işlemleri gösterir.

```mermaid
flowchart LR
    subgraph PoemGarden [PoemGarden Uygulaması]
        UC1(Kayıt Ol / Giriş Yap)
        UC2(Şiirleri Oku ve Paylaş)
        UC3(Şiir Yaz / Düzenle / Sil)
        UC4(Yorum Yap / Düzenle / Sil)
        UC5(Kullanıcıları Yönet)
    end

    Ziyaretçi([Ziyaretçi]) --> UC1
    Ziyaretçi --> UC2

    Kullanıcı([Kayıtlı Şair]) --> UC2
    Kullanıcı --> UC3
    Kullanıcı --> UC4

    Admin([Admin]) --> UC2
    Admin --> UC3
    Admin --> UC4
    Admin --> UC5
```

#### 4.2. Activity (Aktivite) Diyagramı
Kullanıcının sisteme yeni bir şiir ekleme sürecindeki mantıksal akışı gösterir.

```mermaid
stateDiagram-v2
    [*] --> Anasayfa
    Anasayfa --> Kontrol: "Şiir Ekle" butonuna tıklar
    
    state Kontrol {
        [*] --> YetkiSorgusu
        YetkiSorgusu --> GirisYapilmis: Token Geçerli
        YetkiSorgusu --> LoginEkraninaYonlendir: Token Yok/Geçersiz
    }
    
    LoginEkraninaYonlendir --> Kontrol: Başarılı Giriş Yap
    
    GirisYapilmis --> FormuDoldur
    FormuDoldur --> VeritabaniKaydi: Kaydet
    VeritabaniKaydi --> ListeGuncelle: Şiir DB'ye Eklendi
    ListeGuncelle --> [*]
```

#### 4.3. ER (Varlık-İlişki) Diyagramı
Mongoose şemalarımızın veritabanındaki ilişkisel mimarisini gösterir.

```mermaid
erDiagram
    USER ||--o{ POEM : "yazarıdır"
    USER ||--o{ COMMENT : "yorum yapar"
    USER ||--o{ REPLY : "yanıtlar"
    POEM ||--o{ COMMENT : "barındırır"
    
    USER {
        ObjectId id PK
        String firstName
        String lastName
        String email
        String nickname
        String password
        String role "poet / admin"
        Date createdAt
    }
    
    POEM {
        ObjectId id PK
        String title
        String content
        String font
        ObjectId author FK
    }
    
    COMMENT {
        ObjectId id PK
        String text
        ObjectId author FK
        Date createdAt
        Boolean edited
        Array replies
    }
```

#### 4.4. Component (Bileşen) Diyagramı
React tarafındaki klasör ve bileşen hiyerarşisini gösterir.

```mermaid
flowchart TD
    App[App.jsx - React Router] --> Navbar[Navbar.jsx]
    App --> MainRoutes{Rotalar}
    
    MainRoutes --> Home[Home.jsx]
    MainRoutes --> Profile[Profile.jsx]
    MainRoutes --> Login[Login.jsx]
    MainRoutes --> Register[Register.jsx]
    
    Home --> PoemForm[PoemForm.jsx]
    Home --> PoemList[Map: Şiir Kartları]
    PoemList --> CommentSection[CommentSection.jsx]
```

---

### 5. SONUÇ VE EKRAN GÖRÜNTÜLERİ

MERN stack kullanılarak modern bir web mimarisi ayağa kaldırılmıştır. Hem sunucu tarafında korumalı RESTful API'ler oluşturulmuş hem de istemci tarafında state'leri iyi yöneten dinamik bir kullanıcı deneyimi (UX) sağlanmıştır. Projenin her sayfasında sosyal paylaşım entegrasyonları, iyimser güncellemeler ve çoklu dil senkronizasyonu mevcuttur.

*(LÜTFEN BURANIN ALTINA PROJENİN ÇALIŞTIĞINI GÖSTEREN EKRAN GÖRÜNTÜLERİNİ YAPIŞTIRIN:)*
1. Ana sayfa (Şiirlerin listelendiği ekran ve üç nokta paylaşım menüsü)
2. Kayıt Ol / Giriş Yap ekranı
3. Profil sayfası (Şiirlerim ve Yorumlarım)
4. Yorum yapma ve Düzenleme kutusu
