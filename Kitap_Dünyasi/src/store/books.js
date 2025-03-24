import books from "@/data/book";

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
      commit("setBooks", books); // books data'sını state'e yükle
    },
    async getBookById({ state }, bookId) {
      try {
        // books array'inden kitabı bul
        const book = books.find((b) => b.id === parseInt(bookId));
        if (!book) return null;

        // Kitap verilerini aynı favorilerdeki gibi döndür
        return {
          id: book.id,
          title: book.title,
          author: book.author,
          imageUrl: book.coverImage,
          category: book.category || "Kategori Belirtilmemiş",
          description: book.description,
          price: book.price,
          isbn: book.isbn,
          pageCount: book.pageCount,
          publisher: book.publisher,
          publishDate: book.publishDate,
        };
      } catch (error) {
        console.error("Kitap detayları getirilirken hata oluştu:", error);
        return null;
      }
    },
    async fetchBookDetails({ commit }, bookId) {
      try {
        // API'den kitap detaylarını getir
        const response = await fetch(`/api/books/${bookId}`); // API endpoint'inize göre ayarlayın
        const bookDetails = await response.json();
        return bookDetails;
      } catch (error) {
        console.error("Kitap detayları getirilirken hata oluştu:", error);
        return null;
      }
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
    getRelatedBooks: (state) => (bookId) => {
      const currentBook = state.books.find((book) => book.id === bookId);
      if (!currentBook) return [];

      // Aynı yazarın veya kategorinin kitaplarını getir
      return state.books
        .filter(
          (book) =>
            (book.author === currentBook.author ||
              book.category === currentBook.category) &&
            book.id !== bookId
        )
        .slice(0, 4); // İlk 4 ilgili kitabı göster
    },
  },
};
