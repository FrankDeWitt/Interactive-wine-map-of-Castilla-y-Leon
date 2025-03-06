<script>
import { ref, onMounted, computed, watch } from 'vue';

export default {
  props: {
    src: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    imgClass: {
      type: String,
      default: ''
    }
  },
  emits: ['load'],
  setup(props, { emit }) {
    const isLoaded = ref(false);
    const cachedImages = ref(new Map());
    const uniqueKey = ref(Date.now());

    const loadedSrc = computed(() => {
      if (cachedImages.value.has(props.src)) {
        return props.src;
      }
      return isLoaded.value ? props.src : '';
    });

    const preloadImage = () => {
      if (cachedImages.value.has(props.src)) {
        isLoaded.value = true;
        emit('load');
        return;
      }

      const img = new Image();
      img.onload = () => {
        isLoaded.value = true;
        cachedImages.value.set(props.src, true);
        emit('load');
      };
      img.src = props.src;
    };

    const onLoaded = () => {
      cachedImages.value.set(props.src, true);
      emit('load');
    };

    const resetComponent = () => {
      isLoaded.value = false;
      uniqueKey.value = Date.now();
      preloadImage();
    };

    onMounted(() => {
      preloadImage();
    });

    watch(() => props.src, (newSrc, oldSrc) => {
      if (newSrc !== oldSrc) {
        resetComponent();
      }
    }, { immediate: false });

    return {
      loadedSrc,
      onLoaded,
      isLoaded,
      uniqueKey
    };
  }
}
</script>

<template>
  <img
      v-if="loadedSrc"
      :src="loadedSrc"
      :alt="alt"
      :class="imgClass"
      loading="eager"
      fetchpriority="high"
      decoding="sync"
      @load="onLoaded"
      :key="uniqueKey"
  />
  <div v-else :class="imgClass" style="background-color: #f5f5f5;"></div>
</template>