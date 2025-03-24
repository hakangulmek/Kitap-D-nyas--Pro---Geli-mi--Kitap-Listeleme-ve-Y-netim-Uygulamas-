<template>
  <div class="book-form-container max-w-2xl mx-auto">
    <div class="bg-white shadow-lg rounded-lg p-8">
      <div class="steps-indicator flex mb-6">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="step flex-1 text-center py-2 mx-2 rounded"
          :class="{
            'bg-blue-500 text-white': currentStep === index,
            'bg-gray-200 text-gray-600': currentStep !== index,
          }"
        >
          {{ step }}
        </div>
      </div>

      <component
        :is="currentStepComponent"
        @next-step="nextStep"
        @prev-step="prevStep"
      ></component>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import BasicInfoStep from "@/components/BookFormSteps/BasicInfoStep.vue";

export default {
  components: {
    BasicInfoStep,
  },
  data() {
    return {
      steps: ["Temel Bilgiler", "Detaylı Bilgiler", "Ek Bilgiler"],
    };
  },
  computed: {
    ...mapGetters(["getCurrentStep"]),
    currentStep() {
      return this.getCurrentStep;
    },
    currentStepComponent() {
      const stepComponents = [
        BasicInfoStep,
        DetailedInfoStep,
        AdditionalInfoStep,
      ];
      return stepComponents[this.currentStep];
    },
  },
  methods: {
    ...mapActions(["setCurrentStep"]),
    nextStep() {
      if (this.currentStep < this.steps.length - 1) {
        this.setCurrentStep(this.currentStep + 1);
      }
    },
    prevStep() {
      if (this.currentStep > 0) {
        this.setCurrentStep(this.currentStep - 1);
      }
    },
  },
};
</script>
