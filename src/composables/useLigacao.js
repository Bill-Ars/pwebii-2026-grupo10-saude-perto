import { ref, onMounted, onUnmounted } from 'vue'

/** Indica se o telemóvel está com ligação à Internet. */
export function useLigacao() {
  const online = ref(typeof navigator === 'undefined' ? true : navigator.onLine)
  const actualizar = () => (online.value = navigator.onLine)

  onMounted(() => {
    window.addEventListener('online', actualizar)
    window.addEventListener('offline', actualizar)
  })
  onUnmounted(() => {
    window.removeEventListener('online', actualizar)
    window.removeEventListener('offline', actualizar)
  })

  return { online }
}
