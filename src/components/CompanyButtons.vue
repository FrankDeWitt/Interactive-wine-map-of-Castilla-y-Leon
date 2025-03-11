<script setup>
import { ref, watch, provide, inject, onMounted, onBeforeUnmount } from 'vue';
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

// Función para obtener la ruta del logo
const getCompanyLogoPath = (company) => {
  return `src/assets/logos/companies/region-${props.regionId}/${company.logo}`;
}

const getCompanyDetailLogoPath = (company) => {
  return `src/assets/logos/companies/region-${props.regionId}/logo/${company.logo}`;
}

// Seleccionar/deseleccionar compañía
const selectCompany = (company) => {
  selectedCompany.value = company === selectedCompany.value ? null : company;
}

// Cerrar información de compañía
const closeCompanyInfo = () => {
  selectedCompany.value = null;
}

// Crear un bus de eventos global o usar provide/inject
const eventBus = inject('eventBus', null);

// Escuchar el evento de selección de región desde RegionSidebar
onMounted(() => {
  if (eventBus) {
    eventBus.on('region-selected', () => {
      selectedCompany.value = null;
    });
  }

  // Alternativamente, escucha directamente cambios en regionId
  watch(() => props.regionId, () => {
    selectedCompany.value = null;
  });

  // También podemos escuchar un evento personalizado a nivel de ventana
  window.addEventListener('region-change', () => {
    selectedCompany.value = null;
  });
});

// Limpiar los event listeners cuando se desmonta el componente
onBeforeUnmount(() => {
  if (eventBus) {
    eventBus.off('region-selected');
  }

  window.removeEventListener('region-change', () => {
    selectedCompany.value = null;
  });
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

      <!-- Vista de detalle de empresa -->
      <div v-else key="company-detail" class="company-detail">
        <div class="company-card">
          <div class="company-logo-container">
            <LazyImage
                :src="getCompanyDetailLogoPath(selectedCompany)"
                :alt="selectedCompany.name"
                :img-class="'company-detail-logo'"
            />
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

  @for $i from 1 through 20 {
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
    max-width: 950px;
    padding: 3.3rem;
    box-shadow: 0 5px 30px rgba(0, 0, 0, 0.1);
    position: relative;
    backdrop-filter: blur(10px);

    .company-logo-container {
      text-align: center;
      margin: 2rem 0;

      .company-detail-logo {
        max-width: 100%;
        max-height: 300px;
        object-fit: contain;
      }
    }

    .company-info {
      display: flex;
      gap: 1.2rem;
      margin-bottom: 2rem;

      .column {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
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
            font-size: 1.5rem;
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
@media screen and (max-width: 1200px) {
  .company-detail {
    .company-card {
      padding: 2.5rem;

      .company-name {
        font-size: 2.5rem;
        margin: 3rem 0;
      }

      .company-info {
        .info-item {
          .info-text {
            font-size: 1.5rem;
          }
        }
      }
    }
  }

  .company-button {
    width: 250px;
    height: 250px;
  }
}

@media screen and (max-width: 992px) {
  .company-detail {
    .company-card {
      padding: 2rem;

      .company-name {
        font-size: 2.2rem;
        margin: 2rem 0;
      }

      .company-info {
        gap: 1rem;

        .info-item {
          .info-text {
            font-size: 1.3rem;
          }
        }

        .info-item.stand {
          bottom: 15px;
          right: 15px;

          .stand-text {
            font-size: 1.3rem;
          }
        }
      }

      .back-button {
        font-size: 1.3rem;
        bottom: 10px;
        left: 15px;
      }
    }
  }

  .company-button {
    width: 220px;
    height: 220px;
  }
}

@media screen and (max-width: 768px) {
  .buttons-section {
    padding: 1.5rem;
  }

  .company-detail {
    padding: 1rem;

    .company-card {
      padding: 1.5rem;
      width: 95%;

      .company-name {
        font-size: 1.8rem;
        margin: 1.5rem 0;
      }

      .company-info {
        flex-direction: column;
        gap: 1.5rem;

        .column {
          gap: 1.5rem;
        }

        .info-item {
          .info-icon {
            width: 32px;
            height: 32px;
          }

          .info-text {
            font-size: 1.1rem;
          }
        }

        .info-item.stand {
          position: static;
          justify-content: center;
          margin-top: 2rem;

          .stand-text {
            font-size: 1.2rem;
          }
        }
      }

      .back-button {
        font-size: 1.1rem;
        position: static;
        margin-top: 2rem;
        justify-content: center;
        width: 100%;
      }
    }
  }

  .company-button {
    width: 170px;
    height: 170px;
  }
}

@media screen and (max-width: 576px) {
  .buttons-section {
    padding: 1rem;
  }

  .buttons-grid {
    gap: 1rem;
  }

  .company-detail {
    padding: 0.5rem;

    .company-card {
      padding: 1rem;
      border-radius: 16px;

      .company-name {
        font-size: 1.5rem;
        margin: 1rem 0;
        letter-spacing: 1px;
      }

      .company-info {
        gap: 1rem;

        .column {
          gap: 1rem;
        }

        .info-item {
          .info-icon {
            width: 28px;
            height: 28px;
            margin-right: 0.5rem;

            svg {
              width: 18px;
              height: 18px;
            }
          }

          .info-text {
            font-size: 0.9rem;
            word-break: break-word;
          }
        }
      }

      .back-button {
        font-size: 1rem;
        margin-top: 1.5rem;
        padding: 0.4rem 0.8rem;
      }
    }
  }

  .company-button {
    width: 130px;
    height: 130px;
  }
}

@media screen and (max-width: 380px) {
  .buttons-grid {
    gap: 0.8rem;
  }

  .company-button {
    width: 100px;
    height: 100px;
  }

  .company-detail {
    .company-card {
      .company-name {
        font-size: 1.3rem;
      }

      .company-info {
        .info-item {
          .info-icon {
            width: 24px;
            height: 24px;

            svg {
              width: 16px;
              height: 16px;
            }
          }

          .info-text {
            font-size: 0.8rem;
          }
        }
      }
    }
  }
}

/* Estilos para dispositivos de pantalla pequeña en modo landscape */
@media screen and (max-height: 600px) and (orientation: landscape) {
  .company-detail {
    .company-card {
      padding: 1.5rem;

      .company-name {
        font-size: 1.8rem;
        margin: 1rem 0;
      }

      .company-info {
        flex-direction: row;

        .column {
          gap: 0.8rem;
        }

        .info-item {
          .info-text {
            font-size: 1rem;
          }
        }

        .info-item.stand {
          bottom: 10px;
          right: 10px;
        }
      }

      .back-button {
        bottom: 10px;
        left: 10px;
        font-size: 1rem;
      }
    }
  }
}
</style>