import { ref } from 'vue'

// Estado partilhado entre páginas: a localização só é pedida uma vez.
// A posição nunca sai do telemóvel: é usada apenas para calcular distâncias.
const coordenadas = ref(null)
const estado = ref('inactivo') // 'inactivo' | 'a-pedir' | 'pronto' | 'erro'
const erro = ref(null)

const MENSAGENS = {
  1: 'Não deu permissão para usar a localização. Pode escolher a cidade manualmente.',
  2: 'Não foi possível determinar a sua localização.',
  3: 'A localização demorou demasiado. Tente novamente.',
}

export function useLocalizacao() {
  function pedir() {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        estado.value = 'erro'
        erro.value = 'Este navegador não permite obter a localização.'
        resolve(null)
        return
      }
      estado.value = 'a-pedir'
      erro.value = null
      navigator.geolocation.getCurrentPosition(
        (posicao) => {
          coordenadas.value = { lat: posicao.coords.latitude, lon: posicao.coords.longitude }
          estado.value = 'pronto'
          resolve(coordenadas.value)
        },
        (falha) => {
          estado.value = 'erro'
          erro.value = MENSAGENS[falha.code] ?? MENSAGENS[2]
          resolve(null)
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 5 * 60 * 1000 },
      )
    })
  }

  function esquecer() {
    coordenadas.value = null
    estado.value = 'inactivo'
    erro.value = null
  }

  return { coordenadas, estado, erro, pedir, esquecer }
}
