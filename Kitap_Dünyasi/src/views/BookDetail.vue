<template>
  <div class="book-detail-container" v-if="book">
    <!-- Üst Kısım: Kitap Temel Bilgileri -->
    <BookBasicInfo
      :book="book"
      :is-favorite="isFavorite"
      @toggle-favorite="handleToggleFavorite"
    />

    <!-- Orta Kısım: Detaylı Bilgiler ve Sosyal Medya -->
    <div class="detail-content">
      <div class="main-content">
        <!-- Meta Bilgiler -->
        <BookMetaInfo :book="book" />

        <!-- Kitap Açıklaması -->
        <div class="book-description">
          <h3>Kitap Hakkında</h3>
          <p>{{ book.description }}</p>
        </div>

        <!-- Sosyal Medya Paylaşım -->
        <SocialShare
          :url="currentPageUrl"
          :title="book.title"
          :description="book.description"
        />
      </div>

      <!-- Sağ Kenar Çubuğu -->
      <div class="sidebar">
        <BookPurchaseCard :book="book" @add-to-cart="handleAddToCart" />
      </div>
    </div>

    <!-- İncelemeler ve Yorumlar Bölümü -->
    <div class="reviews-section">
      <h3>Kitap İncelemeleri ve Yorumlar</h3>

      <!-- İnceleme Yazma Formu -->
      <BookReviewForm v-if="isLoggedIn" @submit-review="handleReviewSubmit" />

      <!-- İnceleme Filtreleme -->
      <ReviewFilters
        :total-reviews="reviews.length"
        @filter-change="handleFilterChange"
      />

      <!-- İnceleme Listesi -->
      <ReviewList
        :reviews="filteredReviews"
        :can-edit="canUserEdit"
        @edit-review="handleReviewEdit"
        @delete-review="handleReviewDelete"
      />
    </div>

    <!-- İlgili Kitaplar -->
    <RelatedBooks :current-book="book" :related-books="relatedBooks" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

// Komponentleri import et
import BookBasicInfo from "@/components/BookBasicInfo.vue";
import BookMetaInfo from "@/components/BookMetaInfo.vue";

const route = useRoute();
const store = useStore();

// State tanımlamaları
const book = ref(null);
const reviews = ref([]);
const filterOptions = ref({
  rating: null,
  sortBy: "newest",
});

// Computed properties
const currentPageUrl = computed(() => window.location.href);
const isLoggedIn = computed(() => store.getters["auth/isLoggedIn"]);
const isFavorite = computed(() =>
  store.getters["cart/isFavorite"](book.value?.id)
);

const filteredReviews = computed(() => {
  return reviews.value
    .filter((review) => {
      if (
        filterOptions.value.rating &&
        review.rating !== filterOptions.value.rating
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (filterOptions.value.sortBy === "newest") {
        return new Date(b.date) - new Date(a.date);
      }
      return b.rating - a.rating;
    });
});

const relatedBooks = computed(() => {
  if (!book.value) return [];
  return store.getters["cart/getRelatedBooks"](book.value);
});

// Methods
const handleToggleFavorite = () => {
  store.dispatch("cart/toggleFavorite", book.value.id);
};

const handleAddToCart = () => {
  store.dispatch("cart/addToCart", book.value.id);
};

const handleReviewSubmit = async (reviewData) => {
  try {
    await store.dispatch("reviews/addReview", {
      bookId: book.value.id,
      ...reviewData,
    });
    await loadReviews();
  } catch (error) {
    console.error("Review submission failed:", error);
  }
};

const handleReviewEdit = async (reviewId, updatedData) => {
  try {
    await store.dispatch("reviews/updateReview", {
      reviewId,
      ...updatedData,
    });
    await loadReviews();
  } catch (error) {
    console.error("Review update failed:", error);
  }
};

const handleReviewDelete = async (reviewId) => {
  try {
    await store.dispatch("reviews/deleteReview", reviewId);
    await loadReviews();
  } catch (error) {
    console.error("Review deletion failed:", error);
  }
};

const handleFilterChange = (newFilters) => {
  filterOptions.value = { ...filterOptions.value, ...newFilters };
};

const loadReviews = async () => {
  if (!book.value || !book.value.id) {
    console.error("Book is not loaded or ID is missing.");
    return;
  }
  try {
    const bookReviews = await store.dispatch(
      "reviews/getBookReviews",
      book.value.id
    );
    reviews.value = bookReviews;
  } catch (error) {
    console.error("Failed to load reviews:", error);
  }
};

// Lifecycle hooks
onMounted(async () => {
  const bookId = route.params.id;
  if (!bookId) {
    console.error("Book ID is missing in the route parameters.");
    return;
  }

  try {
    book.value = await store.dispatch("cart/getBookById", bookId);
    if (!book.value) {
      console.error("Book not found or failed to load.");
      return;
    }
    console.log("Loaded book:", book.value); // Yüklenen kitabı kontrol edin
  } catch (error) {
    console.error("Failed to load book details:", error);
  }
});
</script>

<style scoped>
.book-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.detail-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 30px;
  margin-top: 30px;
}

.main-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sidebar {
  position: sticky;
  top: 20px;
  height: fit-content;
}

.book-description {
  margin: 20px 0;
}

.reviews-section {
  margin-top: 40px;
}

@media (max-width: 768px) {
  .detail-content {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
  }
}
</style>
