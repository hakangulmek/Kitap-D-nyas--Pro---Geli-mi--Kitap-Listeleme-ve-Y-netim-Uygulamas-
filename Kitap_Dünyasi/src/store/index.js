import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

import favorites from "./favorites";
import books from "./books";
import comment from "./comment";
import booksEdit from "./booksEdit";
export default createStore({
  modules: {
    favorites,
    books,
    comment,
    booksEdit,
  },
  plugins: [createPersistedState()], // LocalStorage entegrasyonu
});
