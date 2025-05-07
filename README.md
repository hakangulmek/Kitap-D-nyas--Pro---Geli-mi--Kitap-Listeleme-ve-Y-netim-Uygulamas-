# Kitap Dünyası Pro - Gelişmiş Kitap Listeleme ve Yönetim Uygulaması

Bu proje, kullanıcıların kitaplarını listeleyebileceği, favorilere ekleyebileceği, kitap bilgilerini düzenleyebileceği ve kullanıcı hesaplarını yönetebileceği bir uygulamadır. Proje, modern bir kullanıcı arayüzü ve Vue.js ekosistemindeki en iyi uygulamalar kullanılarak geliştirilmiştir.

---

## 1. Proje Kurulum Adımları

### Gerekli Bağımlılıkların Yüklenmesi
Proje dosyalarını klonladıktan sonra, bağımlılıkları yüklemek için aşağıdaki komutu çalıştırın:


npm install
npm run dev ile projeyi başlat

# Kullanılan Teknolojiler ve Kütüphaneler
Ana Teknolojiler
Vue.js 3: Kullanıcı arayüzü geliştirme.
Vuex: Durum yönetimi.
Vue Router: Sayfa yönlendirme.
SCSS: Modern ve esnek CSS yazımı.
Yup: Form doğrulama.
Ek Kütüphaneler
Pinia: Alternatif durum yönetimi (bazı modüllerde kullanılmıştır).
Axios: HTTP istekleri için.
Vuex Persisted State: Vuex durumunu localStorage'da saklama.
Exchange Rate API: Döviz kurları için.
Projeyi Geliştirirken Karşılaşılan Zorluklar ve Çözüm Yöntemleri
Kullanıcı Oturumu Yönetimi
Kullanıcı oturumlarının güvenli bir şekilde yönetilmesi ve localStorage ile senkronize edilmesi gerekti.
Mimari Kararların Açıklamaları
Vuex Kullanımı
Proje, durum yönetimi için Vuex kullanmaktadır. Vuex, modüler bir yapıda yapılandırılmıştır ve her bir modül belirli bir işlevi yerine getirmektedir:

user.js: Kullanıcı oturum yönetimi.
books.js: Kitap listesi ve sepet yönetimi.
booksEdit.js: Kitap düzenleme işlemleri.
Vue Router
Vue Router, çok sayfalı bir uygulama yapısını desteklemek için kullanılmıştır. Örneğin:

/register: Kullanıcı kayıt sayfası.
/login: Kullanıcı giriş sayfası.
/profile: Kullanıcı profili.
SCSS ile Tasarım
SCSS kullanılarak modern ve esnek bir tasarım oluşturulmuştur. Her bileşen için scoped CSS kullanılmıştır.

Form Doğrulama
Form doğrulama işlemleri için Yup kütüphanesi kullanılmıştır. Bu, form doğrulama kurallarını merkezi bir yerde tanımlamayı ve yeniden kullanılabilir hale getirmeyi sağlamıştır.
