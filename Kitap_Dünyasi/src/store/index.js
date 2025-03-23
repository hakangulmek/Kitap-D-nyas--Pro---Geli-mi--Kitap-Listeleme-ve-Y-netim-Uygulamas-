import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

import favorites from "./favorites";
import cart from "./books";

export default createStore({
  modules: {
    favorites,
    cart,
  },
  plugins: [createPersistedState()], // LocalStorage entegrasyonu
});
