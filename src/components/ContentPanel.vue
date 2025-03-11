<script setup>
import RegionHeader from './RegionHeader.vue';
import CompanyButtons from './CompanyButtons.vue';

// Importaciones de imágenes para los logos fijos
import juntaCylLogo from '../assets/logos/junta-cyl.png';
import spainWinesLogo from '../assets/logos/spain-wines.png';
import defaultRegionMap from '../assets/images/region.jpg';

const props = defineProps({
  selectedRegion: {
    type: Object,
    default: null
  },
  getRegionImage: {
    type: Function,
    required: true
  }
});
</script>

<template>
  <div class="content">
    <header class="header">
      <div class="logo">
        <img :src="juntaCylLogo" alt="Junta de Castilla y León" v-once/>
      </div>
    </header>

    <transition name="slide" mode="out-in">
      <div v-if="selectedRegion" key="region-content" class="page-container">
        <RegionHeader
            :region="selectedRegion"
        />

        <CompanyButtons
          :companies="selectedRegion?.companies || []"
          :regionId="selectedRegion?.id"
        />
      </div>
      <div v-else key="default-map-container" class="default-map-container">
        <img
            :src="defaultRegionMap"
            alt="Wines from Castilla y León"
            class="map-image"
        />
      </div>
    </transition>

    <footer class="footer">
      <img :src="spainWinesLogo" alt="Spain Wines" v-once/>
    </footer>
  </div>
</template>

<style scoped lang="scss">
/* Variables para reutilización */
$color-bg-light: #ebebeb;

/* Mixins para reutilización */
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  display: grid;
  grid-template-rows: 20% calc(100% - 40%) 20%;
  overflow: hidden;
  height: 100%;

  .header {
    grid-row: 1;
    display: flex;
    background-color: #fff;
    justify-content: center;
    align-items: center;

    img {
      max-width: 100%;
      max-height: 80%;
      object-fit: contain;
    }
  }

  .page-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .default-map-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .map-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .footer {
    grid-row: 3;
    background-color: #fff;
    text-align: center;
    @include flex-center;

    img {
      max-width: 100%;
      max-height: 80%;
      object-fit: contain;
    }
  }
}

/* Responsive styles */
@media screen and (max-width: 1920px) {
  .content {
    grid-template-rows: 10% calc(100% - 20%) 10%;

    .logo {
      text-align: center;

      img {
        max-width: 50%;
        max-height: 50%;
        object-fit: contain;
      }
    }
  }
}

@media screen and (min-width: 1921px) and (max-width: 2560px) {
  .content {
    grid-template-rows: 10% calc(100% - 20%) 10%;

    .logo {
      text-align: center;

      img {
        max-width: 50%;
        max-height: 50%;
        object-fit: contain;
      }
    }
  }
}

@media screen and (min-width: 2561px) {
  .content {
    grid-template-rows: 10% calc(100% - 20%) 10%;
  }
}
</style>