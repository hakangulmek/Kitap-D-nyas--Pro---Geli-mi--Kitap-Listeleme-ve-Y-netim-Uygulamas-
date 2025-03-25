<template>
  <div class="wizard-container">
    <div class="steps">
      <div
        v-for="(step, index) in steps"
        :key="index"
        :class="['step', { active: currentStep === index }]"
        @click="goToStep(index)"
      >
        {{ step.label }}
      </div>
    </div>
    <div class="step-content">
      <component
        :is="steps[currentStep].component"
        @next-step="nextStep"
        @previous-step="previousStep"
      />
    </div>
    <div class="actions">
      <button v-if="currentStep > 0" @click="previousStep">Geri</button>
      <button v-if="currentStep < steps.length - 1" @click="nextStep">
        İleri
      </button>
      <button v-if="currentStep === steps.length - 1" @click="submitForm">
        Kaydet
      </button>
    </div>
  </div>
</template>

<script>
import BasicInfoStep from "../components/BasicInfoStep.vue";
import DetailedInfoStep from "../components/DetailedInfoStep.vue";
import AdditionalInfoStep from "../components/AdditionalInfoStep.vue";

export default {
  data() {
    return {
      currentStep: 0,
      steps: [
        { label: "Temel Bilgiler", component: BasicInfoStep },
        { label: "Detaylı Bilgiler", component: DetailedInfoStep },
        { label: "Ek Bilgiler", component: AdditionalInfoStep },
      ],
    };
  },
  methods: {
    nextStep() {
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
      }
    },
    previousStep() {
      if (this.currentStep > 0) {
        this.currentStep--;
      }
    },
    goToStep(index) {
      this.currentStep = index;
    },
    submitForm() {
      alert("Form başarıyla kaydedildi!");
    },
  },
};
</script>

<style scoped>
.wizard-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.step {
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}
.step.active {
  background: #007bff;
  color: #fff;
}
.step-content {
  margin-bottom: 20px;
}
.actions {
  display: flex;
  justify-content: space-between;
}
button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background: #0056b3;
  color: #fff;
}
</style>
