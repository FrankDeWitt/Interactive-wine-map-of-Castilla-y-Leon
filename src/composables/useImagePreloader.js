import { ref } from "vue"

export function useImagePreloader() {
    const preloadedImages = ref(new Set())
    const loading = ref(false)
    const progress = ref(0)

    const preloadImages = async (
        urls,
        options = { timeout: 10000, parallel: true }
    ) => {
        if (!urls.length) return

        const imagesToLoad = urls.filter(url => !preloadedImages.value.has(url))
        if (!imagesToLoad.length) return

        loading.value = true
        progress.value = 0

        try {
            if (options.parallel) {
                const promises = imagesToLoad.map(
                    (url, index) =>
                        new Promise((resolve, reject) => {
                            const img = new Image()

                            const timer = setTimeout(() => {
                                reject(new Error(`Timeout loading image: ${url}`))
                            }, options.timeout)

                            img.onload = () => {
                                clearTimeout(timer)
                                preloadedImages.value.add(url)
                                progress.value = Math.round(
                                    ((index + 1) / imagesToLoad.length) * 100
                                )
                                resolve()
                            }

                            img.onerror = () => {
                                clearTimeout(timer)
                                reject(new Error(`Failed to load image: ${url}`))
                            }

                            img.src = url
                        })
                )

                await Promise.allSettled(promises)
            } else {
                for (let i = 0; i < imagesToLoad.length; i++) {
                    const url = imagesToLoad[i]
                    await new Promise((resolve, reject) => {
                        const img = new Image()

                        const timer = setTimeout(() => {
                            reject(new Error(`Timeout loading image: ${url}`))
                        }, options.timeout)

                        img.onload = () => {
                            clearTimeout(timer)
                            preloadedImages.value.add(url)
                            progress.value = Math.round(((i + 1) / imagesToLoad.length) * 100)
                            resolve()
                        }

                        img.onerror = () => {
                            clearTimeout(timer)
                            reject(new Error(`Failed to load image: ${url}`))
                        }

                        img.src = url
                    })
                }
            }
        } catch (error) {
            console.error("Error preloading images:", error)
        } finally {
            loading.value = false
            progress.value = 100
        }
    }

    const isImagePreloaded = url => {
        return preloadedImages.value.has(url)
    }

    return {
        preloadImages,
        isImagePreloaded,
        preloadedImages,
        loading,
        progress
    }
}
