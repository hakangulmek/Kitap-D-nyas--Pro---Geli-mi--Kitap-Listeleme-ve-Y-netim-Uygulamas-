import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null,
  }),
  actions: {
    setUser(user) {
      this.user = user;
    },
    setToken(token) {
      this.token = token;
      // Token'ı localStorage'a kaydedelim
      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    },

    // Yeni kayıt olma fonksiyonu
    async register(userData) {
      this.loading = true;
      this.error = null;

      try {
        // Mevcut kullanıcıları localStorage'dan al
        let users = [];
        try {
          const usersData = localStorage.getItem("registeredUser");
          if (usersData) {
            users = JSON.parse(usersData);
            // Array kontrolü yap
            if (!Array.isArray(users)) {
              users = [users]; // Eğer array değilse, array yap
            }
          }
        } catch (e) {
          users = [];
        }

        // E-posta zaten kullanılıyor mu kontrol et
        if (users.some((user) => user.email === userData.email)) {
          throw new Error("Bu e-posta adresi zaten kullanımda!");
        }

        // Yeni kullanıcı oluştur
        const newUser = {
          id: Date.now(), // Basit bir ID oluşturma
          email: userData.email,
          password: userData.password, // Gerçek uygulamada şifre hash'lenmeli!
          name: userData.name || `Kullanıcı ${users.length + 1}`,
        };

        // Kullanıcıyı kaydet
        users.push(newUser);

        // localStorage'a yazma işlemi
        try {
          localStorage.setItem("registeredUser", JSON.stringify(users));
        } catch (e) {
          throw new Error("Kullanıcı kaydedilemedi, lütfen tekrar deneyin");
        }

        // Kullanıcı bilgilerini döndür (şifre olmadan)
        const { password, ...userWithoutPassword } = newUser;

        const response = {
          user: userWithoutPassword,
          token: `token-${newUser.id}-${Date.now()}`, // Basit bir token oluşturma
        };

        // Kullanıcı ve token'ı kaydet
        this.setUser(response.user);
        this.setToken(response.token);

        return response;
      } catch (error) {
        this.error = error.message || "Kayıt işlemi sırasında bir hata oluştu";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async login(credentials) {
      this.loading = true;
      this.error = null;

      try {
        // localStorage'dan kullanıcıları al
        let users = [];
        try {
          const usersData = localStorage.getItem("registeredUser");

          if (usersData) {
            const parsedData = JSON.parse(usersData);

            // Array kontrolü yap
            if (Array.isArray(parsedData)) {
              users = parsedData;
            } else {
              users = [parsedData]; // Tek obje varsa array'e çevir
            }
          }
        } catch (e) {
          users = [];
        }

        // Kullanıcıyı bul
        const user = users.find(
          (u) =>
            u.email === credentials.email && u.password === credentials.password
        );

        if (user) {
          // Kullanıcı bulundu, şifre hariç bilgileri döndür
          const { password, ...userWithoutPassword } = user;

          const response = {
            user: userWithoutPassword,
            token: `token-${user.id}-${Date.now()}`,
          };

          // Kullanıcı ve token'ı kaydet
          this.setUser(response.user);
          this.setToken(response.token);

          // Beni hatırla seçili ise localStorage'a kaydet
          if (credentials.remember) {
            localStorage.setItem("remember_email", credentials.email);
          } else {
            localStorage.removeItem("remember_email");
          }

          return response;
        } else {
          throw new Error("E-posta veya şifre hatalı!");
        }
      } catch (error) {
        this.error = error.message || "Giriş işlemi sırasında bir hata oluştu";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.setToken(null);
      // Diğer temizleme işlemleri
    },

    // Sayfa yüklendiğinde token kontrolü
    initAuth() {
      const token = localStorage.getItem("token");
      if (token) {
        this.setToken(token);

        // Basit bir token doğrulama simülasyonu
        const tokenParts = token.split("-");
        if (tokenParts.length > 1) {
          const userId = parseInt(tokenParts[1]);

          try {
            const usersData = localStorage.getItem("registeredUser");
            if (usersData) {
              const parsedData = JSON.parse(usersData);
              const users = Array.isArray(parsedData)
                ? parsedData
                : [parsedData];
              const user = users.find((u) => u.id === userId);

              if (user) {
                const { password, ...userWithoutPassword } = user;
                this.setUser(userWithoutPassword);
              }
            }
          } catch (e) {}
        }
      }

      // Beni hatırla e-postası
      return {
        rememberedEmail: localStorage.getItem("remember_email") || "",
      };
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
    isLoading: (state) => state.loading,
  },
});

export default useAuthStore;
