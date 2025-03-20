<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const name = ref("");
const router = useRouter();

const register = () => {
  localStorage.setItem(
    "registeredUser",
    JSON.stringify({ email: email.value, name: name.value })
  );
  alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
  router.push("/login");
};
</script>

<template>
  <div>
    <h2>Kayıt Ol</h2>
    <input v-model="name" type="text" placeholder="İsim" />
    <input v-model="email" type="email" placeholder="E-posta" />
    <input v-model="password" type="password" placeholder="Şifre" />
    <button @click="register">Kayıt Ol</button>
  </div>
</template>
