<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';

import cellarmasters from '@/assets/logos/companies/region-12/cellarmasters-modal.jpg';
import dummyLogo from "@/assets/logos/dummy.jpg";

const modalMap = {
  'cellermasters': cellarmasters,
  'default': dummyLogo
};

const props = defineProps({
  company: {
    type: Object,
    default: () => ({})
  },
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const currentCompany = ref(null);

watch(() => props.company, (newCompany) => {
  if (newCompany) {
    currentCompany.value = newCompany;
  }
}, { immediate: true, deep: true });

const backgroundImage = computed(() => {
  if (!currentCompany.value) return modalMap.default;

  if (currentCompany.value.name) {
    const companyName = String(currentCompany.value.name).toLowerCase();
    for (const key of Object.keys(modalMap)) {
      if (key !== 'default' && companyName.includes(key)) {
        return modalMap[key];
      }
    }
  }

  return modalMap.default;
});

const handleClose = () => {
  emit('close');
};

const handleKeyDown = (event) => {
  if (event.key === 'Escape') {
    handleClose();
  }
};

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown);
  }
});

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeyDown);
  }
});
</script>

<template>
  <transition name="modal-fade">
    <div v-if="isOpen" class="modal-overlay" @click="handleClose">
      <div
          class="modal-content"
          :style="`background-image: url(${backgroundImage})`"
          @click.stop
      >
        <button class="close-button" @click="handleClose">&times;</button>
      </div>
    </div>
  </transition>
</template>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  width: 75%;
  height: 75%;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 32px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 10;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
    transform: scale(1.1);
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Responsive styles */
@media screen and (max-width: 1920px) {
  .modal-header {
    padding: 15px;
  }

  .modal-header h2 {
    font-size: 1.8rem;
  }

  .close-button {
    font-size: 28px;
    width: 40px;
    height: 40px;
    top: 12px;
    right: 12px;
  }
}

@media screen and (min-width: 1921px) and (max-width: 2560px) {
  .close-button {
    font-size: 32px;
    width: 48px;
    height: 48px;
  }
}

@media screen and (min-width: 2561px) {
  .close-button {
    font-size: 38px;
    width: 60px;
    height: 60px;
    top: 20px;
    right: 20px;
  }
}
</style>