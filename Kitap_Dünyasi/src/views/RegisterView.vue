<script setup>
import { ref, reactive, defineAsyncComponent } from "vue";
import { useRouter } from "vue-router";

const registerSchema = defineAsyncComponent(() =>
  import("@/validation/sign-up")
);
// Form verilerini ve hataları reactive olarak tanımlayalım
const formData = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const errors = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  form: "",
});

const isSubmitting = ref(false);
const termsAccepted = ref(false);
const router = useRouter();

const register = async () => {
  // Hataları temizle
  Object.keys(errors).forEach((key) => {
    errors[key] = "";
  });

  if (!termsAccepted.value) {
    errors.form = "Kullanım şartlarını kabul etmelisiniz";
    return;
  }

  try {
    // Form doğrulama
    await registerSchema.validate(formData, { abortEarly: false });

    // Kayıt işlemi
    isSubmitting.value = true;
    console.log("Kayıt bilgileri:", formData);

    // Kullanıcı bilgilerini localStorage'a kaydet
    localStorage.setItem(
      "registeredUser",
      JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
    );

    // Başarılı bildirim ve yönlendirme
    setTimeout(() => {
      isSubmitting.value = false;
      alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
      router.push("/login");
    }, 1000);
  } catch (error) {
    console.error("Kayıt hatası:", error);

    // Yup doğrulama hataları
    if (error.inner && error.inner.length) {
      error.inner.forEach((err) => {
        if (errors[err.path] !== undefined) {
          errors[err.path] = err.message;
        }
      });
    } else if (error.message) {
      errors.form = error.message;
    } else {
      errors.form = "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.";
    }

    isSubmitting.value = false;
  }
};

// Form submit işlemi için
const handleSubmit = async (e) => {
  e.preventDefault();
  await register();
};
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-illustration">
        <img src="../assets/logo.svg" alt="Register" class="register-image" />
        <div class="rocket-icon">🚀</div>
      </div>

      <div class="register-form">
        <h2>Hesap Oluştur</h2>

        <div v-if="errors.form" class="error-message">
          {{ errors.form }}
        </div>

        <form @submit="handleSubmit">
          <div class="form-group">
            <label for="name">İsim *</label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              placeholder="Adınızı girin"
              required
            />
            <p v-if="errors.name" class="field-error">{{ errors.name }}</p>
          </div>

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

          <div class="form-group">
            <label for="confirmPassword">Şifre Tekrarı *</label>
            <input
              id="confirmPassword"
              v-model="formData.confirmPassword"
              type="password"
              placeholder="Şifrenizi tekrar girin"
              required
            />
            <p v-if="errors.confirmPassword" class="field-error">
              {{ errors.confirmPassword }}
            </p>
          </div>

          <div class="form-options">
            <div class="terms-agreement">
              <input id="terms" type="checkbox" v-model="termsAccepted" />
              <label for="terms">
                <span>Kullanım şartlarını ve</span>
                <a href="#" class="terms-link">gizlilik politikasını</a>
                <span>kabul ediyorum</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            class="register-button"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting">Kayıt Yapılıyor...</span>
            <span v-else>Hesap Oluştur</span>
          </button>
        </form>

        <div class="form-links">
          <div class="login-link">
            Zaten bir hesabınız var mı?
            <router-link to="/login"> Giriş Yap </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  padding: 20px;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}

.register-card {
  display: flex;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 800px;
  overflow: hidden;
}

.register-illustration {
  flex: 1;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 40px;
}

.register-image {
  max-width: 100%;
  height: auto;
}

.rocket-icon {
  position: absolute;
  top: 20%;
  right: 20%;
  font-size: 24px;
}

.register-form {
  flex: 1;
  padding: 40px;
}

.register-form h2 {
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

.terms-agreement {
  display: flex;
  align-items: flex-start;
}

.terms-agreement input {
  margin-right: 8px;
  margin-top: 3px;
}

.terms-agreement label {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.terms-link {
  color: #e73c3c;
  text-decoration: none;
  margin: 0 4px;
}

.register-button {
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

.register-button:hover {
  background-color: #d63030;
}

.register-button:disabled {
  background-color: #f5a5a5;
  cursor: not-allowed;
}

.form-links {
  margin-top: 24px;
  text-align: center;
}

.login-link {
  color: #666;
  font-size: 14px;
}

.login-link a {
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
  .register-card {
    flex-direction: column;
  }

  .register-illustration {
    padding: 20px;
  }

  .register-form {
    padding: 20px;
  }
}
</style>
