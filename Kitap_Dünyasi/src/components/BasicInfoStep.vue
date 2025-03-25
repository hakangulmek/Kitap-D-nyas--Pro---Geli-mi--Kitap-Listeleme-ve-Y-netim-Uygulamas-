<template>
  <div class="form-container">
    <form @submit.prevent="validateAndSubmit" class="form-card">
      <h2 class="form-title">Kitap Bilgilerini Girin</h2>
      <div class="form-group">
        <label for="bookName">Kitap Adı</label>
        <input
          id="bookName"
          v-model="bookName"
          type="text"
          required
          placeholder="Kitap adını girin"
        />
      </div>
      <div class="form-group">
        <label for="author">Yazar</label>
        <input
          id="author"
          v-model="author"
          type="text"
          required
          placeholder="Yazar adını girin"
        />
      </div>
      <div class="form-group">
        <label for="coverImage">Kitap Kapağı Yükle</label>
        <input
          id="coverImage"
          type="file"
          @change="handleFileUpload"
          accept="image/*"
        />
        <div v-if="previewImage" class="image-preview">
          <img :src="previewImage" alt="Kitap Kapağı Önizleme" />
        </div>
      </div>
      <div class="form-actions">
        <button type="submit" class="submit-button">Sonraki Adım</button>
      </div>
    </form>
  </div>
</template>

<script>
import store from "@/store";

export default {
  data() {
    return {
      bookName: "",
      author: "",
      previewImage: null,
    };
  },
  computed: {
    bookFormData() {
      // Call the getter function
      return store.getters["booksEdit/getBookFormData"];
    },
    coverImage() {
      // Call the getter function
      return store.getters["booksEdit/getCoverImage"];
    },
  },
  mounted() {
    const savedData = this.bookFormData.basicInfo;
    if (savedData) {
      this.bookName = savedData.bookName || "";
      this.author = savedData.author || "";
    }
    this.previewImage = this.coverImage;
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        this.previewImage = e.target.result;

        // booksEdit modülündeki updateBookData action'ını çağırıyoruz
        store.dispatch("booksEdit/updateBookData", {
          step: "basicInfo",
          data: {
            coverImage: e.target.result,
          },
        });
      };

      reader.readAsDataURL(file);
    },
    validateAndSubmit() {
      if (this.bookName && this.author) {
        // booksEdit modülündeki updateBookData action'ını çağırıyoruz
        this.$store.dispatch("booksEdit/updateBookData", {
          step: "basicInfo",
          data: {
            bookName: this.bookName,
            author: this.author,
          },
        });
        this.$emit("next-step");
      }
    },
  },
};
</script>

<style scoped>
/* Genel form kapsayıcısı */
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f4f9;
  padding: 20px;
}

/* Form kartı */
.form-card {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 100%;
  max-width: 500px;
}

/* Başlık */
.form-title {
  font-size: 24px;
  font-weight: bold;
  color: #333333;
  text-align: center;
  margin-bottom: 20px;
}

/* Form grubu */
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

.form-group input[type="text"],
.form-group input[type="file"] {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s ease;
}

.form-group input[type="text"]:focus,
.form-group input[type="file"]:focus {
  border-color: #007bff;
}

/* Görsel önizleme */
.image-preview {
  margin-top: 15px;
  text-align: center;
}

.image-preview img {
  max-width: 100%;
  max-height: 150px;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* Form aksiyonları */
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
