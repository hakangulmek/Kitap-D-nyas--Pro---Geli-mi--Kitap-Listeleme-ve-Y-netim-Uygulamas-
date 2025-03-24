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
    // API çağrıları ve review işlemleri burada yapılacak
  },
  getters: {
    getBookReviews: (state) => (bookId) => {
      return state.reviews.filter((review) => review.bookId === bookId);
    },
  },
};
