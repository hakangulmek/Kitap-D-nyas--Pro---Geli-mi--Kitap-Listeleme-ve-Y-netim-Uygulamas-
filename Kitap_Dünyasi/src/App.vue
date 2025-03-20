<script setup>
import NavBar from "./components/Navbar.vue";
</script>

<template>
  <div>
    <NavBar />
    <!-- Sayfanın geri kalanı -->
    <main>
      <router-view />
    </main>
  </div>
</template>
