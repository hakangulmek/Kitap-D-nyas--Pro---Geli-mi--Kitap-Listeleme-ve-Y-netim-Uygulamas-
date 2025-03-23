import books from "@/data/book";

export default {
  namespaced: true,
  state: {
    items: [],
  },
  mutations: {
    ADD_TO_CART(state, bookId) {
      if (!state.items.includes(bookId)) {
        state.items.push(bookId);
      }
    },
    REMOVE_FROM_CART(state, bookId) {
      state.items = state.items.filter((id) => id !== bookId);
    },
  },
  actions: {
    addToCart({ commit }, bookId) {
      commit("ADD_TO_CART", bookId);
    },
    removeFromCart({ commit }, bookId) {
      commit("REMOVE_FROM_CART", bookId);
    },
  },
  getters: {
    cartBooks: (state) => {
      return state.items
        .map((id) => books.find((book) => book.id === id))
        .filter(Boolean);
    },
    cartItemCount: (state) => {
      return state.items.length;
    },
    cartTotal: (state, getters) => {
      return getters.cartBooks.reduce((total, book) => {
        return total + book.price;
      }, 0);
    },
  },
};
