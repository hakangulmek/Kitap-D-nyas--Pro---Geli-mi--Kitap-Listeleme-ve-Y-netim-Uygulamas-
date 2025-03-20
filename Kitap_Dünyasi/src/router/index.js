import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import ForgotPassword from "../views/ForgetPassword.vue";
import ProfileView from "../views/ProfileView.vue";
import { isAuthenticated } from "@/utils/auth";

const routes = [
  { path: "/", component: HomeView },
  { path: "/login", component: LoginView },
  { path: "/register", component: RegisterView },
  { path: "/forgot-password", component: ForgotPassword },
  {
    path: "/profile",
    component: ProfileView,
    meta: { requiresAuth: true }, // Yetkilendirme kontrolü
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global Navigation Guard (Yetkilendirme kontrolü)
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next("/login"); // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  } else {
    next();
  }
});

export default router;
