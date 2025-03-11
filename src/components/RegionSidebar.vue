<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  wineRegions: {
    type: Array,
    required: true
  },
  selectedRegion: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['select-region']);

const rippleInterval = ref(null);

const showRippleOnFirstItem = computed(() => {
  return !props.selectedRegion;
});

const showRippleOnReturnButton = computed(() => {
  return !!props.selectedRegion;
});

const selectRegion = (region) => {
  emit('select-region', region);

  if (rippleInterval.value) {
    clearInterval(rippleInterval.value);
    rippleInterval.value = null;
  }

  startRippleEffect();
};

const startRippleEffect = () => {
  rippleInterval.value = setInterval(() => {
    const rippleElement = document.querySelector('.ripple-container');
    if (rippleElement) {
      rippleElement.classList.remove('animate-ripple');
      void rippleElement.offsetWidth;
      rippleElement.classList.add('animate-ripple');
    }
  }, 3000);
};

onMounted(() => {
  startRippleEffect();
});

onBeforeUnmount(() => {
  if (rippleInterval.value) {
    clearInterval(rippleInterval.value);
  }
});
</script>

<template>
  <div class="sidebar">
    <ul class="region-list">
      <li
          v-for="region in wineRegions"
          :key="region.id"
          :class="{
          active: selectedRegion?.id === region.id,
          disabled: region.clickable === false,
          'first-item': region.id === 1 && showRippleOnFirstItem
        }"
          @click="region.clickable !== false && selectRegion(region)"
      >
        <div class="region-item">
          <span class="region-number">{{ region.id }}.</span>
          <span class="region-name">{{ region.name }}</span>
          <img :src="region.logo" :alt="region.name" class="region-logo" />

          <div v-if="region.id === 1 && showRippleOnFirstItem" class="ripple-container"></div>
        </div>
      </li>
      <li
          @click="selectRegion(null)"
          :class="{ 'return-item': showRippleOnReturnButton }"
      >
        <div class="region-item return">
          <span class="return-text">Return to map</span>
          <span class="return-arrow">↩</span>
          <div v-if="showRippleOnReturnButton" class="ripple-container"></div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
/* Variables para reutilización */
$color-bg-light: #ebebeb;
$color-bg-dark: #595758;
$color-border: #ddd;
$color-active: #aedae7;
$color-hover: #e0e0e0;

/* Mixins para reutilización */
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Animaciones */
@keyframes ripple {
  0% {
    width: 0;
    height: 0;
    opacity: 0.8;
    box-shadow: 0 0 0 0 rgba(74, 178, 222, 0.7);
  }

  70% {
    width: 250px;
    height: 250px;
    opacity: 0;
    box-shadow: 0 0 0 45px rgba(74, 178, 222, 0);
  }
}

.sidebar {
  background-color: #d7d7d7;
  overflow-y: auto;
  border-right: 1px solid $color-border;
  width: 100%;
  @include flex-center;
}

.region-list {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  li {
    &.active .region-item {
      background-color: $color-active;
      font-weight: bold;
      transition: background-color 0.3s ease;
    }

    &.disabled {
      opacity: 0.6;
      cursor: not-allowed;

      .region-item {
        cursor: not-allowed;
      }
    }

    &.return-item, &.first-item {
      position: relative;
      overflow: hidden;
    }
  }
}

.region-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid $color-border;
  background-color: $color-bg-light;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    background-color: $color-hover;
  }

  .region-number {
    font-weight: bold;
  }

  .region-name {
    flex: 1;
  }

  .region-logo {
    object-fit: contain;
  }

  &.return {
    display: flex;
    justify-content: space-between;
    position: relative;
  }

  .return-text, .return-arrow {
    font-weight: bold;
  }
}

.ripple-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background-color: rgba(0, 0, 0, 0);
  border-radius: 50%;
  pointer-events: none;
}

.animate-ripple {
  animation: ripple 3s ease-out;
}

/* Responsive styles */
@media screen and (max-width: 1920px) {
  .region-list {
    width: 65%;
  }

  .region-item {
    padding: 5px 15px;
    height: 55px;

    .region-number {
      margin-right: 12px;
      font-size: 1rem;
    }

    .region-name {
      font-size: 1.1rem;
    }

    .region-logo {
      height: 65px;
      max-width: 95px;
      margin-right: -20px;
    }

    &.return {
      padding: 16px 20px;
    }

    .return-text {
      font-size: 1.3rem;
      margin: 0 5px 5px 0;
    }

    .return-arrow {
      font-size: 1.4rem;
      margin: 6px 5px 5px 0;
    }
  }

  @keyframes ripple {
    0% {
      width: 0;
      height: 0;
      opacity: 0.8;
      box-shadow: 0 0 0 0 rgba(74, 178, 222, 0.7);
    }

    70% {
      width: 250px;
      height: 250px;
      opacity: 0;
      box-shadow: 0 0 0 45px rgba(74, 178, 222, 0);
    }
  }
}

@media screen and (min-width: 1921px) and (max-width: 2560px) {
  .region-list {
    width: 75%;
  }

  .region-item {
    padding: 10px 20px;
    height: 70px;

    .region-number {
      margin-right: 20px;
      font-size: 1.6rem;
    }

    .region-name {
      font-size: 1.5rem;
    }

    .region-logo {
      height: 70px;
      max-width: 110px;
      margin-right: -22px;
    }

    &.return {
      padding: 18px 22px;
    }

    .return-text {
      font-size: 2rem;
      margin: 0 5px 5px 0;
    }

    .return-arrow {
      font-size: 2.5rem;
      margin: 10px 5px 5px 0;
    }
  }

  @keyframes ripple {
    0% {
      width: 0;
      height: 0;
      opacity: 0.8;
      box-shadow: 0 0 0 0 rgba(74, 178, 222, 0.7);
    }

    70% {
      width: 320px;
      height: 320px;
      opacity: 0;
      box-shadow: 0 0 0 60px rgba(74, 178, 222, 0);
    }
  }
}

@media screen and (min-width: 2561px) {
  .region-list {
    width: 65%;
  }

  .region-item {
    padding: 20px 25px;
    height: 100px;

    .region-number {
      margin-right: 30px;
      font-size: 2.2rem;
    }

    .region-name {
      font-size: 1.9rem;
    }

    .region-logo {
      height: 80px;
      max-width: 120px;
      margin-right: -25px;
    }

    &.return {
      padding: 20px 25px;
    }

    .return-text {
      font-size: 3rem;
      margin: 0 5px 5px 0;
    }

    .return-arrow {
      font-size: 3rem;
      margin: 14px 5px 5px 0;
    }
  }

  @keyframes ripple {
    0% {
      width: 0;
      height: 0;
      opacity: 0.8;
      box-shadow: 0 0 0 0 rgba(74, 178, 222, 0.7);
    }

    70% {
      width: 400px;
      height: 400px;
      opacity: 0;
      box-shadow: 0 0 0 70px rgba(74, 178, 222, 0);
    }
  }
}
</style>