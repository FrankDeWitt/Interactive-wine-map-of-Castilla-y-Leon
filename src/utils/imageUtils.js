// Caché de URLs de imágenes
const imageUrlCache = {
    regions: {},
    maps: {}
};

/**
 * Obtiene la URL de la imagen de contenido de una región
 * @param {number|string} regionId - ID de la región
 * @returns {string} URL de la imagen
 */
export const getRegionImage = (regionId) => {
    if (!imageUrlCache.regions[regionId]) {
        imageUrlCache.regions[regionId] = new URL(`../assets/images/content/${regionId}.jpg`, import.meta.url).href;
    }
    return imageUrlCache.regions[regionId];
};

/**
 * Obtiene la URL del mapa de una región
 * @param {number|string} regionId - ID de la región del mapa
 * @returns {string} URL de la imagen del mapa
 */
export const getRegionMapImage = (regionId) => {
    if (!imageUrlCache.maps[regionId]) {
        imageUrlCache.maps[regionId] = new URL(`../assets/images/regions/${regionId}.jpg`, import.meta.url).href;
    }
    return imageUrlCache.maps[regionId];
};

/**
 * Precarga las imágenes para mejorar la experiencia de usuario
 * @param {Array} regions - Array de objetos de regiones
 */
export const preloadImages = (regions) => {
    console.log('Precargando imágenes...');
    regions.forEach(region => {
        // Precargamos las URLs
        getRegionMapImage(region.mapRegionId);
        getRegionImage(region.id);

        // Creamos objetos Image para forzar la carga
        const mapImg = new Image();
        mapImg.src = getRegionMapImage(region.mapRegionId);

        const contentImg = new Image();
        contentImg.src = getRegionImage(region.id);
    });
    console.log('Precarga completada');
};

/**
 * Mapea los logos a las regiones según su nombre o identificador
 * @param {Object} logoMap - Objeto con mapeo de logos
 * @param {Object} region - Objeto de región
 * @param {string} defaultLogo - URL del logo por defecto
 * @returns {string} URL del logo correspondiente
 */
export const getLogoForRegion = (logoMap, region, defaultLogo) => {
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

    return defaultLogo;
};