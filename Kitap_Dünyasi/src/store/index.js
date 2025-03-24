import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

import favorites from "./favorites";
import cart from "./books";
import comment from "./comment";
export default createStore({
  modules: {
    favorites,
    cart,
    comment,
  },
  plugins: [createPersistedState()], // LocalStorage entegrasyonu
});
