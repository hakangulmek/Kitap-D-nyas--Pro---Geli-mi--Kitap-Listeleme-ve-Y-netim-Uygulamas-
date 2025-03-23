<template>
  <div class="book-page">
    <!-- Carousel Bölümü -->
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
        :breakpoints="{
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
        }"
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

    <!-- Kitap Kartları ve Filtre Bölümü -->
    <div class="book-content-container">
      <!-- Sol kenar çubuğu - Görünüm, Sıralama ve Filtre -->
      <div class="sidebar">
        <!-- Yeni Görünüm Modu Komponenti -->
        <ViewModeToggle
          :initial-mode="viewMode"
          @update:view-mode="viewMode = $event"
        />

        <!-- Sıralama Komponenti -->
        <SortingOptions
          :initial-sort="sortConfig.sortBy"
          :initial-direction="sortConfig.direction"
          @sort-changed="handleSortChange"
        />

        <!-- Filtre Komponenti -->
        <BookFilter :books="books" @filter-changed="handleFilterChange" />
      </div>

      <!-- Kitap Kartları -->
      <div class="book-cards-container">
        <h2>Tüm Kitaplar</h2>

        <!-- Grid Görünümü -->
        <div v-if="viewMode === 'grid'" class="book-cards-grid">
          <BookCard
            v-for="book in sortedAndFilteredBooks"
            :key="book.id"
            :book="{
              id: book.id,
              title: book.title,
              author: book.author,
              description:
                book.description || 'Kitap açıklaması bulunmamaktadır.',
              price: book.price,
              imageUrl: book.coverImage,
            }"
            :is-favorite="isFavorite(book.id)"
            @toggle-favorite="handleToggleFavorite"
            @add-to-cart="handleAddToCart"
          />
        </div>

        <!-- Liste Görünümü -->
        <div v-else class="book-list">
          <BookListItem
            v-for="book in sortedAndFilteredBooks"
            :key="book.id"
            :book="{
              id: book.id,
              title: book.title,
              author: book.author,
              description:
                book.description || 'Kitap açıklaması bulunmamaktadır.',
              price: book.price,
              imageUrl: book.coverImage,
            }"
            :is-favorite="isFavorite(book.id)"
            @toggle-favorite="handleToggleFavorite"
            @add-to-cart="handleAddToCart"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { useStore } from "vuex";
import { ref, computed } from "vue";

import books from "@/data/book";
import BookCard from "@/components/BookCard.vue";
import BookFilter from "@/components/FilterForm.vue";
import SortingOptions from "@/components/SortingOptins.vue";
import ViewModeToggle from "@/components/ViewModToogle.vue"; // Yeni eklenen görünüm modu komponenti
// Yeni eklenen liste görünümü komponenti

const store = useStore();

// Görünüm modu state'i
const viewMode = ref("grid"); // Varsayılan olarak grid görünümü

const activeFilters = ref({
  categories: [],
  languages: [],
  yearRange: { min: null, max: null },
  pageRange: { min: 0, max: 1000 },
});

// Sıralama yapılandırması
const sortConfig = ref({
  sortBy: "title",
  direction: "asc",
});

// Filtreleme işlemi
const filteredBooks = computed(() => {
  return books.filter((book) => {
    // Kategori filtresi
    if (
      activeFilters.value.categories.length > 0 &&
      !activeFilters.value.categories.includes(book.categoryId)
    ) {
      return false;
    }

    // Dil filtresi
    if (
      activeFilters.value.languages.length > 0 &&
      !activeFilters.value.languages.includes(book.language)
    ) {
      return false;
    }

    // Yayın yılı filtresi
    const minYear = activeFilters.value.yearRange.min;
    const maxYear = activeFilters.value.yearRange.max;
    if (minYear && book.publicationYear < minYear) {
      return false;
    }
    if (maxYear && book.publicationYear > maxYear) {
      return false;
    }

    // Sayfa sayısı filtresi
    if (
      book.pageCount < activeFilters.value.pageRange.min ||
      book.pageCount > activeFilters.value.pageRange.max
    ) {
      return false;
    }

    return true;
  });
});

// Sıralanmış ve filtrelenmiş kitaplar
const sortedAndFilteredBooks = computed(() => {
  const books = [...filteredBooks.value];

  const { sortBy, direction } = sortConfig.value;
  const multiplier = direction === "asc" ? 1 : -1;

  return books.sort((a, b) => {
    if (sortBy === "price") {
      return (a.price - b.price) * multiplier;
    } else if (sortBy === "publicationYear") {
      return (a.publicationYear - b.publicationYear) * multiplier;
    } else {
      // title
      return a.title.localeCompare(b.title, "tr") * multiplier;
    }
  });
});

const handleToggleFavorite = (book) => {
  store.dispatch("favorites/toggleFavorite", book);
};

const isFavorite = (bookId) => {
  return store.getters["favorites/isFavorite"](bookId);
};

const handleAddToCart = (bookId) => {
  console.log(`Sepete eklenen kitap ID: ${bookId}`);
  // Burada sepete ekleme işlemleri yapılabilir
};

const handleFilterChange = (filters) => {
  activeFilters.value = filters;
};

const handleSortChange = (sort) => {
  sortConfig.value = sort;
};
</script>

<style scoped>
/* Carousel Stilleri */
.book-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.book-carousel {
  max-width: 900px;
  margin: 0 auto 40px;
  text-align: center;
  position: relative;
  height: auto;
}

.book-carousel h2,
.book-cards-container h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
  position: relative;
  display: inline-block;
}

.book-carousel h2:after,
.book-cards-container h2:after {
  content: "";
  position: absolute;
  width: 50%;
  height: 3px;
  background: #e74c3c;
  bottom: -8px;
  left: 25%;
}

/* Swiper Stilleri */
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
  text-align: center;
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

/* Swiper stilleri */
.mySwiper {
  position: relative;
  padding-bottom: 10px;
  height: 400px;
}

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

/* Kitap Kartları ve Filtre Alanı - Yeniden düzenlendi */
.book-content-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 30px;
  margin-top: 60px;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.book-cards-container {
  text-align: center;
}

.book-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 50px;
  margin-top: 30px;
}

.book-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 30px;
}

/* Responsive Tasarım */
@media (max-width: 1024px) {
  .book-content-container {
    grid-template-columns: 1fr;
  }

  .sidebar {
    order: -1;
    position: static;
    margin-bottom: 30px;
  }
}

@media (max-width: 768px) {
  .book-carousel {
    max-width: 90%;
  }

  .book-cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 480px) {
  .book-cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
