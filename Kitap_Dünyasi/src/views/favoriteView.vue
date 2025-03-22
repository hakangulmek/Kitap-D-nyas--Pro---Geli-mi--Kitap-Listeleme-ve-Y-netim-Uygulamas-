<template>
  <div class="favorites-page">
    <h1 class="page-title">Favori Kitaplarım</h1>

    <div v-if="favoriteBooks.length === 0" class="empty-state">
      <div class="empty-icon">📚</div>
      <h2>Henüz favorilere eklenen kitap yok</h2>
      <p>Beğendiğiniz kitapları favorilere ekleyerek burada görebilirsiniz.</p>
      <router-link to="/" class="back-to-books">
        Kitapları Keşfedin
      </router-link>
    </div>

    <div v-else class="favorites-grid">
      <BookCard
        v-for="book in favoriteBooks"
        :key="book.id"
        :book="book"
        :is-favorite="true"
        @toggle-favorite="handleToggleFavorite"
        @add-to-cart="handleAddToCart"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useStore } from "vuex";
import { computed } from "vue";
import BookCard from "@/components/BookCard.vue";
import books from "@/data/book";

export default defineComponent({
  name: "FavoritesView",
  components: {
    BookCard,
  },
  setup() {
    const store = useStore();

    // Favori kitapların listesini oluştur
    const favoriteBooks = computed(() => {
      const favoriteIds = store.state.favorites.favorites;
      return books.filter((book) => favoriteIds.includes(book.id));
    });

    // Favori durumunu değiştir
    const handleToggleFavorite = (data) => {
      store.dispatch("favorites/toggleFavorite", data);
    };

    // Sepete ekle
    const handleAddToCart = (bookId) => {
      console.log(`Sepete eklenen kitap ID: ${bookId}`);
      // Sepete ekleme işlemleri burada yapılabilir
    };

    return {
      favoriteBooks,
      handleToggleFavorite,
      handleAddToCart,
    };
  },
});
</script>

<style scoped>
.favorites-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  text-align: center;
  font-size: 28px;
  color: #333;
  margin-bottom: 40px;
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
}

.page-title:after {
  content: "";
  position: absolute;
  width: 50%;
  height: 3px;
  background: #e74c3c;
  bottom: -8px;
  left: 25%;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin: 40px auto;
  max-width: 600px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.empty-state h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.empty-state p {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
}

.back-to-books {
  display: inline-block;
  background-color: #e74c3c;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s;
}

.back-to-books:hover {
  background-color: #c0392b;
}

/* Responsive tasarım */
@media (max-width: 768px) {
  .favorites-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 480px) {
  .favorites-grid {
    grid-template-columns: 1fr;
  }

  .page-title {
    font-size: 24px;
  }
}
</style>
