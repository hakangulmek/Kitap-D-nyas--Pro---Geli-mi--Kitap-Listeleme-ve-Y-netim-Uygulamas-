<template>
  <div class="form-container">
    <form @submit.prevent="validateAndSubmit" class="form-card">
      <h2 class="form-title">Detaylı Bilgiler</h2>
      <div class="form-group">
        <label for="genre">Kitap Türü</label>
        <select id="genre" v-model="genre" required>
          <option value="" disabled>Tür seçin</option>
          <option value="roman">Roman</option>
          <option value="bilim">Bilim</option>
          <option value="tarih">Tarih</option>
        </select>
      </div>
      <div class="form-group">
        <label for="description">Açıklama</label>
        <textarea
          id="description"
          v-model="description"
          rows="4"
          placeholder="Kitap açıklamasını girin"
          required
        ></textarea>
      </div>
      <div class="form-group">
        <label for="price">Fiyat (TL)</label>
        <input
          id="price"
          v-model="price"
          type="number"
          placeholder="Fiyatı girin"
          required
        />
      </div>
      <div class="form-actions">
        <button type="submit" class="submit-button">Sonraki Adım</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      genre: "",
      description: "",
      price: 0,
    };
  },
  methods: {
    validateAndSubmit() {
      if (this.genre && this.description && this.price > 0) {
        this.$emit("next-step");
      }
    },
  },
};
</script>

<style scoped>
/* BasicInfoStep ile uyumlu modern tasarım */
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f4f9;
  padding: 20px;
}

.form-card {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 100%;
  max-width: 500px;
}

.form-title {
  font-size: 24px;
  font-weight: bold;
  color: #333333;
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #555555;
  margin-bottom: 8px;
}

.form-group select,
.form-group textarea,
.form-group input {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s ease;
}

.form-group select:focus,
.form-group textarea:focus,
.form-group input:focus {
  border-color: #007bff;
}

.form-actions {
  text-align: right;
}

.submit-button {
  background-color: #007bff;
  color: #ffffff;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #0056b3;
}
</style>
