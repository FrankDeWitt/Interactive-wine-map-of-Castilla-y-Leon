<script setup>
import { computed } from 'vue';
import LazyImage from './ui/LazyImage.vue';
import LegendInfo from './LegendInfo.vue';

// Importaciones de imágenes
import europaMap from '../assets/images/europa.jpg';
import spainMap from '../assets/images/spain.jpg';

const props = defineProps({
  selectedRegion: {
    type: Object,
    default: null
  },
  getRegionMapImage: {
    type: Function,
    required: true
  }
});

const showDetailMap = computed(() => {
  return !!props.selectedRegion;
});

const regionMapImage = computed(() => {
  if (props.selectedRegion) {
    return props.getRegionMapImage(props.selectedRegion.mapRegionId);
  }
  return '';
});
</script>

<template>
  <div class="right-column">
    <div class="right-title">
      <div class="title-container">
        <div class="title-line">WINE MAP OF</div>
        <div class="title-line bold">CASTILLA Y LEÓN</div>
        <div class="title-line">SPAIN</div>
      </div>
    </div>

    <LegendInfo />

    <div class="static-image">
      <img v-show="showDetailMap" class="custom-spain" :src="spainMap" alt="Mapa de España"/>
      <img v-show="!showDetailMap" :src="europaMap" alt="Mapa de europa"/>
    </div>

    <div class="gap-image"/>

    <div class="dynamic-image">
      <LazyImage
          v-show="showDetailMap"
          :key="'map-detail'"
          :src="regionMapImage"
          :alt="selectedRegion?.name || ''"
          :img-class="'dynamic-map-image'"
      />
      <LazyImage
          v-show="!showDetailMap"
          :key="'default-map-detail'"
          :src="spainMap"
          :alt="'Mapa de España'"
          :img-class="'dynamic-map-image'"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
/* Variables para reutilización */
$color-bg-lighter: #f9f9f9;
$color-bg-dark: #595758;
$color-border: #ddd;

/* Mixins para reutilización */
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin full-size {
  width: 100%;
  height: 100%;
}

.right-column {
  background-color: $color-bg-lighter;
  border-left: 1px solid $color-border;
  width: 100%;
  display: grid;
  grid-template-rows: 17% 30% 22% 2% 29%;
  height: 100%;
  max-height: 100vh;
  overflow: hidden;

  .right-title {
    background-color: $color-bg-dark;
    display: flex;
    align-items: center;
    overflow: hidden;

    .title-container {
      text-align: left;

      .title-line {
        line-height: 1.2;
        color: white;
        font-weight: normal;

        &.bold {
          font-weight: bold;
        }
      }
    }
  }

  .gap-image {
    height: 100%;
  }

  .static-image, .dynamic-image {
    @include full-size;
    @include flex-center;
    overflow: hidden;
    padding: 0;

    .custom-spain {
      @include full-size;
      object-fit: cover;
      object-position: 100% 20%;
    }

    img, .dynamic-map-image {
      @include full-size;
      border-radius: 0;
      box-shadow: none;
      object-fit: cover;
      object-position: center;
    }
  }
}

/* Responsive Styles */
@media screen and (max-width: 1920px) {
  .right-column {
    grid-template-rows: 17% 35% 22% 2% 29%;

    .right-title {
      padding: 1.8rem;

      .title-container {
        .title-line {
          font-size: 1.5rem;

          &.bold {
            font-size: 2.1rem;
          }
        }
      }
    }
  }
}

@media screen and (min-width: 1921px) and (max-width: 2560px) {
  .right-column {
    .right-title {
      padding: 2.5rem;

      .title-container {
        .title-line {
          font-size: 2rem;

          &.bold {
            font-size: 2.8rem;
          }
        }
      }
    }
  }
}

@media screen and (min-width: 2561px) {
  .right-column {
    .right-title {
      padding: 3rem;

      .title-container {
        .title-line {
          font-size: 2.8rem;

          &.bold {
            font-size: 3.8rem;
          }
        }
      }
    }
  }
}
</style>