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
    async login(credentials) {
      this.loading = true;
      this.error = null;

      try {
        // Burada normalde bir API çağrısı yapılır
        // Örnek bir API çağrısı simülasyonu:
        console.log("Giriş bilgileri:", credentials);

        // API çağrısı simülasyonu (gerçek uygulamada fetch/axios kullanılmalı)
        const response = await new Promise((resolve) => {
          setTimeout(() => {
            // Basit bir e-posta kontrolü yapalım
            if (
              credentials.email === "test@example.com" &&
              credentials.password === "123456"
            ) {
              resolve({
                user: {
                  id: 1,
                  email: credentials.email,
                  name: "Test Kullanıcısı",
                },
                token: "sample-jwt-token-12345",
              });
            } else {
              throw new Error("E-posta veya şifre hatalı!");
            }
          }, 1000); // 1 saniye gecikme
        });

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
        // Gerçek uygulamada token ile kullanıcı bilgisini almak için API çağrısı yapılmalı
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
