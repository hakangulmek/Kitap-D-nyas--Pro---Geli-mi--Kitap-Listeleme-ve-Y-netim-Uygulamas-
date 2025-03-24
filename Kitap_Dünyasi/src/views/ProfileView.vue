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
  <div class="profile-container">
    <div class="profile-card">
      <h2>Profil Sayfası</h2>
      <p class="user-email">
        Kullanıcı: <span>{{ authStore.user?.email }}</span>
      </p>
      <div class="button-group">
        <button @click="logout" class="logout-btn">Çıkış Yap</button>
        <button @click="favorites" class="favorites-btn">
          Favorileri Göster
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f4f4;
}

.profile-card {
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 350px;

  h2 {
    font-size: 24px;
    color: #333;
    margin-bottom: 15px;
  }

  .user-email {
    font-size: 16px;
    color: #555;
    margin-bottom: 20px;

    span {
      font-weight: bold;
      color: #222;
    }
  }

  .button-group {
    display: flex;
    justify-content: space-between;
    gap: 10px;

    button {
      flex: 1;
      padding: 10px;
      font-size: 16px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.3s ease-in-out;
    }

    .logout-btn {
      background: #ff4d4d;
      color: white;

      &:hover {
        background: #cc0000;
      }
    }

    .favorites-btn {
      background: #007bff;
      color: white;

      &:hover {
        background: #0056b3;
      }
    }
  }
}
</style>
