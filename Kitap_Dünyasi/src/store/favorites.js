// store/modules/favorites.js
export default {
  namespaced: true,
  state: {
    favorites: [],
  },
  mutations: {
    ADD_TO_FAVORITES(state, bookId) {
      if (!state.favorites.includes(bookId)) {
        state.favorites.push(bookId);
      }
    },
    REMOVE_FROM_FAVORITES(state, bookId) {
      state.favorites = state.favorites.filter((id) => id !== bookId);
    },
  },
  actions: {
    toggleFavorite({ commit, state }, { bookId, isFavorite }) {
      if (isFavorite) {
        commit("ADD_TO_FAVORITES", bookId);
      } else {
        commit("REMOVE_FROM_FAVORITES", bookId);
      }
    },
  },
  getters: {
    isFavorite: (state) => (bookId) => {
      return state.favorites.includes(bookId);
    },
  },
};
