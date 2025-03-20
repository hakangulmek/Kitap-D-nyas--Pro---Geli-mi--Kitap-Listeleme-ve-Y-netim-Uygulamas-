<script setup>
import { ref, reactive, onMounted, defineAsyncComponent } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/Auth";
import loginSchema from "@/validation/login";
// Form verilerini ve hataları reactive olarak tanımlayalım
const formData = reactive({
  email: "",
  password: "",
});

const errors = reactive({
  email: "",
  password: "",
  form: "",
});

const rememberMe = ref(false);
const isSubmitting = ref(false);
const router = useRouter();
const authStore = useAuthStore();

// Sayfa yüklendiğinde "Beni hatırla" bilgisini kontrol et
onMounted(() => {
  const { rememberedEmail } = authStore.initAuth();
  if (rememberedEmail) {
    formData.email = rememberedEmail;
    rememberMe.value = true;
  }
});

const login = async () => {
  // Önce hataları temizleyelim
  errors.email = "";
  errors.password = "";
  errors.form = "";

  try {
    // Form doğrulama
    await loginSchema.validate(formData, { abortEarly: false });

    // Giriş işlemi başlat
    isSubmitting.value = true;

    const result = await authStore.login({
      email: formData.email,
      password: formData.password,
      remember: rememberMe.value,
    });

    console.log("Giriş başarılı:", result);

    // Başarılı giriş
    router.push("/");
  } catch (error) {
    console.error("Giriş hatası:", error);

    // Yup doğrulama hataları
    if (error.inner && error.inner.length) {
      error.inner.forEach((err) => {
        if (errors[err.path] !== undefined) {
          errors[err.path] = err.message;
        }
      });
    }
    // Store/API hataları
    else if (error.message) {
      errors.form = error.message;
    } else {
      errors.form = "Giriş yapılamadı. Lütfen tekrar deneyin.";
    }
  } finally {
    isSubmitting.value = false;
  }
};

// Form submit işlemi için
const handleSubmit = async (e) => {
  e.preventDefault(); // Form gönderimini engelle
  await login();
};
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-illustration">
        <img src="../assets/logo.svg" alt="Login" class="login-image" />
        <div class="rocket-icon">🚀</div>
      </div>

      <div class="login-form">
        <h2>Giriş Yap</h2>

        <div v-if="errors.form" class="error-message">
          {{ errors.form }}
        </div>

        <form @submit="handleSubmit">
          <div class="form-group">
            <label for="email">E-posta *</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="E-posta adresinizi girin"
              required
            />
            <p v-if="errors.email" class="field-error">{{ errors.email }}</p>
          </div>

          <div class="form-group">
            <label for="password">Şifre *</label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              placeholder="Şifrenizi girin"
              required
            />
            <p v-if="errors.password" class="field-error">
              {{ errors.password }}
            </p>
          </div>

          <div class="form-options">
            <div class="remember-me">
              <input id="remember" type="checkbox" v-model="rememberMe" />
              <label for="remember">Beni hatırla</label>
            </div>
          </div>

          <button type="submit" class="login-button" :disabled="isSubmitting">
            <span v-if="isSubmitting">Giriş Yapılıyor...</span>
            <span v-else>Giriş Yapın</span>
          </button>
        </form>

        <div class="form-links">
          <router-link to="/forgot-password" class="forgot-password">
            Parolanızı mı unuttunuz?
          </router-link>

          <div class="register-link">
            Hesabınız yok mu?
            <router-link to="/register"> Kayıt Ol </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: #f5f5f5;
}

.login-card {
  display: flex;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 800px;
  overflow: hidden;
}

.login-illustration {
  flex: 1;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 40px;
}

.login-image {
  max-width: 100%;
  height: auto;
}

.rocket-icon {
  position: absolute;
  top: 20%;
  right: 20%;
  font-size: 24px;
}

.login-form {
  flex: 1;
  padding: 40px;
}

.login-form h2 {
  font-size: 24px;
  margin-bottom: 24px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #e73c3c;
}

.field-error {
  color: #e73c3c;
  font-size: 12px;
  margin-top: 4px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.remember-me {
  display: flex;
  align-items: center;
}

.remember-me input {
  margin-right: 8px;
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: #e73c3c;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #d63030;
}

.login-button:disabled {
  background-color: #f5a5a5;
  cursor: not-allowed;
}

.form-links {
  margin-top: 24px;
  text-align: center;
}

.forgot-password {
  display: block;
  color: #e73c3c;
  text-decoration: none;
  margin-bottom: 12px;
}

.register-link {
  color: #666;
  font-size: 14px;
}

.register-link a {
  color: #e73c3c;
  text-decoration: none;
  font-weight: 500;
}

.error-message {
  background-color: rgba(231, 60, 60, 0.1);
  border-left: 3px solid #e73c3c;
  padding: 12px;
  margin-bottom: 20px;
  color: #e73c3c;
  font-size: 14px;
}

@media (max-width: 768px) {
  .login-card {
    flex-direction: column;
  }

  .login-illustration {
    padding: 20px;
  }

  .login-form {
    padding: 20px;
  }
}
</style>
