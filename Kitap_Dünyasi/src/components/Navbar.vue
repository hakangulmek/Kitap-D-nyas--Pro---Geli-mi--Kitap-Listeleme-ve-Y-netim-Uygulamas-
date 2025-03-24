<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import useAuthStore from "@/utils/index";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const authStore = useAuthStore();
const router = useRouter();
const isMenuOpen = ref(false);
const searchQuery = ref("");

// Favori sayısını hesaplayan computed property
const favoriteCount = computed(() => {
  return store.getters["favorites/favoriteCount"];
});

// Sepet sayacı
const cartCount = computed(() => {
  return store.getters["books/cartItemCount"];
});

const favorite = () => {
  router.push("/favorites");
};

const cart = () => {
  router.push("/basket");
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const handleSearch = (e) => {
  e.preventDefault();
  if (searchQuery.value.trim()) {
    router.push({
      path: "/search",
      query: { q: searchQuery.value },
    });
    searchQuery.value = "";
  }
};

const closeMenu = () => {
  if (isMenuOpen.value) {
    isMenuOpen.value = false;
  }
};

// Ekran boyutunu dinle
const checkScreenSize = () => {
  if (window.innerWidth > 768 && isMenuOpen.value) {
    isMenuOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener("resize", checkScreenSize);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkScreenSize);
});
</script>

<template>
  <header class="navbar">
    <div class="navbar-container">
      <div class="top-section">
        <div class="brand-section">
          <router-link to="/" class="logo" @click="closeMenu">
            KitapDünyası
          </router-link>
          <button
            class="menu-toggle"
            @click="toggleMenu"
            aria-label="Menüyü aç/kapat"
          >
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </button>
        </div>

        <form class="search-form" @submit="handleSearch">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Kitap, yazar veya yayınevi ara..."
            class="search-input"
          />
          <button type="submit" class="search-button">Ara</button>
        </form>

        <div class="auth-buttons" v-if="!authStore.user">
          <router-link to="/login" class="login-button">Giriş</router-link>
        </div>
        <div class="user-actions" v-else>
          <router-link to="/profile" class="profile-link">
            <div class="user-avatar">
              <span class="user-initial">{{
                authStore.user.name ? authStore.user.name[0].toUpperCase() : "K"
              }}</span>
            </div>
          </router-link>
          <button class="action-button favorite-button" @click="favorite">
            <i class="fas fa-heart"></i>
            <span v-if="favoriteCount > 0" class="count-badge">{{
              favoriteCount
            }}</span>
          </button>
          <button class="action-button cart-button" @click="cart">
            <i class="fas fa-shopping-cart"></i>
            <span v-if="cartCount > 0" class="count-badge">{{
              cartCount
            }}</span>
          </button>
        </div>
      </div>

      <nav class="main-nav" :class="{ active: isMenuOpen }">
        <router-link to="/" @click="closeMenu" class="nav-item"
          >Ana Sayfa</router-link
        >
        <router-link to="/kategoriler" @click="closeMenu" class="nav-item"
          >Kategoriler</router-link
        >
        <router-link to="/yeni-cikanlar" @click="closeMenu" class="nav-item"
          >Yeni Çıkanlar</router-link
        >
        <router-link to="/en-cok-satanlar" @click="closeMenu" class="nav-item"
          >En Çok Satanlar</router-link
        >
        <router-link
          to="/login"
          @click="closeMenu"
          class="nav-item mobile-only"
          v-if="!authStore.user"
          >Giriş</router-link
        >
        <router-link
          to="/register"
          @click="closeMenu"
          class="nav-item mobile-only"
          v-if="!authStore.user"
          >Kayıt Ol</router-link
        >
        <router-link
          to="/forgot-password"
          @click="closeMenu"
          class="nav-item mobile-only"
          v-if="!authStore.user"
          >Şifremi Unuttum</router-link
        >
        <router-link
          to="/profile"
          @click="closeMenu"
          class="nav-item mobile-only"
          v-if="authStore.user"
          >Hesabım</router-link
        >
      </nav>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  background-color: #243886;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: sticky;
  z-index: 1000;
  width: 100%;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.top-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  flex-wrap: wrap;
}

.brand-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.logo {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: 0.5px;
}

.menu-toggle {
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.bar {
  display: block;
  width: 25px;
  height: 3px;
  margin: 5px 0;
  background-color: white;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.search-form {
  display: flex;
  flex: 1;
  max-width: 500px;
  margin: 0 20px;
}

.search-input {
  flex: 1;
  padding: 10px 15px;
  border: none;
  border-radius: 20px 0 0 20px;
  font-size: 0.9rem;
  outline: none;
}

.search-button {
  background-color: #ffc107;
  color: #243886;
  border: none;
  padding: 0 20px;
  border-radius: 0 20px 20px 0;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-button:hover {
  background-color: #ffd54f;
}

.auth-buttons {
  display: flex;
  gap: 10px;
}

.login-button,
.register-button {
  padding: 8px 15px;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.2s;
}

.login-button {
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.login-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.register-button {
  background-color: #ffc107;
  color: #243886;
}

.register-button:hover {
  background-color: #ffd54f;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.profile-link {
  display: flex;
  align-items: center;
  color: white;
  text-decoration: none;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  transition: background-color 0.2s;
}

.profile-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-avatar {
  width: 32px;
  height: 32px;
  background-color: #7e57c2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.user-initial {
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
}

.profile-text {
  font-weight: 500;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.action-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.favorite-button i {
  color: #ff4081;
  font-size: 1.2rem;
}

.cart-button i {
  color: #ffc107;
  font-size: 1.2rem;
}

.count-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ff4081;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.7rem;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.cart-button .count-badge {
  background-color: #ffc107;
  color: #243886;
}

.main-nav {
  display: flex;
  padding: 10px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-item {
  color: white;
  text-decoration: none;
  padding: 8px 15px;
  position: relative;
  transition: color 0.2s;
}

.nav-item:hover {
  color: #ffc107;
}

.nav-item::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: #ffc107;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-item:hover::after {
  width: 80%;
}

.mobile-only {
  display: none;
}

/* Responsive Design */
@media (max-width: 768px) {
  .brand-section {
    justify-content: space-between;
    padding: 0;
  }

  .menu-toggle {
    display: block;
  }

  .top-section {
    flex-direction: column;
    align-items: stretch;
  }

  .search-form {
    margin: 15px 0;
    max-width: 100%;
    order: 1;
  }

  .auth-buttons,
  .user-actions {
    display: none;
  }

  .main-nav {
    display: none;
    flex-direction: column;
    padding: 0;
  }

  .main-nav.active {
    display: flex;
  }

  .nav-item {
    padding: 12px 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .nav-item::after {
    display: none;
  }

  .mobile-only {
    display: block;
  }
}

@media (min-width: 769px) {
  .brand-section {
    width: auto;
  }
}
</style>
