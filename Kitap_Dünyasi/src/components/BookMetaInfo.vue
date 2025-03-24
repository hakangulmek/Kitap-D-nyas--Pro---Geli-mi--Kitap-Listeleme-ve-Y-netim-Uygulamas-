<template>
  <div class="meta-info">
    <h3>Kitap Bilgileri</h3>
    <div class="info-grid">
      <div class="info-item">
        <span class="label">ISBN:</span>
        <span class="value">{{ book.isbn }}</span>
      </div>
      <div class="info-item">
        <span class="label">Sayfa Sayısı:</span>
        <span class="value">{{ book.pageCount }}</span>
      </div>
      <div class="info-item">
        <span class="label">Basım Tarihi:</span>
        <span class="value">{{ formatDate(book.publicationDate) }}</span>
      </div>
      <div class="info-item">
        <span class="label">Yayınevi:</span>
        <span class="value">{{ book.publisher }}</span>
      </div>
      <div class="info-item">
        <span class="label">Dil:</span>
        <span class="value">{{ book.language }}</span>
      </div>
      <div class="info-item">
        <span class="label">Kategori:</span>
        <span class="value">{{ book.category }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  book: {
    type: Object,
    required: true,
  },
});

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("tr-TR");
};
</script>

<style scoped>
.meta-info {
  margin: 20px 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.label {
  font-weight: bold;
  color: #666;
}

.value {
  color: #333;
}
</style>
