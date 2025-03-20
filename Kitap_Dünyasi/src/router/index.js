import { createRouter, createWebHistory } from "vue-router";
import { isAuthenticated } from "@/utils/auth";

const routes = [
  { path: "/", component: () => import("../views/HomeView.vue") }, // Lazy Load
  { path: "/login", component: () => import("../views/LoginView.vue") },
  { path: "/register", component: () => import("../views/RegisterView.vue") },
  {
    path: "/forgot-password",
    component: () => import("../views/ForgetPassword.vue"),
  },
  {
    path: "/profile",
    component: () => import("../views/ProfileView.vue"),
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
