<template>
  <div class="book-list-item">
    <div class="book-image">
      <img :src="book.imageUrl" :alt="book.title" />
    </div>
    <div class="book-details">
      <div class="book-info">
        <h3>{{ book.title }}</h3>
        <p class="author">{{ book.author }}</p>
        <p class="description">{{ book.description }}</p>
      </div>
      <div class="book-actions">
        <p class="price">{{ book.price }} TL</p>
        <div class="action-buttons">
          <button
            @click="$emit('toggle-favorite', book)"
            :class="['favorite-button', { 'is-favorite': isFavorite }]"
          >
            <i :class="isFavorite ? 'fas fa-heart' : 'far fa-heart'"></i>
            <span>{{
              isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"
            }}</span>
          </button>
          <button @click="$emit('add-to-cart', book.id)" class="cart-button">
            <i class="fas fa-shopping-cart"></i>
            <span>Sepete Ekle</span>
          </button>
        </div>
      </div>
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

defineEmits(["toggle-favorite", "add-to-cart"]);
</script>

<style scoped>
.book-list-item {
  display: flex;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  padding: 15px;
}

.book-list-item:hover {
  transform: translateY(-3px);
  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.15);
}

.book-image {
  flex: 0 0 120px;
  margin-right: 20px;
}

.book-image img {
  width: 120px;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.1);
}

.book-details {
  flex: 1;
  display: flex;
  justify-content: space-between;
}

.book-info {
  flex: 1;
  padding-right: 20px;
}

.book-info h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: #333;
}

.book-info .author {
  font-size: 16px;
  color: #666;
  margin: 0 0 10px 0;
}

.book-info .description {
  font-size: 14px;
  color: #777;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-actions {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  min-width: 180px;
}

.price {
  font-size: 20px;
  font-weight: bold;
  color: #e74c3c;
  margin: 0 0 15px 0;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-buttons button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.action-buttons button i {
  margin-right: 8px;
}

.favorite-button {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  color: #495057;
}

.favorite-button:hover {
  background-color: #e9ecef;
}

.favorite-button.is-favorite {
  background-color: #fff3f3;
  color: #e74c3c;
  border: 1px solid #f8d7da;
}

.cart-button {
  background-color: #e74c3c;
  color: white;
}

.cart-button:hover {
  background-color: #c0392b;
}

@media (max-width: 768px) {
  .book-details {
    flex-direction: column;
  }

  .book-info {
    padding-right: 0;
    margin-bottom: 15px;
  }

  .book-actions {
    align-items: flex-start;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .book-list-item {
    flex-direction: column;
  }

  .book-image {
    margin-right: 0;
    margin-bottom: 15px;
    text-align: center;
  }

  .book-image img {
    width: 150px;
    height: 200px;
  }
}
</style>
