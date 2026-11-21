import { ref, watch, toValue, onScopeDispose } from 'vue'
import { obterCidade } from '../data/cidades.js'
import { consultaCidade, pedirOverpass, carregarCopiaLocal, normalizarLista } from '../services/overpass.js'
import { lerCache, guardarCache } from '../services/cache.js'

const VALIDADE_MS = 24 * 60 * 60 * 1000 // 24 horas

/**
 * Lista de unidades de saúde de uma cidade.
 * Ordem de tentativa: cache recente → Overpass API → cache antiga → cópia local do dataset.
 * @param {import('vue').MaybeRefOrGetter<string>} cidadeId
 */
export function useUnidades(cidadeId) {
  const unidades = ref([])
  const aCarregar = ref(false)
  const erro = ref(null)
  const origem = ref(null) // 'api' | 'cache' | 'cache-antiga' | 'copia-local'
  const actualizadoEm = ref(null)

  let controladorActual = null

  function aplicar(lista, novaOrigem, data) {
    unidades.value = lista
    origem.value = novaOrigem
    actualizadoEm.value = data ? new Date(data) : null
    erro.value = null
  }

  async function carregar({ forcar = false } = {}) {
    const id = toValue(cidadeId)
    const cidade = obterCidade(id)
    if (!cidade) {
      unidades.value = []
      erro.value = 'Cidade desconhecida.'
      return
    }

    const chave = `unidades:${id}`

    if (!forcar) {
      const recente = lerCache(chave, VALIDADE_MS)
      if (recente) {
        aplicar(recente.valor, 'cache', recente.guardadoEm)
        return
      }
    }

    controladorActual?.abort()
    const controlador = new AbortController()
    controladorActual = controlador

    aCarregar.value = true
    erro.value = null

    try {
      const elementos = await pedirOverpass(consultaCidade(cidade), { signal: controlador.signal })
      const lista = normalizarLista(elementos, id)
      const entrada = guardarCache(chave, lista)
      aplicar(lista, 'api', entrada.guardadoEm)
    } catch (falha) {
      if (controlador.signal.aborted) return

      const antiga = lerCache(chave)
      if (antiga) {
        aplicar(antiga.valor, 'cache-antiga', antiga.guardadoEm)
        return
      }

      try {
        const copia = await carregarCopiaLocal(id, { signal: controlador.signal })
        aplicar(normalizarLista(copia.elements ?? [], id), 'copia-local', copia.recolhidoEm)
      } catch {
        if (controlador.signal.aborted) return
        console.warn('Falha ao obter unidades:', falha)
        unidades.value = []
        erro.value = 'Não foi possível obter os dados. Verifique a sua ligação à Internet e tente novamente.'
      }
    } finally {
      if (controladorActual === controlador) aCarregar.value = false
    }
  }

  watch(() => toValue(cidadeId), () => carregar(), { immediate: true })
  onScopeDispose(() => controladorActual?.abort())

  return { unidades, aCarregar, erro, origem, actualizadoEm, carregar }
}
