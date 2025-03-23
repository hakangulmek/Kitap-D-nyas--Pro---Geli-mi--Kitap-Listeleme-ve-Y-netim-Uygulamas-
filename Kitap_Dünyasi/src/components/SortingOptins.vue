<template>
  <div class="sorting-options">
    <h3>Sıralama</h3>
    <div class="sorting-container">
      <div
        v-for="option in sortOptions"
        :key="option.value"
        :class="['sort-option', { active: currentSort === option.value }]"
        @click="selectSort(option.value)"
      >
        <span class="sort-label">{{ option.label }}</span>
        <span
          v-if="currentSort === option.value"
          class="sort-direction"
          @click.stop="toggleDirection"
        >
          {{ sortDirection === "asc" ? "↑" : "↓" }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  initialSort: {
    type: String,
    default: "title",
  },
  initialDirection: {
    type: String,
    default: "asc",
  },
});

const emit = defineEmits(["sort-changed"]);

const currentSort = ref(props.initialSort);
const sortDirection = ref(props.initialDirection);

const sortOptions = [
  { label: "İsim", value: "title" },
  { label: "Fiyat", value: "price" },
  { label: "Yayın Tarihi", value: "publicationYear" },
];

const selectSort = (sortValue) => {
  if (currentSort.value === sortValue) {
    toggleDirection();
  } else {
    currentSort.value = sortValue;
    sortDirection.value = "asc";
  }

  emit("sort-changed", {
    sortBy: currentSort.value,
    direction: sortDirection.value,
  });
};

const toggleDirection = () => {
  sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";

  emit("sort-changed", {
    sortBy: currentSort.value,
    direction: sortDirection.value,
  });
};
</script>

<style scoped>
.sorting-options {
  background: white;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

h3 {
  color: #333;
  font-size: 18px;
  margin-bottom: 15px;
  position: relative;
  display: inline-block;
}

h3:after {
  content: "";
  position: absolute;
  width: 50%;
  height: 3px;
  background: #e74c3c;
  bottom: -8px;
  left: 0;
}

.sorting-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
}

.sort-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sort-option:hover {
  background-color: #f5f5f5;
}

.sort-option.active {
  background-color: #f0f0f0;
  font-weight: bold;
  color: #e74c3c;
}

.sort-direction {
  font-weight: bold;
  font-size: 16px;
}
</style>
