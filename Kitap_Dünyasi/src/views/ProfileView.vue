<script setup>
import { useAuthStore } from "../store/Auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<template>
  <div>
    <h2>Profil Sayfası</h2>
    <p>Kullanıcı: {{ authStore.user?.email }}</p>
    <button @click="logout">Çıkış Yap</button>
  </div>
</template>
