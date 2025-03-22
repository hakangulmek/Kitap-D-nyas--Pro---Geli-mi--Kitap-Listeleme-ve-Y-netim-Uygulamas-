<script setup>
import { useAuthStore } from "../utils";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push("/login");
};
const favorites = () => {
  router.push("/favorites");
};
</script>

<template>
  <div>
    <h2>Profil Sayfası</h2>
    <p>Kullanıcı: {{ authStore.user?.email }}</p>
    <button @click="logout">Çıkış Yap</button>
    <button @click="favorites">Favorileri Göster</button>
  </div>
</template>
