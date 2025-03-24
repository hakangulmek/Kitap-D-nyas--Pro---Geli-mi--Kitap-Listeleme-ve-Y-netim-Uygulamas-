// src/store/index.js
import { createStore } from "vuex";

export default createStore({
  state: {
    bookFormData: {
      basicInfo: {},
      detailedInfo: {},
      additionalInfo: {},
    },
    currentStep: 0,
    coverImage: null,
    user: null,
    token: localStorage.getItem("token") || null,
  },
  mutations: {
    UPDATE_BOOK_DATA(state, { step, data }) {
      state.bookFormData[step] = { ...state.bookFormData[step], ...data };
    },
    SET_CURRENT_STEP(state, step) {
      state.currentStep = step;
    },
    SET_COVER_IMAGE(state, base64Image) {
      state.coverImage = base64Image;
      localStorage.setItem("bookCoverImage", base64Image);
    },
    SAVE_BOOK_DATA(state) {
      localStorage.setItem("bookFormData", JSON.stringify(state.bookFormData));
    },
    LOAD_BOOK_DATA(state) {
      const savedData = localStorage.getItem("bookFormData");
      if (savedData) {
        state.bookFormData = JSON.parse(savedData);
      }
      const savedCoverImage = localStorage.getItem("bookCoverImage");
      if (savedCoverImage) {
        state.coverImage = savedCoverImage;
      }
    },
    SET_USER(state, user) {
      state.user = user;
    },
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
    },
    LOGOUT(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  getters: {
    isAuthenticated: (state) => () => !!state.token,
    getCurrentUser: (state) => () => state.user,
    getCurrentStep: (state) => () => state.currentStep,
    getBookFormData: (state) => () => state.bookFormData,
    getCoverImage: (state) => () => state.coverImage,
  },
  actions: {
    updateBookData({ commit }, { step, data }) {
      commit("UPDATE_BOOK_DATA", { step, data });
      commit("SAVE_BOOK_DATA");
    },
    setCurrentStep({ commit }, step) {
      commit("SET_CURRENT_STEP", step);
    },
    setCoverImage({ commit }, base64Image) {
      commit("SET_COVER_IMAGE", base64Image);
    },
    loadBookData({ commit }) {
      commit("LOAD_BOOK_DATA");
    },
    login({ commit }, { user, token }) {
      commit("SET_USER", user);
      commit("SET_TOKEN", token);
    },
    logout({ commit }) {
      commit("LOGOUT");
    },
  },
});
