<script setup>
import { ref, watch, inject, onMounted, onBeforeUnmount } from 'vue';
import LazyImage from './ui/LazyImage.vue';

const props = defineProps({
  companies: {
    type: Array,
    default: () => []
  },
  regionId: {
    type: [Number, String],
    required: true
  }
});

const selectedCompany = ref(null);
const imageLoaded = ref(false);
const preloadingImage = ref(null);

const getCompanyLogoPath = (company) => {
  if (!company) return '';

  try {
    return new URL(`../assets/logos/companies/region-${props.regionId}/${company.logo}`, import.meta.url).href;
  } catch (error) {
    console.error('Error loading logo:', error);
    return '';
  }
}

const getCompanyDetailLogoPath = (company) => {
  if (!company) return '';

  try {
    return new URL(`../assets/logos/companies/region-${props.regionId}/logo/${company.logo}`, import.meta.url).href;
  } catch (error) {
    console.error('Error loading detail logo:', error);
    return '';
  }
}

const preloadImage = (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
    preloadingImage.value = img;
  });
};

const selectCompany = async (company) => {
  if (company === selectedCompany.value) {
    selectedCompany.value = null;
    return;
  }

  imageLoaded.value = false;
  const logoSrc = getCompanyDetailLogoPath(company);

  preloadImage(logoSrc).then((success) => {
    imageLoaded.value = success;
  });

  selectedCompany.value = company;
}

const closeCompanyInfo = () => {
  selectedCompany.value = null;
  imageLoaded.value = false;
}

const eventBus = inject('eventBus', null);

onMounted(() => {
  if (eventBus) {
    eventBus.on('region-selected', () => {
      selectedCompany.value = null;
      imageLoaded.value = false;
    });
  }

  watch(() => props.regionId, () => {
    selectedCompany.value = null;
    imageLoaded.value = false;
  });

  const handleRegionChange = () => {
    selectedCompany.value = null;
    imageLoaded.value = false;
  };

  window.addEventListener('region-change', handleRegionChange);

  onBeforeUnmount(() => {
    window.removeEventListener('region-change', handleRegionChange);
  });
});

onBeforeUnmount(() => {
  if (eventBus) {
    eventBus.off('region-selected');
  }
  preloadingImage.value = null;
});
</script>

<template>
  <div class="buttons-section">
    <transition name="fade" mode="out-in">
      <div v-if="!selectedCompany" key="companies-grid" class="buttons-grid">
        <button
            v-for="company in companies"
            :key="company.id"
            class="company-button"
            :class="{ 'company-button-small': companies.length > 20 }"
            @click="selectCompany(company)"
        >
          <LazyImage
              :key="'company-' + company.id"
              :src="getCompanyLogoPath(company)"
              :alt="company ? company.name : 'Company'"
              :img-class="'company-logo'"
          />
        </button>
      </div>

      <div v-else key="company-detail" class="company-detail">
        <div class="company-card">
          <div class="company-logo-container">
            <div class="logo-wrapper">
              <LazyImage
                  v-if="imageLoaded"
                  :src="getCompanyDetailLogoPath(selectedCompany)"
                  :alt="selectedCompany.name"
                  :img-class="'company-detail-logo fade-in'"
              />
              <div v-else class="logo-placeholder"></div>
            </div>
          </div>

          <div class="company-info">
            <div class="column column-left">
              <div class="info-item" v-if="selectedCompany.manager">
                <div class="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div class="info-text">{{ selectedCompany.manager }}</div>
              </div>

              <div class="info-item" v-if="selectedCompany.address">
                <div class="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div class="info-text">{{ selectedCompany.address }}</div>
              </div>
            </div>
            <div class="column column-right">
              <div class="info-item" v-if="selectedCompany.phone">
                <div class="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div class="info-text">{{ selectedCompany.phone }}</div>
              </div>

              <div class="info-item" v-if="selectedCompany.email">
                <div class="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div class="info-text">
                  <a :href="'mailto:' + selectedCompany.email">{{ selectedCompany.email }}</a>
                </div>
              </div>

              <div class="info-item" v-if="selectedCompany.website">
                <div class="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </div>
                <div class="info-text">
                  <a :href="'https://' + selectedCompany.website" target="_blank" rel="noopener noreferrer">
                    {{ selectedCompany.website }}
                  </a>
                </div>
              </div>
            </div>
            <div class="info-item stand" v-if="selectedCompany.stand">
              <div class="stand-text">STAND {{ selectedCompany.stand }}</div>
            </div>
          </div>

          <button class="back-button" @click="closeCompanyInfo">
            <span class="back-arrow">←</span> Back to companies
          </button>
        </div>
      </div>
    </transition>
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
  overflow: auto;
}

.buttons-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  width: 100%;
  justify-content: center;
}

.company-button {
  transition: transform 0.2s ease;
  width: 300px;
  height: 300px;

  /* Efecto de transición al aparecer */
  animation: appear 0.5s ease forwards;
  opacity: 0;
  transform: translateY(20px);

  @for $i from 1 through 30 {
    &:nth-child(#{$i}) {
      animation-delay: #{$i * 0.05}s;
    }
  }

  @keyframes appear {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &.company-button-small {
    width: 220px;
    height: 220px;
  }

  .company-logo {
    width: 100%;
    height: 100%;
  }
}

.company-detail {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 2rem;

  .company-card {
    background-color: rgba(255, 255, 255, 0.4);
    border-radius: 24px;
    width: 90%;
    padding: 3.3rem;
    box-shadow: 0 5px 30px rgba(0, 0, 0, 0.1);
    position: relative;
    backdrop-filter: blur(10px);

    .company-logo-container {
      text-align: center;
      margin: 2rem 0;
      height: 300px;

      // Nuevo contenedor para gestionar la carga de imágenes
      .logo-wrapper {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .company-detail-logo {
        max-width: 100%;
        max-height: 300px;
        object-fit: contain;

        // Nueva animación para la entrada de imagen
        &.fade-in {
          animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      }

      // Placeholder transparente mientras carga la imagen
      .logo-placeholder {
        width: 100%;
        height: 100%;
        background-color: transparent;
      }
    }

    .company-info {
      display: flex;
      gap: 1.2rem;
      margin-bottom: 2rem;

      .column {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 20px;
        flex: 1;
      }

      .info-item {
        display: flex;
        align-items: center;
        font-size: 1.15rem;

        .info-icon {
          width: 36px;
          height: 36px;
          margin-right: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: black;
          border-radius: 50%;
          color: white;
        }

        .info-text {
          flex: 1;
          font-size: 1.8rem;

          a {
            color: #000;
            text-decoration: none;

            &:hover {
              text-decoration: underline;
            }
          }
        }

        &.stand {
          position: absolute;
          bottom: 20px;
          right: 20px;
          margin-top: 1rem;
          justify-content: flex-end;

          .stand-text {
            font-size: 2rem;
            font-weight: bold;
          }
        }
      }
    }

    .back-button {
      background: none;
      border: none;
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      position: absolute;
      bottom: 12px;
      left: 20px;

      .back-arrow {
        margin-right: 0.5rem;
      }
    }
  }
}

/* Responsive styles */
@media screen and (max-width: 1920px) {
  .company-detail {

    .company-card {
      padding: 1.5rem;

      .company-logo-container {
        margin: 1rem 0;
        height: 180px;

        .company-detail-logo {
          max-height: 180px;
        }
      }

      .company-info {

        .info-item {
          &.stand {
            bottom: 15px;

            .stand-text {
              font-size: 1.5rem;
            }
          }
          .info-text {
            font-size: 1.1rem;
          }
        }
      }

      .back-button {
        font-size: 1.1rem;
      }
    }
  }
  .company-button {
    width: 130px;
    height: 130px;
  }
}

@media screen and (min-width: 1921px) and (max-width: 2560px) {
  .company-detail {

    .company-card {
      padding: 2rem;

      .company-logo-container {
        margin: 2rem 0;
        height: 180px;

        .company-detail-logo {
          max-height: 180px;
        }
      }

      .company-info {

        .info-item {
          &.stand {
            bottom: 15px;

            .stand-text {
              font-size: 2rem;
            }
          }
          .info-text {
            font-size: 1.5rem;
          }
        }
      }

      .back-button {
        font-size: 1.5rem;
      }
    }
  }
  .company-button {
    width: 180px;
    height: 180px;
  }
}

@media screen and (min-width: 2561px) {
  .company-button {
    width: 300px;
    height: 300px;
  }
}
</style>