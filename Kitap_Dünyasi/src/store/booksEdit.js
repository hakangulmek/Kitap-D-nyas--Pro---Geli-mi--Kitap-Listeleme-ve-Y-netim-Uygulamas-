import { createStore } from "vuex";

const booksEdit = {
  namespaced: true,
  state: {
    bookFormData: {
      basicInfo: {},
      detailedInfo: {},
      additionalInfo: {},
    },
    coverImage: null,
  },
  mutations: {
    SET_COVER_IMAGE(state, base64Image) {
      state.coverImage = base64Image;
      localStorage.setItem("bookCoverImage", base64Image);
    },
    UPDATE_BOOK_DATA(state, { step, data }) {
      state.bookFormData[step] = { ...state.bookFormData[step], ...data };
    },
  },
  getters: {
    // Getters MUST return a function
    getBookFormData: (state) => () => state.bookFormData,
    getCoverImage: (state) => () => state.coverImage,
  },
  actions: {
    setCoverImage({ commit }, base64Image) {
      commit("SET_COVER_IMAGE", base64Image);
    },
    updateBookData({ commit }, payload) {
      commit("UPDATE_BOOK_DATA", payload);
    },
  },
};

export default createStore({
  modules: {
    booksEdit,
  },
});
