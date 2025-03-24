<template>
  <div class="profile-container">
    <div class="profile-card">
      <div class="avatar-container">
        <img :src="authStore.user?.avatar" alt="Profil Resmi" class="avatar" />
        <div class="avatar-edit-icon" @click="editProfile">
          <i class="fas fa-edit"></i>
        </div>
      </div>

      <h2>Profil Sayfası</h2>

      <p class="user-email">
        Kullanıcı: <span>{{ authStore.user?.email }}</span>
      </p>

      <div class="button-group">
        <button @click="favorites" class="favorites-btn">
          <i class="fas fa-heart"></i>
          Favoriler
        </button>

        <button @click="editBooks" class="books-btn">
          <i class="fas fa-book"></i>
          Kitaplarım
        </button>

        <button @click="logout" class="logout-btn">
          <i class="fas fa-sign-out-alt"></i>
          Çıkış Yap
        </button>
      </div>

      <div class="last-login">
        Son Giriş: {{ formatLastLogin(authStore.user?.lastLogin) }}
      </div>
    </div>
  </div>
</template>

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

// const editProfile = () => {
//   router.push("/profile-edit");
// };

const editBooks = () => {
  // Eğer kitap ID'si gerekiyorsa, ilgili ID'yi buraya ekleyebilirsiniz
  router.push("/book/edit");
};

const formatLastLogin = (timestamp) => {
  if (!timestamp) return "Bilinmiyor";
  return new Date(timestamp).toLocaleString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<style scoped lang="scss">
.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f6f8f9 0%, #e5ebee 100%);
  padding: 20px;
}

.profile-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 40px;
  text-align: center;
  width: 380px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }

  .avatar-container {
    position: relative;
    display: flex;
    justify-content: center;
    margin-bottom: 25px;

    .avatar {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid #4a90e2;
    }

    .avatar-edit-icon {
      position: absolute;
      bottom: 0;
      right: calc(50% - 75px);
      background-color: #4a90e2;
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #357abd;
      }
    }
  }

  h2 {
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
  }

  .user-email {
    font-size: 16px;
    color: #666;
    margin-bottom: 25px;

    span {
      font-weight: bold;
      color: #333;
    }
  }

  .button-group {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;

    button {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 15px;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 14px;
      gap: 8px;

      i {
        font-size: 20px;
        margin-bottom: 5px;
      }

      &.favorites-btn {
        background-color: #4a90e2;
        color: white;

        &:hover {
          background-color: #357abd;
        }
      }

      &.books-btn {
        background-color: #2ecc71;
        color: white;

        &:hover {
          background-color: #27ae60;
        }
      }

      &.logout-btn {
        background-color: #e74c3c;
        color: white;

        &:hover {
          background-color: #c0392b;
        }
      }
    }
  }

  .last-login {
    margin-top: 25px;
    border-top: 1px solid #eee;
    padding-top: 15px;
    font-size: 14px;
    color: #888;
  }
}
</style>
