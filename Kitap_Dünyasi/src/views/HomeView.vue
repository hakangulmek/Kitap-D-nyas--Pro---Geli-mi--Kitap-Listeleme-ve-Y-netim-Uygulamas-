<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import books from "@/data/book";
</script>

<template>
  <div class="book-carousel">
    <h2>Öne Çıkan Kitaplar</h2>
    <Swiper
      :modules="[Pagination, Autoplay]"
      :pagination="{
        clickable: true,
        dynamicBullets: true,
        el: '.swiper-pagination',
      }"
      :autoplay="{ delay: 3000 }"
      :loop="true"
      :slides-per-view="3"
      :space-between="20"
      :navigation="false"
      class="mySwiper"
    >
      <SwiperSlide v-for="book in books" :key="book.id">
        <div class="book-card">
          <img :src="book.coverImage" :alt="book.title" />
          <h3>{{ book.title }}</h3>
          <p class="author">{{ book.author }}</p>
          <p class="price">{{ book.price }} TL</p>
        </div>
      </SwiperSlide>
    </Swiper>
    <!-- Pagination outside the swiper -->
    <div class="swiper-pagination"></div>
  </div>
</template>

<style scoped>
.book-carousel {
  max-width: 900px;
  margin: 0 auto 20px;
  text-align: center;
  position: relative;
  height: auto;
}

.book-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 15px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  height: 360px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.15);
}

.book-card img {
  width: 150px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.book-card h3 {
  margin: 10px 0 5px;
  font-size: 18px;
  font-weight: bold;
}

.book-card .author {
  font-size: 14px;
  color: gray;
  margin: 0;
}

.book-card .price {
  font-size: 16px;
  font-weight: bold;
  color: #e74c3c;
  margin-top: 5px;
}

/* Swiper general styles */
.mySwiper {
  position: relative;
  padding-bottom: 10px;
  height: 400px;
}

/* Position pagination dots properly */
.swiper-pagination {
  position: relative;
  bottom: auto !important;
  margin-top: 15px;
  z-index: 20;
}

.swiper-pagination-bullet {
  background: #ccc !important;
  opacity: 1;
  width: 8px;
  height: 8px;
  transition: all 0.3s;
  margin: 0 4px;
}

.swiper-pagination-bullet-active {
  background: #e74c3c !important;
  width: 12px;
  height: 12px;
}

@media (max-width: 768px) {
  .book-carousel {
    max-width: 90%;
  }
}
</style>
