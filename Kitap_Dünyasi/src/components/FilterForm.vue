<template>
  <div class="filter-container">
    <h3 class="filter-title">Filtrele</h3>

    <!-- Kategori Filtresi -->
    <div class="filter-section">
      <div class="filter-header" @click="toggleSection('category')">
        <h4>Kategori</h4>
        <span class="toggle-icon" :class="{ rotated: openSections.category }">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </div>
      <div class="filter-options" v-show="openSections.category">
        <label
          v-for="category in categories"
          :key="category.id"
          class="filter-option"
        >
          <input
            type="checkbox"
            :value="category.id"
            v-model="selectedCategories"
            @change="applyFilters"
          />
          <span class="checkbox-custom"></span>
          <span class="option-label">{{ category.name }}</span>
        </label>
      </div>
    </div>

    <!-- Dil Filtresi -->
    <div class="filter-section">
      <div class="filter-header" @click="toggleSection('language')">
        <h4>Dil</h4>
        <span class="toggle-icon" :class="{ rotated: openSections.language }">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </div>
      <div class="filter-options" v-show="openSections.language">
        <label
          v-for="language in languages"
          :key="language"
          class="filter-option"
        >
          <input
            type="checkbox"
            :value="language"
            v-model="selectedLanguages"
            @change="applyFilters"
          />
          <span class="checkbox-custom"></span>
          <span class="option-label">{{ language }}</span>
        </label>
      </div>
    </div>

    <!-- Yayın Yılı Aralığı Filtresi -->
    <div class="filter-section">
      <div class="filter-header" @click="toggleSection('year')">
        <h4>Yayın Yılı</h4>
        <span class="toggle-icon" :class="{ rotated: openSections.year }">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </div>
      <div class="year-range-container" v-show="openSections.year">
        <div class="year-inputs">
          <div class="input-group">
            <input
              type="number"
              v-model.number="yearRange.min"
              placeholder="Min"
              @change="applyFilters"
              class="year-input"
            />
          </div>

          <div class="input-group">
            <input
              type="number"
              v-model.number="yearRange.max"
              placeholder="Max"
              @change="applyFilters"
              class="year-input"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Sayfa Sayısı Filtresi -->
    <div class="filter-section">
      <div class="filter-header" @click="toggleSection('pages')">
        <h4>Sayfa Sayısı</h4>
        <span class="toggle-icon" :class="{ rotated: openSections.pages }">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </div>
      <div class="page-range-container" v-show="openSections.pages">
        <div class="range-slider">
          <div class="range-values">
            <span>{{ pageRange.min }}</span>
            <span>{{ pageRange.max }}</span>
          </div>
          <div class="slider-container">
            <div class="slider-track"></div>
            <input
              type="range"
              class="range-slider-min"
              v-model.number="pageRange.min"
              :min="pageRangeLimits.min"
              :max="pageRange.max"
              @input="updateRangeSlider"
            />
            <input
              type="range"
              class="range-slider-max"
              v-model.number="pageRange.max"
              :min="pageRange.min"
              :max="pageRangeLimits.max"
              @input="updateRangeSlider"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Filtreleri Uygula ve Temizle Butonları -->
    <div class="filter-actions">
      <button class="apply-filters" @click="applyFilters">Uygula</button>
      <button class="clear-filters" @click="clearFilters">Temizle</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";

const props = defineProps({
  books: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["filter-changed"]);

// Kategoriler
const categories = ref([
  { id: 1, name: "Roman" },
  { id: 2, name: "Bilim Kurgu" },
  { id: 3, name: "Tarih" },
  { id: 4, name: "Felsefe" },
  { id: 5, name: "Biyografi" },
]);

// Diller
const languages = ref(["Türkçe", "İngilizce", "Rusça", "Fransızca"]);

// Açık/kapalı bölümler
const openSections = reactive({
  category: true,
  language: true,
  year: true,
  pages: true,
});

// Seçilen filtreler
const selectedCategories = ref([]);
const selectedLanguages = ref([]);
const yearRange = reactive({
  min: null,
  max: null,
});
const pageRange = reactive({
  min: 0,
  max: 1000,
});
const pageRangeLimits = reactive({
  min: 0,
  max: 1000,
});

// Bölümleri açıp kapatma
const toggleSection = (section) => {
  openSections[section] = !openSections[section];
};

// Kitaplardan min/max değerleri hesapla
onMounted(() => {
  if (props.books && props.books.length > 0) {
    // Sayfa sayısı aralığını belirle
    const pages = props.books.map((book) => book.pageCount || 0);
    pageRangeLimits.min = Math.min(...pages);
    pageRangeLimits.max = Math.max(...pages);
    pageRange.min = pageRangeLimits.min;
    pageRange.max = pageRangeLimits.max;

    // Yayın yılı aralığını belirle
    const years = props.books.map((book) => book.publicationYear || 0);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    yearRange.min = minYear > 0 ? minYear : null;
    yearRange.max = maxYear > 0 ? maxYear : null;
  }

  // Range slider için ilk durum ayarı
  updateRangeSlider();
});

// Range slider güncelleme
const updateRangeSlider = () => {
  // Bu fonksiyon CSS değişkenlerini güncelleyerek
  // slider trackini görsel olarak düzenler
  nextTick(() => {
    const minPercent =
      ((pageRange.min - pageRangeLimits.min) /
        (pageRangeLimits.max - pageRangeLimits.min)) *
      100;
    const maxPercent =
      ((pageRange.max - pageRangeLimits.min) /
        (pageRangeLimits.max - pageRangeLimits.min)) *
      100;

    const sliderTrack = document.querySelector(".slider-track");
    if (sliderTrack) {
      sliderTrack.style.setProperty("--min-val", minPercent + "%");
      sliderTrack.style.setProperty("--max-val", maxPercent + "%");
    }

    applyFilters();
  });
};

// Filtreleri uygula
const applyFilters = () => {
  const filters = {
    categories: selectedCategories.value,
    languages: selectedLanguages.value,
    yearRange: {
      min: yearRange.min,
      max: yearRange.max,
    },
    pageRange: {
      min: pageRange.min,
      max: pageRange.max,
    },
  };

  emit("filter-changed", filters);
};

// Filtreleri temizle
const clearFilters = () => {
  selectedCategories.value = [];
  selectedLanguages.value = [];
  yearRange.min = null;
  yearRange.max = null;
  pageRange.min = pageRangeLimits.min;
  pageRange.max = pageRangeLimits.max;

  updateRangeSlider();
  applyFilters();
};

// Vue 3 import için gerekli
import { nextTick } from "vue";
</script>

<style scoped>
.filter-container {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.filter-title {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 20px;
  color: #333;
  position: relative;
  display: inline-block;
  font-weight: 600;
}

.filter-title:after {
  content: "";
  position: absolute;
  width: 70%;
  height: 3px;
  background: #e74c3c;
  bottom: -8px;
  left: 0;
}

.filter-section {
  margin-bottom: 16px;
  border-bottom: 1px solid #eee;
  padding-bottom: 16px;
}

.filter-section:last-child {
  border-bottom: none;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 5px 0;
  transition: all 0.2s;
}

.filter-header:hover {
  color: #e74c3c;
}

.filter-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: inherit;
}

.toggle-icon {
  transition: transform 0.3s ease;
}

.toggle-icon.rotated {
  transform: rotate(180deg);
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 10px 0;
  max-height: 200px;
  overflow-y: auto;
}

/* Özel checkbox stillemesi */
.filter-option {
  display: flex;
  align-items: center;
  font-size: 14px;
  position: relative;
  padding-left: 28px;
  cursor: pointer;
  user-select: none;
}

.filter-option input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkbox-custom {
  position: absolute;
  top: 0;
  left: 0;
  height: 18px;
  width: 18px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: all 0.2s;
}

.filter-option:hover .checkbox-custom {
  background-color: #eee;
  border-color: #ccc;
}

.filter-option input:checked ~ .checkbox-custom {
  background-color: #e74c3c;
  border-color: #e74c3c;
}

.checkbox-custom:after {
  content: "";
  position: absolute;
  display: none;
}

.filter-option input:checked ~ .checkbox-custom:after {
  display: block;
  left: 6px;
  top: 2px;
  width: 4px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.option-label {
  margin-left: 8px;
}

/* Yayın Yılı input stil */
.year-range-container {
  padding: 10px 0;
  width: 235px;
}

.year-inputs {
  display: flex;
  align-items: center;
  gap: 35px;
}

.input-group {
  flex: 1;
}

.year-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border 0.3s;
}

.year-input:focus {
  border-color: #e74c3c;
  outline: none;
}

/* Range slider stilleri */
.page-range-container {
  padding: 16px 0;
}

.range-slider {
  position: relative;
  width: 100%;
}

.range-values {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
}

.slider-container {
  position: relative;
  width: 100%;
  height: 35px;
}

.slider-track {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 5px;
  width: 100%;
  background: #ddd;
  border-radius: 4px;
}

.slider-track::before {
  content: "";
  position: absolute;
  height: 100%;
  left: var(--min-val, 0%);
  right: calc(100% - var(--max-val, 100%));
  background: #e74c3c;
  border-radius: 4px;
}

.range-slider-min,
.range-slider-max {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  height: 5px;
  background: transparent;
  z-index: 2;
}

.range-slider-min::-webkit-slider-thumb,
.range-slider-max::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #e74c3c;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.range-slider-min::-moz-range-thumb,
.range-slider-max::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #e74c3c;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

/* Butonlar */
.filter-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.apply-filters,
.clear-filters {
  flex: 1;
  padding: 10px 15px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  font-size: 14px;
}

.apply-filters {
  background-color: #e74c3c;
  color: white;
}

.apply-filters:hover {
  background-color: #d44133;
}

.clear-filters {
  background-color: #f8f8f8;
  color: #333;
  border: 1px solid #ddd;
}

.clear-filters:hover {
  background-color: #eee;
}
</style>
