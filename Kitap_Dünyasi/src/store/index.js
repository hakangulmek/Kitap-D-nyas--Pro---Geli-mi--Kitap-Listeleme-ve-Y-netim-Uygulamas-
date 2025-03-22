import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

import favorites from "./favorites";

export default createStore({
  modules: {
    favorites,
  },
  plugins: [createPersistedState()], // LocalStorage entegrasyonu
});
