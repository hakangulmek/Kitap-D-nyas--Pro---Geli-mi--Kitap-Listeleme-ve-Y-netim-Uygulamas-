import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
  }),
  actions: {
    login(userData) {
      this.user = userData;
      this.token = "fake-jwt-token"; // Gerçek projede API'den al
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", this.token);
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});
export function isAuthenticated() {
  return !!localStorage.getItem("token");
}
