export default {
  namespaced: true,
  state: {
    reviews: [],
  },
  mutations: {
    SET_REVIEWS(state, reviews) {
      state.reviews = reviews;
    },
    ADD_REVIEW(state, review) {
      state.reviews.push(review);
    },
    UPDATE_REVIEW(state, updatedReview) {
      const index = state.reviews.findIndex((r) => r.id === updatedReview.id);
      if (index !== -1) {
        state.reviews.splice(index, 1, updatedReview);
      }
    },
    DELETE_REVIEW(state, reviewId) {
      state.reviews = state.reviews.filter((r) => r.id !== reviewId);
    },
  },
  actions: {
    // Yorum ekleme
    addReview({ commit }, reviewData) {
      // Gerçek bir API'niz olduğunda burası API çağrısı yapacak
      const newReview = {
        id: Date.now(), // Geçici ID oluştur
        date: new Date().toISOString(),
        userId: reviewData.userId || "anonymous",
        userName: reviewData.userName || "Anonim Kullanıcı",
        ...reviewData,
      };
      commit("ADD_REVIEW", newReview);
      return newReview;
    },

    // Yorumları getirme
    getBookReviews({ state }, bookId) {
      return state.reviews.filter((review) => review.bookId === bookId);
    },

    // Yorum güncelleme
    updateReview({ commit }, reviewData) {
      commit("UPDATE_REVIEW", {
        ...reviewData,
        date: new Date().toISOString(),
      });
    },

    // Yorum silme
    deleteReview({ commit }, reviewId) {
      commit("DELETE_REVIEW", reviewId);
    },
  },
  getters: {
    getBookReviews: (state) => (bookId) => {
      return state.reviews.filter((review) => review.bookId === bookId);
    },
  },
};
