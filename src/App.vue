<script setup >
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import LazyImage from './assets/LazyImage.vue';
import { wineRegions as originalWineRegions } from './data/wine-regions';

// Importaciones de imágenes ya existentes
import juntaCylLogo from './assets/logos/junta-cyl.png';
import spainWinesLogo from './assets/logos/spain-wines.png';
import redWineIcon from './assets/images/info/red.png';
import whiteWineIcon from './assets/images/info/white.png';
import roseWineIcon from './assets/images/info/rose.png';
import sparklingWineIcon from './assets/images/info/sparkling.png';
import europaMap from './assets/images/europa.jpg';
import spainMap from './assets/images/spain.jpg';
import defaultRegionMap from './assets/images/content/region-0.jpg';

// Importaciones de logos de regiones
import arlanzaLogo from './assets/logos/arlanza.jpg';
import arribesLogo from './assets/logos/arribes.jpg';
import bierzoLogo from './assets/logos/bierzo.jpg';
import castillaLogo from './assets/logos/castilla.jpg';
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

// Mapeo de logos por identificador o nombre (ajusta según tu estructura de datos)
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

const getLogoForRegion = (region) => {
  if (region.logo && typeof region.logo === 'string') {
    const logoFileName = region.logo.split('/').pop().split('.')[0].toLowerCase();

    if (logoMap[logoFileName]) {
      return logoMap[logoFileName];
    }

    if (region.name) {
      const regionNameKey = region.name.toLowerCase().split(' ')[0]; // Toma la primera palabra
      if (logoMap[regionNameKey]) {
        return logoMap[regionNameKey];
      }
    }
  }

  return dummyLogo;
};

const wineRegions = originalWineRegions.map(region => ({
  ...region,
  logo: getLogoForRegion(region)
}));

const getRegionImage = (regionId) => {
  return new URL(`./assets/images/content/${regionId}.jpg`, import.meta.url).href;
};

const getRegionMapImage = (regionId) => {
  return new URL(`./assets/images/regions/${regionId}.jpg`, import.meta.url).href;
};

const selectedRegion = ref(null);
const rippleInterval = ref(null);

const showRippleOnFirstItem = computed(() => {
  return !selectedRegion.value;
});

const showRippleOnReturnButton = computed(() => {
  return !!selectedRegion.value;
});

const selectRegion = (region) => {
  selectedRegion.value = region;

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

const preloadImages = () => {
  wineRegions.forEach(region => {
    const contentImg = new Image();
    contentImg.src = getRegionImage(region.mapRegionId);

    const mapImg = new Image();
    mapImg.src = getRegionMapImage(region.mapRegionId);
  });
};

onMounted(() => {
  startRippleEffect();
  preloadImages();
});

onBeforeUnmount(() => {
  if (rippleInterval.value) {
    clearInterval(rippleInterval.value);
  }
});
</script>

<template>
  <div class="wine-map-app">
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
            <div v-if="showRippleOnReturnButton" class="ripple-container" />
          </div>
        </li>
      </ul>
    </div>

    <div class="content">
      <header class="header">
        <div class="logo">
          <img :src="juntaCylLogo" alt="Junta de Castilla y León" v-once/>
        </div>
      </header>

      <div class="map-container">
        <transition name="fade" mode="out-in">
          <LazyImage
              v-if="selectedRegion"
              :key="'region-' + selectedRegion.mapRegionId"
              :src="getRegionImage(selectedRegion.mapRegionId)"
              :alt="selectedRegion ? selectedRegion.name : 'Whines from Castilla y León'"
              :img-class="'map-image'"
              @load="preloadImages"
          />
          <img v-else :key="'default-map'" :src="defaultRegionMap" alt="Whines from Castilla y León" class="map-image" />
        </transition>
      </div>

      <footer class="footer">
        <img :src="spainWinesLogo" alt="Junta de Castilla y León" v-once/>
      </footer>
    </div>

    <div class="right-column">
      <div class="right-title">
        <div class="title-container">
          <div class="title-line">WINE MAP OF</div>
          <div class="title-line bold">CASTILLA Y LEÓN</div>
          <div class="title-line">SPAIN</div>
        </div>
      </div>

      <div class="info-box">
        <p class="info-box-title">WINE AREA: 75000 Ha</p>
        <p>VARIERIES</p>
        <div class="legend">
          <div class="legend-item">
            <img class="variety red" :src="redWineIcon" alt="Vino tinto" v-once/>
            <span>RED WINE</span>
          </div>
          <div class="legend-item">
            <img class="variety white" :src="whiteWineIcon" alt="Vino blanco" v-once/>
            <span>WHITE WINE</span>
          </div>
          <div class="legend-item">
            <img class="variety rose" :src="roseWineIcon" alt="Vino rosado" v-once/>
            <span>ROSÉ</span>
          </div>
          <div class="legend-item">
            <img class="variety sparkling" :src="sparklingWineIcon" alt="Vino espumoso" v-once/>
            <span>SPARKLING WINE</span>
          </div>
        </div>

        <p>© 2018. Instituto para la Competitividad<br> Empresarial de Castilla y León</p>
      </div>

      <div class="static-image">
        <transition name="fade" mode="out-in">
        <img v-if="selectedRegion" class="custom-spain" :src="spainMap" alt="Mapa de España"/>
        <img v-else :src="europaMap" alt="Mapa de europa"/>
        </transition>
      </div>
      <div class="gap-image"/>
      <div class="dynamic-image">
        <transition name="fade" mode="out-in">
          <LazyImage
              v-if="selectedRegion"
              :key="'map-detail-' + selectedRegion.mapRegionId"
              :src="getRegionMapImage(selectedRegion.mapRegionId)"
              :alt="selectedRegion.name"
              :img-class="'dynamic-map-image'"
              @load="preloadImages"
          />
          <LazyImage
              v-else
              :key="'default-map-detail'"
              :src="spainMap"
              :alt="'Mapa de España'"
              :img-class="'dynamic-map-image'"
              @load="preloadImages"
          />
        </transition>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wine-map-app {
  display: grid;
  grid-template-columns: 1200px minmax(0, 1fr) 850px;
  height: 100%;
  width: 100%;
  font-family: Arial, sans-serif;
  overflow: hidden;

  .sidebar {
    grid-column: 1;
    background-color: #d7d7d7;
    overflow-y: auto;
    border-right: 1px solid #ddd;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .content {
    grid-column: 2;
    display: grid;
    grid-template-rows: 250px calc(100% - 500px) 250px;
    overflow: hidden;
    height: 100%;

    .header {
      grid-row: 1;
      display: flex;
      padding: 1.5rem;
      background-color: #fff;
      justify-content: center;
    }

    .map-container {
      grid-row: 2;
      overflow: hidden;

      .map-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .footer {
      grid-row: 3;
      padding: 1.5rem;
      background-color: #fff;
      text-align: center;
    }
  }

  .right-column {
    grid-column: 3;
    background-color: #f9f9f9;
    border-left: 1px solid #ddd;
    width: 100%;
    display: grid;
    grid-template-rows: 17% 30% 22% 2% 29%;
    height: 100%;
    max-height: 100vh;
    overflow: hidden;

    .right-title {
      background-color: #595758;
      padding: 3rem;
      display: flex;
      align-items: center;
      overflow: hidden;

      .title-container {
        text-align: left;

        .title-line {
          font-size: 2.8rem;
          line-height: 1.2;
          color: white;
          font-weight: normal;

          &.bold {
            font-size: 3.8rem;
            font-weight: bold;
          }
        }
      }
    }

    .info-box {
      padding: 3.5rem;
      display: flex;
      flex-direction: column;
      overflow: hidden; // Evitamos que genere scroll

      .info-box-title {
        font-size: 3.3rem;
        margin-bottom: 20px;
      }

      p {
        font-size: 2.3rem;
        margin-bottom: 20px;
      }

      .legend {
        margin: 20px 0 50px 0;

        .legend-item {
          display: flex;
          align-items: center;
          margin-bottom: 18px;

          .variety {
            width: 50px;
            height: 50px;
          }

          span:not(.variety) {
            font-size: 2rem;
          }
        }
      }
    }

    .gap-image {
      height: 20px;
    }

    .static-image, .dynamic-image {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      padding: 0;

      .custom-spain {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: 100% 20%;
      }

      img {
        width: 100%;
        height: 100%;
        border-radius: 0;
        box-shadow: none;
        object-fit: cover;
        object-position: center;
      }
    }
  }
}

.region-list {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  li {
    &.active .region-item {
      background-color: #aedae7;
      font-weight: bold;
      transition: background-color 0.3s ease;
    }
    &.disabled {
      background-color: #aedae7;
      opacity: 0.6;
      cursor: not-allowed;

      .region-item {
        cursor: not-allowed;
      }
    }

    &.return-item {
      position: relative;
      overflow: hidden;
    }

    &.first-item {
      position: relative;
      overflow: hidden;
    }
  }
}

.region-item {
  display: flex;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid #ddd;
  background-color: #ebebeb;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  height: 80px;
  position: relative;
  overflow: hidden;

  &:hover {
    background-color: #e0e0e0;
  }

  .region-number {
    margin-right: 15px;
    font-weight: bold;
    font-size: 1.8rem;
  }

  .region-name {
    flex: 1;
    font-size: 1.6rem;
  }

  .region-logo {
    height: 80px;
    max-width: 120px;
    object-fit: contain;
    margin-right: -25px;
    margin-top: -20px;
    margin-bottom: -20px;
  }

  &.return {
    display: flex;
    padding: 20px 25px;
    justify-content: space-between;
    position: relative;
  }

  .return-text {
    font-size: 3rem;
    font-weight: bold;
    margin: 0 5px 5px 0;
  }

  .return-arrow {
    font-size: 3rem;
    font-weight: bold;
    margin: 14px 5px 5px 0;
  }
}

h1 {
  font-size: 2.8rem;
  margin: 0;
  font-weight: bold;
}

h2 {
  font-size: 2.2rem;
  margin: 0 0 20px 0;
  font-weight: bold;
}

h3 {
  font-size: 1.8rem;
  margin: 25px 0 15px 0;
  color: #333;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
</style>