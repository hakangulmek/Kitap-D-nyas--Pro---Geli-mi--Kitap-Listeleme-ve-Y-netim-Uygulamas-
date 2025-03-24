<template>
  <div class="book-basic-info">
    <div class="book-image">
      <img :src="book.coverImage" :alt="book.title" />
    </div>
    <div class="book-info">
      <h1>{{ book.title }}</h1>
      <p class="author">{{ book.author }}</p>
      <div class="rating-container">
        <StarRating :rating="book.averageRating" readonly />
        <span>({{ book.reviewCount }} değerlendirme)</span>
      </div>
      <button
        class="favorite-button"
        :class="{ 'is-favorite': isFavorite }"
        @click="$emit('toggle-favorite')"
      >
        <i class="fas" :class="isFavorite ? 'fa-heart' : 'fa-heart-o'"></i>
        {{ isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle" }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  book: {
    type: Object,
    required: true,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["toggle-favorite"]);
</script>

<style scoped>
.book-basic-info {
  display: flex;
  gap: 30px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.book-image {
  width: 300px;
  height: 450px;
}

.book-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.book-info {
  flex: 1;
}

.favorite-button {
  margin-top: 20px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.favorite-button.is-favorite {
  background-color: #ff4757;
  color: white;
}
</style>
