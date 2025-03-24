<template>
  <div class="reviews-section">
    <!-- Yorum Yazma Formu -->
    <div class="review-form">
      <h3>Kitap Hakkında Yorum Yaz</h3>
      <div class="rating-input">
        <span>Puanınız:</span>
        <div class="star-rating">
          <i
            v-for="n in 5"
            :key="n"
            class="fas fa-star"
            :class="{ active: n <= (hoverRating || newReview.rating) }"
            @click="setRating(n)"
            @mouseover="hoverRating = n"
            @mouseleave="hoverRating = 0"
          ></i>
        </div>
      </div>
      <textarea
        v-model="newReview.text"
        placeholder="Bu kitap hakkında düşüncelerinizi paylaşın..."
      ></textarea>
      <div class="form-actions">
        <button class="submit-review" @click="submitReview">
          {{ editingReviewId ? "Yorumu Güncelle" : "Yorum Gönder" }}
        </button>
        <button
          v-if="editingReviewId"
          class="cancel-button"
          @click="cancelEdit"
        >
          İptal
        </button>
      </div>
    </div>

    <!-- Yorumlar Listesi -->
    <div class="reviews-list">
      <div class="reviews-header">
        <h3>Yorumlar ve Değerlendirmeler</h3>
        <div class="filter-options">
          <select v-model="sortOption">
            <option value="newest">En Yeni</option>
            <option value="oldest">En Eski</option>
            <option value="highest">En Yüksek Puan</option>
            <option value="lowest">En Düşük Puan</option>
          </select>
        </div>
      </div>

      <div v-if="reviews.length === 0" class="no-reviews">
        <p>Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
      </div>

      <div v-else class="review-items">
        <div
          v-for="review in sortedReviews"
          :key="review.id"
          class="review-item"
        >
          <div class="review-header">
            <div class="reviewer-info">
              <div
                class="avatar"
                :style="{ backgroundColor: getAvatarColor(review.userName) }"
              >
                {{ getUserInitial(review.userName) }}
              </div>
              <div class="user-details">
                <span class="username">{{ review.userName }}</span>
                <span class="review-date">{{ formatDate(review.date) }}</span>
              </div>
            </div>
            <div class="rating">
              <i
                v-for="n in 5"
                :key="n"
                class="fas fa-star"
                :class="{ active: n <= review.rating }"
              ></i>
            </div>
          </div>

          <p class="review-text">{{ review.text }}</p>

          <div class="review-actions" v-if="review.userId === currentUserId">
            <button class="edit-button" @click="startEdit(review)">
              <i class="fas fa-edit"></i> Düzenle
            </button>
            <button class="delete-button" @click="confirmDelete(review.id)">
              <i class="fas fa-trash"></i> Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";

export default {
  name: "BookReviews",
  props: {
    bookId: {
      type: [Number, String],
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const reviews = ref([]);
    const editingReviewId = ref(null);
    const hoverRating = ref(0);
    const sortOption = ref("newest");
    const newReview = ref({
      rating: 5,
      text: "",
    });

    const currentUserId = computed(() => store.state.auth?.user?.id);

    const averageRating = computed(() => {
      if (!reviews.value.length) return 0;
      const total = reviews.value.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      return Math.round(total / reviews.value.length);
    });

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

    const loadReviews = async () => {
      try {
        // Örnek yorumlar (gerçek uygulamada API'den gelecek)
        const sampleReviews = [
          {
            id: 1,
            userId: "user1",
            userName: "Ahmet Y.",
            rating: 5,
            text: "Harika bir kitap!",
            date: new Date("2024-03-15").toISOString(),
          },
          {
            id: 2,
            userId: "user2",
            userName: "Mehmet K.",
            rating: 4,
            text: "Güzel bir kitap.",
            date: new Date("2024-03-14").toISOString(),
          },
        ];
        reviews.value = sampleReviews;
      } catch (error) {
        console.error("Yorumlar yüklenirken hata oluştu:", error);
        reviews.value = [];
      }
    };

    const setRating = (rating) => {
      newReview.value.rating = rating;
    };

    const submitReview = async () => {
      if (!newReview.value.text.trim()) return;

      try {
        const reviewData = {
          id: Date.now(),
          bookId: props.bookId,
          ...newReview.value,
          date: new Date().toISOString(),
          userId: currentUserId.value || "anonymous",
          userName: "Anonim Kullanıcı",
        };

        if (editingReviewId.value) {
          const index = reviews.value.findIndex(
            (r) => r.id === editingReviewId.value
          );
          if (index !== -1) {
            reviews.value[index] = { ...reviews.value[index], ...reviewData };
          }
        } else {
          reviews.value.unshift(reviewData);
        }

        newReview.value = { rating: 5, text: "" };
        editingReviewId.value = null;

        await store.dispatch("comment/addReview", reviewData);
      } catch (error) {
        console.error("Yorum gönderilirken hata oluştu:", error);
      }
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
          reviews.value = reviews.value.filter(
            (review) => review.id !== reviewId
          );

          await store.dispatch("comment/deleteReview", {
            bookId: props.bookId,
            reviewId,
          });
        } catch (error) {
          console.error("Yorum silinirken hata oluştu:", error);
        }
      }
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("tr-TR");
    };

    const getUserInitial = (userName) => {
      return userName ? userName.charAt(0).toUpperCase() : "A";
    };

    const getAvatarColor = (userName) => {
      let hash = 0;
      for (let i = 0; i < userName.length; i++) {
        hash = userName.charCodeAt(i) + ((hash << 5) - hash);
      }
      const hue = hash % 360;
      return `hsl(${hue}, 70%, 60%)`;
    };

    // Yorumları yükle
    loadReviews();

    return {
      reviews,
      editingReviewId,
      hoverRating,
      sortOption,
      newReview,
      currentUserId,
      averageRating,
      sortedReviews,
      setRating,
      submitReview,
      startEdit,
      cancelEdit,
      confirmDelete,
      formatDate,
      getUserInitial,
      getAvatarColor,
    };
  },
};
</script>

<style scoped>
.reviews-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
  padding: 2rem;
}

.review-form {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eee;
}

.rating-input {
  margin: 1rem 0;
}

.star-rating {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.star-rating i {
  font-size: 1.5rem;
  color: #ddd;
  cursor: pointer;
  transition: all 0.2s ease;
}

.star-rating i.active {
  color: #ffd700;
}

textarea {
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  margin: 1rem 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;
  font-family: inherit;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.submit-review {
  background: #4361ee;
  color: white;
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

.cancel-button {
  background: #f8f9fa;
  color: #666;
  padding: 0.8rem 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
}

.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.filter-options select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.review-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-item {
  padding: 1.5rem;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fff;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: 500;
  color: #333;
}

.review-date {
  font-size: 0.9rem;
  color: #666;
}

.rating i {
  color: #ddd;
}

.rating i.active {
  color: #ffd700;
}

.review-text {
  margin: 1rem 0;
  line-height: 1.6;
  color: #333;
}

.review-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.edit-button,
.delete-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.edit-button {
  background: #f0f0f0;
  color: #333;
}

.delete-button {
  background: #ff4444;
  color: white;
}

.no-reviews {
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  color: #666;
}

@media (max-width: 768px) {
  .review-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .submit-review,
  .cancel-button {
    width: 100%;
  }
}
</style>
