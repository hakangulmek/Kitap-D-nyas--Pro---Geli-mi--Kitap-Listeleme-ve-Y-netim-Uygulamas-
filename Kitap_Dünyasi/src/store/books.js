import books from "@/data/book";
import { set } from "lodash";

export default {
  namespaced: true,
  state: {
    items: [],
    books: [],
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
    setBooks(state, books) {
      state.books = books;
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
    initializeBooks({ commit }) {
      // Dummy data'yı state.books içine yükle
      commit("setBooks", books);
    },
    async getBookById({ state }, bookId) {
      console.log("Available books in state:", state.books); // Mevcut kitapları kontrol edin
      const book = state.books.find((book) => book.id === parseInt(bookId));
      if (!book) {
        console.error(`Book with ID ${bookId} not found.`);
        throw new Error(`Book with ID ${bookId} not found.`);
      }
      return book;
    },
  },
  getters: {
    isFavorite: (state) => (bookId) => {
      const book = state.books.find((book) => book.id === bookId);
      return book ? book.isFavorite : false;
    },
    cartBooks: (state) => {
      // null ID'leri filtreleyin
      const validIds = state.items.filter(
        (id) => id !== null && id !== undefined
      );
      console.log("Geçerli ID'ler:", validIds);

      return validIds
        .map((id) => {
          const book = state.books.find((book) => book.id === id);
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
        return total + (book.price || 0);
      }, 0);
    },
    getRelatedBooks: (state) => (currentBook) => {
      if (!currentBook || !currentBook.categoryId) return [];
      // Aynı kategoriye sahip kitapları döndür
      return state.books.filter(
        (book) =>
          book.categoryId === currentBook.categoryId &&
          book.id !== currentBook.id
      );
    },
  },
};
