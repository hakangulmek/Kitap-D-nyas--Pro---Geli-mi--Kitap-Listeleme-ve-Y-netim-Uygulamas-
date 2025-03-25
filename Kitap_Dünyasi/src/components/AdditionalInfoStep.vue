<template>
  <div class="form-container">
    <form @submit.prevent="validateAndSubmit" class="form-card">
      <h2 class="form-title">Ek Bilgiler</h2>
      <div class="form-group">
        <label for="summary">Kitap Özeti</label>
        <textarea
          id="summary"
          v-model="summary"
          rows="4"
          placeholder="Kitap özetini girin"
          required
        ></textarea>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: ["price"],
  data() {
    return {
      summary: "",
      exchangeRate: 0,
    };
  },
  computed: {
    priceInUSD() {
      return (this.price / this.exchangeRate).toFixed(2);
    },
  },
  mounted() {
    // Döviz kuru API'sinden USD kurunu alıyoruz
    fetch("https://api.exchangerate-api.com/v4/latest/TRY")
      .then((response) => response.json())
      .then((data) => {
        this.exchangeRate = data.rates.USD;
      });
  },
  methods: {
    ...mapActions("booksEdit", ["updateBookData"]),
    validateAndSubmit() {
      if (this.summary) {
        // Verileri Vuex mağazasına kaydediyoruz
        this.updateBookData({
          step: "additionalInfo",
          data: {
            summary: this.summary,
            priceInUSD: this.priceInUSD,
          },
        });

        // Kaydetme işlemi tamamlandıktan sonra bir sonraki adıma geçebiliriz
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
