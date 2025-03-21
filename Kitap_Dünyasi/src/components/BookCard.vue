<template>
  <div class="book-card">
    <div class="book-image">
      <img :src="book.imageUrl" :alt="book.title" />
    </div>
    <div class="book-details">
      <h3 class="book-title">{{ book.title }}</h3>
      <p class="book-author">{{ book.author }}</p>
      <p class="book-description">
        {{ truncateDescription(book.description) }}
      </p>
      <p class="book-price">{{ formatPrice(book.price) }} TL</p>
      <div class="book-actions">
        <button
          class="favorite-button"
          @click="toggleFavorite"
          :class="{ 'is-favorite': isFavorite }"
        >
          <i
            class="icon"
            :class="isFavorite ? 'icon-heart-filled' : 'icon-heart'"
          ></i>
          <span>Favorilere Ekle</span>
        </button>
        <button class="add-to-cart-button" @click="addToCart">
          <i class="icon icon-cart"></i>
          <span>Sepete Ekle</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BookCard",
  props: {
    book: {
      type: Object,
      required: true,
      validator: (value) => {
        return value.title && value.author && value.price && value.imageUrl;
      },
    },
  },
  data() {
    return {
      isFavorite: false,
    };
  },
  methods: {
    truncateDescription(description) {
      return description.length > 100
        ? description.substring(0, 100) + "..."
        : description;
    },
    formatPrice(price) {
      return price.toLocaleString("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
    toggleFavorite() {
      this.isFavorite = !this.isFavorite;
      this.$emit("toggle-favorite", {
        bookId: this.book.id,
        isFavorite: this.isFavorite,
      });
    },
    addToCart() {
      this.$emit("add-to-cart", this.book.id);
    },
  },
};
</script>

<style scoped>
.book-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: #fff;
  height: 100%;
  max-width: 280px;
  margin: 0 auto;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
}

.book-image {
  height: 280px;
  overflow: hidden;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
}

.book-image img {
  height: 100%;
  max-width: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.book-card:hover .book-image img {
  transform: scale(1.05);
}

.book-details {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.book-title {
  margin: 0 0 5px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.book-author {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #666;
  font-style: italic;
}

.book-description {
  margin: 0 0 15px 0;
  font-size: 14px;
  color: #555;
  line-height: 1.4;
  flex-grow: 1;
}

.book-price {
  font-size: 20px;
  font-weight: 700;
  color: #e63946;
  margin: 0 0 15px 0;
}

.book-actions {
  display: flex;
  gap: 8px;
  margin-top: auto;
}

button {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.favorite-button {
  background-color: #f8f9fa;
  color: #666;
  border: 1px solid #ddd;
}

.favorite-button:hover {
  background-color: #f1f3f5;
}

.favorite-button.is-favorite {
  color: #e63946;
  background-color: #fff5f5;
  border-color: #fcc;
}

.add-to-cart-button {
  background-color: #4361ee;
  color: white;
}

.add-to-cart-button:hover {
  background-color: #3a56d4;
}

.icon {
  margin-right: 5px;
  font-size: 16px;
}

/* Font awesome veya başka bir ikon kütüphanesi kullanılabilir */
.icon-heart::before {
  content: "♡";
}

.icon-heart-filled::before {
  content: "♥";
}

.icon-cart::before {
  content: "🛒";
}

@media (max-width: 768px) {
  .book-image {
    height: 220px;
  }

  .book-actions {
    flex-direction: column;
  }

  button span {
    font-size: 12px;
  }
}
</style>
