<template>
  <div class="basket-container">
    <h2>Sepetim ({{ cartItemCount }} ürün)</h2>

    <div v-if="!cartBooks.length" class="empty-cart">
      <i class="fas fa-shopping-cart"></i>
      <p>Sepetinizde ürün bulunmamaktadır.</p>
      <router-link to="/" class="continue-shopping"
        >Alışverişe Başla</router-link
      >
    </div>

    <div v-else class="cart-content">
      <div class="cart-items">
        <div v-for="book in cartBooks" :key="book.id" class="cart-item">
          <div class="item-image-container">
            <img :src="book.coverImage" :alt="book.title" class="item-image" />
          </div>

          <div class="item-details">
            <h3>{{ book.title }}</h3>
            <p class="author">Yazar: {{ book.author }}</p>
            <div class="book-details">
              <p><strong>Yayınevi:</strong> {{ book.publisher }}</p>
              <p><strong>Yayın Yılı:</strong> {{ book.publicationYear }}</p>
              <p><strong>Sayfa Sayısı:</strong> {{ book.pageCount }}</p>
              <p><strong>Dil:</strong> {{ book.language }}</p>
            </div>
            <p class="description">{{ book.description }}</p>

            <div class="price-actions">
              <p class="price">{{ book.price.toFixed(2) }} TL</p>
              <button @click="removeFromCart(book.id)" class="remove-button">
                <i class="fas fa-trash"></i> Kaldır
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="cart-summary">
        <h3>Sipariş Özeti</h3>
        <div class="summary-details">
          <div class="summary-row">
            <span>Ürünler ({{ cartItemCount }})</span>
            <span>{{ cartTotal.toFixed(2) }} TL</span>
          </div>
          <div class="summary-row">
            <span>Kargo</span>
            <span v-if="cartTotal > 200">Ücretsiz</span>
            <span v-else>{{ shipping }} TL</span>
          </div>
          <div class="summary-row total">
            <span>Toplam</span>
            <span
              >{{
                (cartTotal + (cartTotal > 200 ? 0 : shipping)).toFixed(2)
              }}
              TL</span
            >
          </div>
          <p class="free-shipping-info" v-if="cartTotal <= 200">
            {{ (200 - cartTotal).toFixed(2) }} TL daha alışveriş yaparak
            ücretsiz kargo fırsatından yararlanabilirsiniz!
          </p>
        </div>
        <button class="checkout-button">
          <i class="fas fa-lock"></i> Alışverişi Tamamla
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";

const store = useStore();
const shipping = 29.9;

const cartBooks = computed(() => {
  const books = store.getters["books/cartBooks"];
  return books;
});

const cartItemCount = computed(() => store.getters["books/cartItemCount"]);
const cartTotal = computed(() => store.getters["books/cartTotal"]);

const removeFromCart = (bookId) => {
  store.dispatch("books/removeFromCart", bookId);
};
</script>

<style scoped>
.basket-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
  margin-top: 20px;
}

.cart-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 15px;
}

.item-image-container {
  width: 150px;
  height: 200px;
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.item-details {
  flex: 1;
}

.book-details {
  margin: 10px 0;
}

.price-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.price {
  font-size: 1.2em;
  font-weight: bold;
  color: #2c3e50;
}

.remove-button {
  padding: 8px 15px;
  background-color: #ff4757;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cart-summary {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  height: fit-content;
}

.summary-details {
  margin: 15px 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}

.total {
  font-weight: bold;
  font-size: 1.2em;
  border-top: 1px solid #ddd;
  padding-top: 10px;
}

.checkout-button {
  width: 100%;
  padding: 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1em;
}

.empty-cart {
  text-align: center;
  padding: 40px;
}

.empty-cart i {
  font-size: 48px;
  color: #999;
  margin-bottom: 20px;
}

.continue-shopping {
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  margin-top: 20px;
}

.free-shipping-info {
  color: #28a745;
  font-size: 0.9em;
  margin-top: 10px;
}
</style>
