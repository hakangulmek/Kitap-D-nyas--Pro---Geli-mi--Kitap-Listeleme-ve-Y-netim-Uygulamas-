<script setup>
import { ref } from "vue";

const email = ref("");

const resetPassword = () => {
  alert(`E-posta gönderildi: ${email.value}`);
};
</script>

<template>
  <div>
    <h2>Şifremi Unuttum</h2>
    <input v-model="email" type="email" placeholder="E-posta" />
    <button @click="resetPassword">Şifreyi Sıfırla</button>
  </div>
</template>
