<template>
  <div class="book-detail-container" v-if="book">
    <!-- Üst Kısım: Kitap Temel Bilgileri -->
    <div class="book-header">
      <div class="book-image-section">
        <!-- Kitap resmi için fallback mekanizması -->
        <div class="book-image">
          <img
            :src="book.imageUrl"
            :alt="book.title"
            @error="handleImageError"
            class="book-cover"
          />
        </div>

        <div class="action-buttons">
          <button
            class="favorite-btn"
            :class="{ active: isFavorite }"
            @click="toggleFavorite"
          >
            <i class="fas" :class="isFavorite ? 'fa-heart' : 'fa-heart-o'"></i>
            {{ isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle" }}
          </button>
          <button class="share-btn" @click="showShareModal = true">
            <i class="fas fa-share-alt"></i> Paylaş
          </button>
        </div>
      </div>

      <div class="book-info-section">
        <div class="category-badge" v-if="book.category">
          {{ book.category }}
        </div>
        <h1 class="book-title">{{ book.title || "Kitap Adı Bulunamadı" }}</h1>
        <h2 class="book-author">
          {{ book.author || "Yazar Bilgisi Bulunamadı" }}
        </h2>

        <div class="rating-section">
          <div class="stars">
            <i
              v-for="n in 5"
              :key="n"
              class="fas"
              :class="n <= book.rating ? 'fa-star' : 'fa-star-o'"
            ></i>
          </div>
          <span class="rating-count"
            >({{ book.reviewCount }} değerlendirme)</span
          >
        </div>

        <div class="price-section">
          <span class="price">{{ formatPrice(book.price) }} TL</span>
          <button class="add-cart-btn" @click="addToCart">
            <i class="fas fa-shopping-cart"></i> Sepete Ekle
          </button>
        </div>

        <div class="meta-info">
          <div class="info-item">
            <span class="label">ISBN:</span>
            <span class="value">{{ book.isbn }}</span>
          </div>
          <div class="info-item">
            <span class="label">Sayfa Sayısı:</span>
            <span class="value">{{ book.pageCount }}</span>
          </div>
          <div class="info-item">
            <span class="label">Yayınevi:</span>
            <span class="value">{{ book.publisher }}</span>
          </div>
          <div class="info-item">
            <span class="label">Basım Tarihi:</span>
            <span class="value">{{ formatDate(book.publishDate) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Kitap Açıklaması -->
    <div class="book-description">
      <h3>Kitap Hakkında</h3>
      <p>{{ book.description }}</p>
    </div>

    <!-- Yorumlar ve Değerlendirmeler Bölümü -->
    <BookReviews :bookId="book.id" />

    <!-- İlgili Kitaplar -->
    <div class="related-books">
      <h3>İlgili Kitaplar</h3>
      <div class="books-carousel">
        <div
          v-for="relatedBook in relatedBooks"
          :key="relatedBook.id"
          class="related-book-card"
          @click="navigateToBook(relatedBook.id)"
        >
          <img :src="relatedBook.coverImage" :alt="relatedBook.title" />
          <h4>{{ relatedBook.title }}</h4>
          <p>{{ relatedBook.author }}</p>
        </div>
      </div>
    </div>

    <!-- Paylaşım Modalı -->
    <div class="share-modal" v-if="showShareModal">
      <div class="modal-content">
        <h3>Kitabı Paylaş</h3>
        <div class="share-buttons">
          <button class="share-twitter">
            <i class="fab fa-twitter"></i> Twitter
          </button>
          <button class="share-facebook">
            <i class="fab fa-facebook"></i> Facebook
          </button>
          <button class="share-whatsapp">
            <i class="fab fa-whatsapp"></i> WhatsApp
          </button>
        </div>
        <button class="close-modal" @click="showShareModal = false">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </div>
  <div v-else class="loading-state">
    <p>Kitap bilgileri yükleniyor...</p>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import BookReviews from "@/components/BookReviews.vue";

export default {
  name: "BookDetail",
  components: {
    BookReviews,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const book = ref(null);
    const showShareModal = ref(false);
    const reviewFilter = ref("all");
    const reviewSort = ref("newest");
    const newReview = ref({
      rating: 5,
      text: "",
    });
    const isLoading = ref(true);
    const isLoggedIn = computed(() => store.state.auth?.isLoggedIn || false);
    const currentUserId = computed(() => store.state.auth?.user?.id);
    const isFavorite = computed(() =>
      store.getters["favorites/isFavorite"](book.value?.id)
    );

    const filteredReviews = computed(() => {
      let reviews = book.value?.reviews || [];

      if (reviewFilter.value !== "all") {
        reviews = reviews.filter((r) => r.rating === reviewFilter.value);
      }

      switch (reviewSort.value) {
        case "newest":
          return [...reviews].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
        case "oldest":
          return [...reviews].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          );
        case "highest":
          return [...reviews].sort((a, b) => b.rating - a.rating);
        case "lowest":
          return [...reviews].sort((a, b) => a.rating - b.rating);
        default:
          return reviews;
      }
    });

    const relatedBooks = computed(() => {
      // Aynı yazarın veya kategorinin kitapları
      return store.getters["books/getRelatedBooks"](book.value?.id);
    });
    console.log("relatedBooks", relatedBooks);

    // Kitap baş harfini hesapla
    const getBookInitial = computed(() => {
      return book.value?.title ? book.value.title.charAt(0).toUpperCase() : "K";
    });

    onMounted(async () => {
      try {
        isLoading.value = true;
        const bookId = parseInt(route.params.id);

        // Kitapları yükle
        await store.dispatch("books/initializeBooks");

        // Kitap detaylarını al
        const bookDetails = await store.dispatch("books/getBookById", bookId);

        if (!bookDetails) {
          router.push("/");
          return;
        }

        // Kitap verilerini tam olarak set et
        book.value = {
          id: bookDetails.id,
          title: bookDetails.title || "Başlık Bulunamadı",
          author: bookDetails.author || "Yazar Bilgisi Yok",
          // Resim URL'si için birden fazla kaynak kontrol et
          imageUrl:
            bookDetails.imageUrl ||
            `/images/books/${bookDetails.id}.jpg` ||
            `/images/default-book.jpg`,
          coverImage:
            bookDetails.coverImage ||
            bookDetails.imageUrl ||
            `/images/books/${bookDetails.id}.jpg`,
          category: bookDetails.category || "Kategori Belirtilmemiş",
          description: bookDetails.description || "Açıklama bulunmuyor",
          price: bookDetails.price || 0,
          isbn: bookDetails.isbn || "ISBN bilgisi yok",
          pageCount: bookDetails.pageCount || 0,
          publisher: bookDetails.publisher || "Yayınevi bilgisi yok",
          publishDate: bookDetails.publishDate || new Date().toISOString(),
          rating: bookDetails.rating || 0,
          reviewCount: bookDetails.reviewCount || 0,
          language: bookDetails.language || "Türkçe",
          stock: bookDetails.stock || 0,
          reviews: bookDetails.reviews || [],
        };

        console.log("Yüklenen kitap detayları:", book.value);
      } catch (error) {
        router.push("/");
      } finally {
        isLoading.value = false;
      }
    });

    const formatPrice = (price) => {
      return new Intl.NumberFormat("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price);
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("tr-TR");
    };

    const toggleFavorite = () => {
      store.dispatch("favorites/toggleFavorite", {
        bookId: book.value.id,
        isFavorite: !isFavorite.value,
      });
    };

    const addToCart = () => {
      store.dispatch("books/addToCart", book.value.id);
    };

    const editingReviewId = ref(null);
    const hoverRating = ref(0);
    const sortOption = ref("newest");
    const reviews = ref([]);

    const sortedReviews = computed(() => {
      return [...reviews.value].sort((a, b) => {
        switch (sortOption.value) {
          case "newest":
            return new Date(b.date) - new Date(a.date);
          case "oldest":
            return new Date(a.date) - new Date(b.date);
          case "highest":
            return b.rating - a.rating;
          case "lowest":
            return a.rating - b.rating;
          default:
            return 0;
        }
      });
    });

    const setRating = (rating) => {
      newReview.value.rating = rating;
    };

    const submitReview = async () => {
      if (!newReview.value.text.trim()) return;

      try {
        if (editingReviewId.value) {
          await store.dispatch("comment/updateReview", {
            bookId: book.value.id,
            reviewId: editingReviewId.value,
            ...newReview.value,
          });
        } else {
          await store.dispatch("comment/addReview", {
            bookId: book.value.id,
            ...newReview.value,
          });
        }

        // Formu temizle
        newReview.value = { rating: 5, text: "" };
        editingReviewId.value = null;

        // Yorumları yeniden yükle
        await loadReviews();
      } catch (error) {}
    };

    const startEdit = (review) => {
      editingReviewId.value = review.id;
      newReview.value = {
        rating: review.rating,
        text: review.text,
      };
    };

    const cancelEdit = () => {
      editingReviewId.value = null;
      newReview.value = { rating: 5, text: "" };
    };

    const confirmDelete = async (reviewId) => {
      if (confirm("Bu yorumu silmek istediğinizden emin misiniz?")) {
        try {
          await store.dispatch("books/deleteReview", {
            bookId: book.value.id,
            reviewId,
          });
          await loadReviews();
        } catch (error) {
          console.error("Yorum silinirken hata oluştu:", error);
        }
      }
    };

    const loadReviews = async () => {
      try {
        const bookReviews = await store.dispatch(
          "comment/getBookReviews",
          book.value.id
        );
        reviews.value = bookReviews || [];
      } catch (error) {
        reviews.value = [];
      }
    };

    const navigateToBook = (bookId) => {
      router.push(`/book/${bookId}`);
    };

    // Resim yükleme hatası için handler
    const handleImageError = (e) => {
      const target = e.target;
      const parent = target.parentElement;

      // Varsayılan görünümü oluştur
      const defaultDiv = document.createElement("div");
      defaultDiv.className = "default-book-image";
      defaultDiv.textContent = getBookInitial.value;

      // Resmi varsayılan görünümle değiştir
      parent.replaceChild(defaultDiv, target);
    };

    const getUserInitial = (userName) => {
      return userName ? userName.charAt(0).toUpperCase() : "K";
    };

    const handleAvatarError = (e) => {
      const parent = e.target.parentNode;
      const defaultDiv = document.createElement("div");
      defaultDiv.className = "default-user-avatar";
      defaultDiv.textContent = getUserInitial(e.target.alt);
      parent.replaceChild(defaultDiv, e.target);
    };

    return {
      book,
      showShareModal,
      reviewFilter,
      reviewSort,
      newReview,
      isLoggedIn,
      currentUserId,
      isFavorite,
      filteredReviews,
      relatedBooks,
      formatPrice,
      formatDate,
      toggleFavorite,
      addToCart,
      submitReview,
      startEdit,
      navigateToBook,
      handleImageError,
      editingReviewId,
      hoverRating,
      sortOption,
      reviews,
      sortedReviews,
      setRating,
      startEdit,
      cancelEdit,
      confirmDelete,
      getUserInitial,
      handleAvatarError,
      isLoading,
      getBookInitial,
    };
  },
};
</script>

<style scoped>
.book-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.book-header {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.book-image-section {
  position: relative;
  width: 100%;
  max-width: 300px;
  aspect-ratio: 3/4;
  margin: 0 auto;
}

.book-image-section img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.favorite-btn,
.share-btn {
  padding: 0.8rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.favorite-btn {
  background-color: #fff;
  border: 2px solid #e74c3c;
  color: #e74c3c;
}

.favorite-btn.active {
  background-color: #e74c3c;
  color: white;
}

.share-btn {
  background-color: #3498db;
  color: white;
}

.category-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #f0f0f0;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
}

.stars {
  color: #f1c40f;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
}

.price {
  font-size: 2rem;
  font-weight: bold;
  color: #e74c3c;
}

.add-cart-btn {
  padding: 1rem 2rem;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.meta-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.label {
  color: #666;
  font-size: 0.9rem;
}

.value {
  font-weight: 500;
  color: #333;
}

.review-form {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
}

.star-rating {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
}

.star-rating i {
  cursor: pointer;
  color: #ddd;
}

.star-rating i.active {
  color: #f1c40f;
}

textarea {
  width: 100%;
  height: 150px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 1rem 0;
  resize: vertical;
}

.submit-review {
  background-color: #3498db;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

.reviews-section {
  margin: 2rem 0;
}

.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.filter-options {
  display: flex;
  gap: 1rem;
}

select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.review-item {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.reviewer-info img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.related-books {
  margin: 2rem 0;
}

.books-carousel {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.related-book-card {
  cursor: pointer;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.related-book-card img {
  width: 100%;
  height: 250px;
  object-fit: contain;
  margin-bottom: 0.5rem;
}

.related-book-card h4 {
  font-size: 1rem;
  margin: 0.5rem 0;
  color: #2c3e50;
}

.related-book-card p {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.related-book-card:hover {
  transform: translateY(-5px);
}

.share-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  position: relative;
}

.share-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.share-buttons button {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: white;
}

.share-twitter {
  background-color: #1da1f2;
}
.share-facebook {
  background-color: #1877f2;
}
.share-whatsapp {
  background-color: #25d366;
}

.close-modal {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: #666;
}

@media (max-width: 768px) {
  .book-header {
    grid-template-columns: 1fr;
  }

  .book-image-section {
    max-width: 300px;
    margin: 0 auto;
  }

  .filter-options {
    flex-direction: column;
  }
}

.reviews-and-comments {
  margin-top: 2rem;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.book-image {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.book-cover {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.default-book-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4361ee, #3498db);
  color: white;
  font-size: 4rem;
  font-weight: bold;
}

.comment-form {
  border-bottom: 1px solid #eee;
  padding-bottom: 2rem;
  margin-bottom: 2rem;
}

.star-input {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
}

.star-input i {
  font-size: 1.5rem;
  cursor: pointer;
  color: #ddd;
  transition: color 0.2s;
}

.star-input i.active {
  color: #ffd700;
}

.comment-textarea {
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 1rem 0;
  font-family: inherit;
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.submit-btn,
.cancel-btn {
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.submit-btn {
  background: #4361ee;
  color: white;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.cancel-btn {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #ddd;
}

.comment-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.comment-item {
  border-bottom: 1px solid #eee;
  padding-bottom: 1.5rem;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-date {
  color: #666;
  font-size: 0.9rem;
}

.comment-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.edit-btn,
.delete-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.edit-btn {
  background: #f0f0f0;
  color: #333;
}

.delete-btn {
  background: #ff4444;
  color: white;
}

.no-comments {
  text-align: center;
  padding: 2rem;
  color: #666;
  background: #f8f9fa;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .comment-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}

.default-user-avatar {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3498db, #2ecc71);
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 50%;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.comments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.rating-summary {
  text-align: right;
}

.average-rating {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.big-rating {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.review-count {
  display: block;
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.loading-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.book-title {
  margin: 0 0 1rem 0;
  font-size: 2rem;
  color: #2c3e50;
}

.book-author {
  margin: 0 0 1.5rem 0;
  font-size: 1.2rem;
  color: #666;
}
</style>
