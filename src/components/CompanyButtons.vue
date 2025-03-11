<script setup>
import LazyImage from './ui/LazyImage.vue';

const props = defineProps({
  companies: {
    type: Array,
    default: () => []
  },
  companyLogo: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['open-modal']);

const openModal = (company) => {
  emit('open-modal', company);
};
</script>

<template>
  <div class="buttons-section">
    <div class="buttons-grid">
      <button
          v-for="company in companies"
          :key="company.id"
          class="company-button"
          @click="openModal(company)"
      >
        <LazyImage
            :key="'company-' + company.id"
            :src="companyLogo"
            :alt="company ? company.name : 'Company'"
            :img-class="'company-logo'"
        />
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.buttons-section {
  flex: 1;
  background-image: url('@/assets/bg.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;

  .buttons-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    width: 100%;
    justify-content: center;
  }

  .company-button {
    background: none;
    border: none;
    cursor: pointer;
    transition: transform 0.2s ease;
    border-radius: 8px;
    overflow: hidden;
    width: 300px;
    height: 300px;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }

    .company-logo {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>