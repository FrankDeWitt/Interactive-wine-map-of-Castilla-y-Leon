<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { wineRegions } from './data/wine-regions';

export default {
  setup() {
    const selectedRegion = ref(null);
    const rippleInterval = ref(null);

    const showRippleEffect = computed(() => {
      return true; // Siempre mostramos el ripple, pero cambia dónde se muestra
    });

    const showRippleOnFirstItem = computed(() => {
      return !selectedRegion.value;
    });

    const showRippleOnReturnButton = computed(() => {
      return !!selectedRegion.value;
    });

    const selectRegion = (region) => {
      selectedRegion.value = region;
      highlightMapRegion(region?.mapRegionId);

      if (rippleInterval.value) {
        clearInterval(rippleInterval.value);
        rippleInterval.value = null;
      }

      // Reiniciamos el efecto ripple cuando se selecciona una región
      // ahora aparecerá en el botón de retorno
      startRippleEffect();
    };

    const highlightMapRegion = (regionId) => {
      console.log(`Resaltando región: ${regionId}`);
    };

    onMounted(() => {
      startRippleEffect();
    });

    onBeforeUnmount(() => {
      if (rippleInterval.value) {
        clearInterval(rippleInterval.value);
      }
    });

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

    return {
      wineRegions,
      selectedRegion,
      selectRegion,
      showRippleEffect,
      showRippleOnFirstItem,
      showRippleOnReturnButton
    };
  }
}
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
            <div v-if="showRippleOnReturnButton" class="ripple-container"></div>
          </div>
        </li>
      </ul>
    </div>

    <div class="content">
      <header class="header">
        <div class="logo">
          <img src="/logos/junta-cyl.png" alt="Junta de Castilla y León" />
        </div>
      </header>

      <div class="map-container">
        <transition name="fade" mode="out-in">
          <img
              :key="selectedRegion ? selectedRegion.mapRegionId : 'default'"
              :src="selectedRegion ? '/images/content/' + selectedRegion.mapRegionId + '.jpg' : '/images/content/region-0.jpg'"
              :alt="selectedRegion ? selectedRegion.name : 'Whines from Castilla y León'"
              class="map-image"
          />
        </transition>
      </div>

      <footer class="footer">
        <img src="/logos/spain-wines.png" alt="Junta de Castilla y León" />
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
            <img class="variety red" src="/images/info/red.png" alt="Vino tinto" />
            <span>RED WINE</span>
          </div>
          <div class="legend-item">
            <img class="variety white" src="/images/info/white.png" alt="Vino blanco" />
            <span>WHITE WINE</span>
          </div>
          <div class="legend-item">
            <img class="variety rose" src="/images/info/rose.png" alt="Vino rosado" />
            <span>ROSÉ</span>
          </div>
          <div class="legend-item">
            <img class="variety sparkling" src="/images/info/sparkling.png" alt="Vino espumoso" />
            <span>SPARKLING WINE</span>
          </div>
        </div>

        <p>© 2018. Instituto para la Competitividad<br> Empresarial de Castilla y León</p>
      </div>

      <div class="static-image">
        <img src="/images/europa.jpg" alt="Mapa de España" />
      </div>
      <div class="gap-image"/>
      <div class="dynamic-image">
        <transition name="fade" mode="out-in">
          <img
              :key="selectedRegion ? selectedRegion.mapRegionId : 'default'"
              :src="selectedRegion ? '/images/regions/' + selectedRegion.mapRegionId + '.jpg' : '/images/spain.jpg'"
              :alt="selectedRegion ? selectedRegion.name : 'Mapa de España'"
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