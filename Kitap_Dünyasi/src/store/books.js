import books from "@/data/book";

export default {
  namespaced: true,
  state: {
    items: [],
  },
  mutations: {
    ADD_TO_CART(state, bookId) {
      // null kontrol ekleyin ve sadece geçerli ID'leri kabul edin
      if (
        bookId !== null &&
        bookId !== undefined &&
        !state.items.includes(bookId)
      ) {
        state.items.push(bookId);
        console.log(
          `Kitap (ID: ${bookId}) sepete eklendi, yeni sepet:`,
          state.items
        );
      }
    },
    REMOVE_FROM_CART(state, bookId) {
      state.items = state.items.filter((id) => id !== bookId);
    },
    // Sepeti temizleme işlemi ekleyin
    CLEAR_CART(state) {
      state.items = [];
    },
  },
  actions: {
    addToCart({ commit }, bookId) {
      // Eklemeden önce ID'nin geçerli olduğunu kontrol edin
      if (bookId !== null && bookId !== undefined) {
        commit("ADD_TO_CART", bookId);
      } else {
        console.error("Geçersiz kitap ID'si:", bookId);
      }
    },
    removeFromCart({ commit }, bookId) {
      commit("REMOVE_FROM_CART", bookId);
    },
    clearCart({ commit }) {
      commit("CLEAR_CART");
    },
  },
  getters: {
    cartBooks: (state) => {
      // null ID'leri filtreleyin
      const validIds = state.items.filter(
        (id) => id !== null && id !== undefined
      );
      console.log("Geçerli ID'ler:", validIds);

      return validIds
        .map((id) => {
          const book = books.find((book) => book.id === id);
          console.log(`ID ${id} için bulunan kitap:`, book);
          return book;
        })
        .filter(Boolean); // undefined değerleri filtrele
    },
    cartItemCount: (state) => {
      // null ID'leri saymayın
      return state.items.filter((id) => id !== null && id !== undefined).length;
    },
    cartTotal: (state, getters) => {
      return getters.cartBooks.reduce((total, book) => {
        return total + book.price;
      }, 0);
    },
  },
};
