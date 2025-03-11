<script setup>
import LazyImage from './ui/LazyImage.vue';
import { computed } from 'vue';

const props = defineProps({
  region: {
    type: Object,
    required: true
  }
});

const backgroundColor = computed(() => {
  return props.region?.backgroundColor || '#FFFFFF';
});

const regionTitle = computed(() => {
  return `${props.region?.id || ''}. ${props.region?.shortName || ''}`;
});
</script>

<template>
  <div class="header-section" :style="'background-color:' + backgroundColor">
    <transition name="fade" mode="out-in">
      <p :key="regionTitle" class="region-title">{{ regionTitle }}</p>
    </transition>
    <div class="logo-container">
      <transition name="slow-fade" mode="out-in">
        <LazyImage
          :key="'region-' + (region?.mapRegionId || 'default')"
          :src="region?.logo"
          :alt="region ? region.name : 'Wines from Castilla y León'"
          :img-class="'map-image'"
        />
      </transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header-section {
  height: 35%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .region-title {
    font-size: 4rem;
    margin-bottom: 2rem;
  }

  .logo-container {
    width: 100%;
    height: 330px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;

    img,
    .map-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      transition: opacity 0.3s ease;
    }
  }

  .logo-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #f0f0f0;
    opacity: 0.6;
    z-index: -1;
  }
}

/* Responsive styles */
@media screen and (max-width: 1920px) {
  .header-section {
    .region-title {
      font-size: 2.2rem;
      margin-bottom: 1.5rem;
    }

    .logo-container {
      height: 250px;
    }
  }
}

@media screen and (min-width: 1921px) and (max-width: 2560px) {
  .header-section {
    .region-title {
      font-size: 3rem;
      margin-bottom: 1.8rem;
    }

    .logo-container {
      height: 290px;
    }
  }
}

@media screen and (min-width: 2561px) {
  .header-section {
    .region-title {
      font-size: 4.5rem;
      margin-bottom: 2.5rem;
    }

    .logo-container {
      height: 380px;
    }
  }
}
</style>