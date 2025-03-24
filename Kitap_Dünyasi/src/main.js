import { createApp } from "vue";
import { createPinia } from "pinia"; // Pinia'yı içe aktar
import App from "./App.vue";
import router from "./router"; // Eğer Vue Router kullanıyorsan
import store from "./store"; // Eğer Vuex kullanıyorsan

const app = createApp(App);
store.dispatch("cart/initializeBooks");

const pinia = createPinia();
app.use(pinia); // Pinia'yı Vue uygulamasına ekle
app.use(router); // Vue Router varsa ekle
app.use(store); // Vuex varsa ekle

app.mount("#app");
