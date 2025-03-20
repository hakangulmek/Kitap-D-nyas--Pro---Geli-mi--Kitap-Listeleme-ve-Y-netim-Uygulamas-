import { createApp } from "vue";
import { createPinia } from "pinia"; // Pinia'yı içe aktar
import App from "./App.vue";
import router from "./router"; // Eğer Vue Router kullanıyorsan

const app = createApp(App);

const pinia = createPinia();
app.use(pinia); // Pinia'yı Vue uygulamasına ekle
app.use(router); // Vue Router varsa ekle

app.mount("#app");
