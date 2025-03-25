import { createRouter, createWebHistory } from "vue-router";
import { isAuthenticated } from "@/utils/auth";

// Sayfa bileşenlerini lazy-load yaparak import etme
const HomeView = () =>
  import(/* webpackChunkName: "home" */ "../views/HomeView.vue");
const LoginView = () =>
  import(/* webpackChunkName: "auth" */ "../views/LoginView.vue");
const RegisterView = () =>
  import(/* webpackChunkName: "auth" */ "../views/RegisterView.vue");
const ForgetPassword = () =>
  import(/* webpackChunkName: "auth" */ "../views/ForgetPassword.vue");
const ProfileView = () =>
  import(/* webpackChunkName: "profile" */ "../views/ProfileView.vue");
const Favorites = () =>
  import(/* webpackChunkName: "profile" */ "../views/favoriteView.vue");
const BasketBooks = () =>
  import(/* webpackChunkName: "profile" */ "../views/BasketBooks.vue");
const BookDetail = () =>
  import(/* webpackChunkName: "book" */ "../views/BookDetail.vue");
const BooksEdit = () =>
  import(/* webpackChunkName: "book/edit" */ "../views/Wizard.vue");
const routes = [
  { path: "/", component: HomeView },
  { path: "/login", component: LoginView },
  { path: "/register", component: RegisterView },
  { path: "/forgot-password", component: ForgetPassword },
  { path: "/profile", component: ProfileView, meta: { requiresAuth: true } },
  { path: "/favorites", component: Favorites },
  { path: "/basket", component: BasketBooks },
  { path: "/book/:id", component: BookDetail },
  {
    path: "/book/edit",
    component: BooksEdit,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Yetkilendirme kontrolünü fonksiyon haline getirerek kod tekrarını azaltalım
function checkAuth(to, from, next) {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return next("/login"); // Giriş yapılmamışsa login sayfasına yönlendir
  }
  next();
}

// Global Navigation Guard
router.beforeEach(checkAuth);

export default router;
