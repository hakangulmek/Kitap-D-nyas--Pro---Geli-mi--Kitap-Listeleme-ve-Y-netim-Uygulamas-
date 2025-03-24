<template>
  <div class="form-container">
    <form @submit.prevent="validateAndSubmit" class="form-card">
      <h2 class="form-title">Kitap Detaylarını Girin</h2>
      <div class="form-group">
        <label for="genre">Tür</label>
        <input
          id="genre"
          v-model="genre"
          type="text"
          required
          placeholder="Kitap türünü girin"
        />
      </div>
      <div class="form-group">
        <label for="description">Açıklama</label>
        <textarea
          id="description"
          v-model="description"
          required
          placeholder="Kitap açıklamasını girin"
          rows="4"
        ></textarea>
      </div>
      <div class="form-actions">
        <button type="submit" class="submit-button">Sonraki Adım</button>
      </div>
    </form>
  </div>
</template>

<script>
import { useStore } from "vuex";

export default {
  data() {
    return {
      genre: "",
      description: "",
    };
  },
  methods: {
    validateAndSubmit() {
      if (this.genre && this.description) {
        this.store.dispatch("updateBookData", {
          step: "detailedInfo",
          data: {
            genre: this.genre,
            description: this.description,
          },
        });
        this.$emit("next-step");
      }
    },
  },
  setup() {
    const store = useStore();
    return { store };
  },
};
</script>

<style scoped>
/* CSS kodları aynı kalabilir */
</style>
