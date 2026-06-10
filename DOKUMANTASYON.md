# Dönem Projesi UML ve Tasarım Dokümantasyonu

Bu belge, proje kapsamında geliştirilen mimarinin UML diyagramlarını içermektedir.

## 1. Use-Case Diyagramı
Sisteme giriş yapan bir şairin (Poet) veya yöneticinin (Admin) gerçekleştirebileceği temel işlemleri gösterir.

```mermaid
usecaseDiagram
    actor "Ziyaretçi" as Visitor
    actor "Şair (Kullanıcı)" as User
    actor "Yönetici" as Admin

    Visitor --> (Şiirleri Görüntüle)
    Visitor --> (Kayıt Ol)
    Visitor --> (Giriş Yap)

    User --> (Şiir Ekle)
    User --> (Kendi Şiirini Düzenle)
    User --> (Kendi Şiirini Sil)
    User --> (Yorum Yap)
    User --> (Yanıtlara Cevap Ver)
    User --> (Şiirleri Görüntüle)

    Admin --> (Tüm Şiirleri Sil)
    Admin --> (Kullanıcıları Yönet)
```
*(Not: Mermaid Use-Case tam desteklenmediği için alternatif bir Use-Case grafiği aşağıdadır)*

```mermaid
graph LR
    subgraph PoemGarden
        A[Şiir Okuma]
        B[Şiir Ekleme]
        C[Yorum Yapma]
        D[Şiir Düzenleme/Silme]
    end
    Z[Ziyaretçi] --> A
    K[Kayıtlı Şair] --> A
    K --> B
    K --> C
    K --> D
```

## 2. Activity Diyagramı (Şiir Ekleme Süreci)
Bir kullanıcının sisteme girip yeni bir şiir ekleme sürecinin akış diyagramı.

```mermaid
stateDiagram-v2
    [*] --> Anasayfa
    Anasayfa --> Giris_Kontrolu
    Giris_Kontrolu --> Formu_Doldur: Giriş yapılmış
    Giris_Kontrolu --> Giris_Sayfasi: Giriş yapılmamış
    Giris_Sayfasi --> Anasayfa: Başarılı Giriş
    Formu_Doldur --> Gonder: Başlık ve İçerik girilir
    Gonder --> Validasyon
    Validasyon --> Formu_Doldur: Hata (Eksik alan)
    Validasyon --> Veritabani_Kayit: Başarılı
    Veritabani_Kayit --> Basari_Mesaji
    Basari_Mesaji --> Anasayfa
```

## 3. ER Diyagramı (Varlık-İlişki)
Veritabanındaki ana koleksiyonların (User, Poem, Comment) birbirleriyle olan ilişkileri.

```mermaid
erDiagram
    USER ||--o{ POEM : "yazar"
    USER ||--o{ COMMENT : "yapar"
    POEM ||--o{ COMMENT : "içerir"
    
    USER {
        ObjectId _id PK
        string firstName
        string lastName
        string email
        string nickname
        string password
        string role
    }
    
    POEM {
        ObjectId _id PK
        string title
        string content
        string font
        ObjectId author FK
        date createdAt
    }
    
    COMMENT {
        ObjectId _id PK
        string text
        ObjectId author FK
        ObjectId poem FK
        array replies
        date createdAt
    }
```

## 4. Component Diyagramı (React Bileşenleri)
Uygulamanın Frontend tarafındaki hiyerarşik bileşen ağacı.

```mermaid
graph TD
    App --> Navbar
    App --> Router
    App --> Footer
    Router --> Home
    Router --> Login
    Router --> Register
    Router --> Profile
    
    Home --> PoemForm
    Home --> PoemCard
    Home --> Toast
    
    PoemCard --> CommentSection
    Navbar --> Notifications
```
