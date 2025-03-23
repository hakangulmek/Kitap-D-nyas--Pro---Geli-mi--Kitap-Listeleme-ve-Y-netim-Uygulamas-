<template>
  <div class="view-mode-toggle">
    <h3>Görünüm</h3>
    <div class="toggle-buttons">
      <button
        :class="['toggle-button', { active: currentMode === 'grid' }]"
        @click="setViewMode('grid')"
        aria-label="Grid görünümü"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
        <span>Grid</span>
      </button>
      <button
        :class="['toggle-button', { active: currentMode === 'list' }]"
        @click="setViewMode('list')"
        aria-label="Liste görünümü"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
        <span>Liste</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  initialMode: {
    type: String,
    default: "grid",
    validator: (value) => ["grid", "list"].includes(value),
  },
});

const emit = defineEmits(["update:viewMode"]);

const currentMode = ref(props.initialMode);

const setViewMode = (mode) => {
  currentMode.value = mode;
  emit("update:viewMode", mode);
};
</script>

<style scoped>
.view-mode-toggle {
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

.toggle-buttons {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.toggle-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid #ddd;
  background-color: #f8f8f8;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
}

.toggle-button:hover {
  background-color: #f0f0f0;
}

.toggle-button.active {
  background-color: #e74c3c;
  color: white;
  border-color: #e74c3c;
}

.toggle-button span {
  font-weight: 500;
}
</style>
