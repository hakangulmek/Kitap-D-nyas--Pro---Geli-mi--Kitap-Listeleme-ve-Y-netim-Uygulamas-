<script setup>
import { defineAsyncComponent } from "vue";

// 🚀 Suspense İçin Giriş Formunu Async Olarak Yükle
const LoginForm = defineAsyncComponent({
  loader: () => import("../components/AuthForm.vue"),
  delay: 200, // 200ms gecikme ekleyelim (isteğe bağlı)
  timeout: 5000, // Maksimum 5 saniye bekleme süresi
});
</script>

<template>
  <div class="login-container">
    <Suspense>
      <template #default>
        <LoginForm />
      </template>
      <template #fallback>
        <div class="loading-container">
          <div class="spinner"></div>
          <p>Yükleniyor...</p>
        </div>
      </template>
    </Suspense>
  </div>
</template>

<style scoped>
/* 💫 Spinner Animasyonu */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #e73c3c;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
