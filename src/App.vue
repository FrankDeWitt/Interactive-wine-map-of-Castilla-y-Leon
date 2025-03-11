<script setup >
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import LazyImage from './components/LazyImage.vue';
import CompanyModal from './components/CompanyModal.vue';
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
import defaultRegionMap from './assets/images/region.jpg';

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

// Logos de empresas
import cellarmastersLogo from './assets/logos/companies/region-12/cellarmasters.jpg';

// Variables para el modal
const isModalOpen = ref(false);
const selectedCompany = ref(null);

// Función para abrir el modal
const openModal = (company) => {
  selectedCompany.value = company;
  isModalOpen.value = true;
};

// Función para cerrar el modal
const closeModal = () => {
  isModalOpen.value = false;
};

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
  if (!imageUrlCache.regions[regionId]) {
    imageUrlCache.regions[regionId] = new URL(`./assets/images/content/${regionId}.jpg`, import.meta.url).href;
  }
  return imageUrlCache.regions[regionId];
};

const getRegionMapImage = (regionId) => {
  if (!imageUrlCache.maps[regionId]) {
    imageUrlCache.maps[regionId] = new URL(`./assets/images/regions/${regionId}.jpg`, import.meta.url).href;
  }
  return imageUrlCache.maps[regionId];
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

const imageUrlCache = {
  regions: {},
  maps: {}
};
const preloadImages = () => {
  console.log('Precargando imágenes...');
  wineRegions.forEach(region => {
    getRegionMapImage(region.mapRegionId);
    getRegionImage(region.id);

    const mapImg = new Image();
    mapImg.src = getRegionMapImage(region.mapRegionId);

    const contentImg = new Image();
    contentImg.src = getRegionImage(region.id);
  });
  console.log('Precarga completada');
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
<!--      <transition name="fade" mode="out-in">-->
        <div v-show="selectedRegion" class="page-container">
          <div class="header-section" :style="'background-color:' + (selectedRegion?.backgroundColor || '#FFFFFF')">
            <p class="region-title">{{selectedRegion?.id || ''}}. {{ selectedRegion?.shortName || '' }}</p>
            <div class="logo-container">
              <LazyImage
                  :key="'region-' + (selectedRegion?.mapRegionId || 'default')"
                  :src="selectedRegion?.logo || dummyLogo"
                  :alt="selectedRegion ? selectedRegion.name : 'Whines from Castilla y León'"
                  :img-class="'map-image'"
              />
            </div>
          </div>
          <div class="buttons-section">
            <div class="buttons-grid">
              <button
                  v-for="company in selectedRegion?.companies || []"
                  :key="company.id"
                  class="company-button"
                  @click="openModal(company)"
              >
                <LazyImage
                    :key="'region-' + (selectedRegion?.mapRegionId || 'default') + '-' + company.id"
                    :src="cellarmastersLogo"
                    :alt="company ? company.name : 'Whines from Castilla y León'"
                    :img-class="'map-image'"
                />
              </button>
            </div>
          </div>
        </div>
        <img v-show="!selectedRegion" :key="'default-map'" :src="defaultRegionMap" alt="Whines from Castilla y León" class="map-image" />
<!--      </transition>-->
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
<!--        <transition name="fade" mode="out-in">-->
          <img v-show="selectedRegion" class="custom-spain" :src="spainMap" alt="Mapa de España"/>
          <img v-show="!selectedRegion" :src="europaMap" alt="Mapa de europa"/>
<!--        </transition>-->
      </div>
      <div class="gap-image"/>
      <div class="dynamic-image">
<!--        <transition name="fade" mode="out-in">-->
          <LazyImage
              v-show="selectedRegion"
              :key="'map-detail'"
              :src="selectedRegion ? getRegionMapImage(selectedRegion.mapRegionId) : ''"
              :alt="selectedRegion?.name || ''"
              :img-class="'dynamic-map-image'"
          />
          <LazyImage
              v-show="!selectedRegion"
              :key="'default-map-detail'"
              :src="spainMap"
              :alt="'Mapa de España'"
              :img-class="'dynamic-map-image'"
          />
<!--        </transition>-->
      </div>
    </div>

    <CompanyModal
        :company="selectedCompany"
        :is-open="isModalOpen"
        @close="closeModal"
    />
  </div>
</template>

<style scoped lang="scss">
/* Variables para reutilización */
$color-bg-light: #ebebeb;
$color-bg-lighter: #f9f9f9;
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

@mixin full-size {
  width: 100%;
  height: 100%;
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

/* Estilos base */
.wine-map-app {
  display: grid;
  grid-template-columns: 40% minmax(0, 1fr) 30%;
  height: 100vh;
  width: 100%;
  font-family: Arial, sans-serif;
  overflow: hidden;
}

/* Layout principal - Sidebar */
.sidebar {
  grid-column: 1;
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
      background-color: $color-active;
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

/* Layout principal - Contenido central */
.content {
  grid-column: 2;
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
        .main-logo {
          max-width: 500px;
        }
      }
    }

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
    }
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

/* Layout principal - Columna derecha */
.right-column {
  grid-column: 3;
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

  .info-box {
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .legend {
      .legend-item {
        display: flex;
        align-items: center;

        .variety {
          object-fit: contain;
        }

        span:not(.variety) {
          margin-left: 10px;
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

/* Transiciones y efectos visuales */
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

/******************************************************
* ESTILOS ESPECÍFICOS PARA 1920 x 1080 (Full HD)
******************************************************/
@media screen and (max-width: 1920px) {
  // Ajustes de layout
  .wine-map-app {
    grid-template-columns: 30% minmax(0, 1fr) 21%;
  }

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

  .region-list {
    width: 65%;
  }

  // Estilos de elementos de región
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

    .info-box {
      padding: 1.8rem;

      .info-box-title {
        font-size: 1.8rem;
        margin-bottom: 10px;
      }

      p {
        font-size: 1.2rem;
        margin-bottom: 5px;
      }

      .legend {
        margin: 5px 0 10px 0;

        .legend-item {
          margin-bottom: 10px;

          .variety {
            width: 35px;
            height: 35px;
          }

          span:not(.variety) {
            font-size: 1.3rem;
          }
        }
      }
    }
  }

  // Tipografía
  h1 { font-size: 2.2rem; }
  h2 { font-size: 1.8rem; margin: 0 0 15px 0; }
  h3 { font-size: 1.5rem; margin: 20px 0 12px 0; }

  // Animación específica
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

/******************************************************
* ESTILOS ESPECÍFICOS PARA 2560 x 1440 (QHD / WQHD)
******************************************************/
@media screen and (min-width: 1921px) and (max-width: 2560px) {
  // Ajustes de layout
  .wine-map-app {
    grid-template-columns: 30% minmax(0, 1fr) 21%;
  }

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

  .region-list {
    width: 75%;
  }

  // Estilos de elementos de región
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

    .info-box {
      padding: 2.5rem;

      .info-box-title {
        font-size: 2.3rem;
        margin-bottom: 10px;
      }

      p {
        font-size: 1.6rem;
        margin-bottom: 10px;
      }

      .legend {
        margin: 10px 0 20px 0;

        .legend-item {
          margin-bottom: 5px;

          .variety {
            width: 42px;
            height: 42px;
          }

          span:not(.variety) {
            font-size: 1.7rem;
          }
        }
      }
    }
  }

  // Tipografía
  h1 { font-size: 2.5rem; }
  h2 { font-size: 2rem; margin: 0 0 18px 0; }
  h3 { font-size: 1.8rem; margin: 22px 0 15px 0; }

  // Animación específica
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

/******************************************************
* ESTILOS ESPECÍFICOS PARA 3840 x 2160 (4K / UHD)
******************************************************/
@media screen and (min-width: 2561px) {
  // Ajustes de layout
  .wine-map-app {
    grid-template-columns: 32% minmax(0, 1fr) 20%;
  }

  .content {
    grid-template-rows: 10% calc(100% - 20%) 10%;

    .map-container {
      grid-row: 2;
      overflow: hidden;

      .map-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
      }
    }
  }

  .region-list {
    width: 65%;
  }

  // Estilos de elementos de región
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

    .info-box {
      padding: 3rem;

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
  }

  // Tipografía
  h1 { font-size: 2.8rem; }
  h2 { font-size: 2.2rem; margin: 0 0 20px 0; }
  h3 { font-size: 1.8rem; margin: 25px 0 15px 0; }

  // Animación específica
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