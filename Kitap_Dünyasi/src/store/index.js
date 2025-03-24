import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

import favorites from "./favorites";
import books from "./books";
import comment from "./comment";
export default createStore({
  modules: {
    favorites,
    books,
    comment,
  },
  plugins: [createPersistedState()], // LocalStorage entegrasyonu
});
