<script setup>
import { ref, onMounted } from 'vue';
import { wineRegions as originalWineRegions } from './data/wine-regions';
import RegionSidebar from './components/RegionSidebar.vue';
import ContentPanel from './components/ContentPanel.vue';
import InfoPanel from './components/InfoPanel.vue';
import { getLogoForRegion, getRegionImage, getRegionMapImage, preloadImages } from './utils/imageUtils';

// Importaciones de logos para el mapeo
import arlanzaLogo from './assets/logos/arlanza.jpg';
import arribesLogo from './assets/logos/arribes.jpg';
import bierzoLogo from './assets/logos/bierzo.jpg';
import castillaLogo from './assets/logos/castilla.png';
import cebrerosLogo from './assets/logos/cebreros.jpg';
import cigalesLogo from './assets/logos/cigales.jpg';
import dummyLogo from './assets/logos/dummy.jpg';
import riberaLogo from './assets/logos/ribera.jpg';
import riojaLogo from './assets/logos/rioja.jpg';
import ruedaLogo from './assets/logos/rueda.jpg';
import salamancaLogo from './assets/logos/salamanca.jpg';
import tierraLogo from './assets/logos/tierra.jpg';
import toroLogo from './assets/logos/toro.jpg';
import vallesLogo from './assets/logos/valles.jpg';
import valtiendasLogo from './assets/logos/valtiendas.jpg';
import vinoLogo from './assets/logos/vino.jpg';

const selectedRegion = ref(null);

// Mapeo de logos por identificador o nombre
const logoMap = {
  'arlanza': arlanzaLogo,
  'arribes': arribesLogo,
  'bierzo': bierzoLogo,
  'castilla': castillaLogo,
  'cebreros': cebrerosLogo,
  'cigales': cigalesLogo,
  'ribera': riberaLogo,
  'rioja': riojaLogo,
  'rueda': ruedaLogo,
  'salamanca': salamancaLogo,
  'tierra': tierraLogo,
  'toro': toroLogo,
  'valles': vallesLogo,
  'valtiendas': valtiendasLogo,
  'vino': vinoLogo,
  'default': dummyLogo
};

// Procesar las regiones con sus logos
const wineRegions = originalWineRegions.map(region => ({
  ...region,
  logo: getLogoForRegion(logoMap, region, dummyLogo)
}));

// Función para seleccionar región
const selectRegion = (region) => {
  selectedRegion.value = region;
};

onMounted(() => {
  preloadImages(wineRegions);
});
</script>

<template>
  <div class="wine-map-app">
    <RegionSidebar
        :wine-regions="wineRegions"
        :selected-region="selectedRegion"
        @select-region="selectRegion"
    />

    <ContentPanel
        :selected-region="selectedRegion"
        :get-region-image="getRegionImage"
    />

    <InfoPanel
        :selected-region="selectedRegion"
        :get-region-map-image="getRegionMapImage"
    />
  </div>
</template>

<style scoped lang="scss">
.wine-map-app {
  display: grid;
  grid-template-columns: 40% minmax(0, 1fr) 30%;
  height: 100vh;
  width: 100%;
  font-family: Arial, sans-serif;
  overflow: hidden;
}

@media screen and (max-width: 1920px) {
  .wine-map-app {
    grid-template-columns: 30% minmax(0, 1fr) 21%;
  }
}

@media screen and (min-width: 1921px) and (max-width: 2560px) {
  .wine-map-app {
    grid-template-columns: 30% minmax(0, 1fr) 21%;
  }
}

@media screen and (min-width: 2561px) {
  .wine-map-app {
    grid-template-columns: 32% minmax(0, 1fr) 20%;
  }
}
</style>