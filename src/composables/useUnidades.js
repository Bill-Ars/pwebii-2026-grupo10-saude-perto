import { ref, watch, toValue, onScopeDispose } from 'vue'
import { obterCidade } from '../data/cidades.js'
import { consultaCidade, pedirOverpass, carregarCopiaLocal, normalizarLista } from '../services/overpass.js'
import { lerCache, guardarCache } from '../services/cache.js'

const VALIDADE_MS = 24 * 60 * 60 * 1000 // 24 horas

/**
 * Lista de unidades de saúde de uma cidade, mostrada SEM ESPERAR pela API:
 * 1. cache recente (memória/localStorage) → mostra logo e não faz pedidos;
 * 2. senão, cópia local do dataset (public/dados/<cidade>.json, servida pelo GitHub Pages) → mostra logo;
 * 3. em segundo plano, pede os dados actualizados à Overpass API e substitui a lista quando chegarem.
 * Só mostra erro se não houver nenhuma fonte disponível.
 * @param {import('vue').MaybeRefOrGetter<string>} cidadeId
 */
export function useUnidades(cidadeId) {
  const unidades = ref([])
  const aCarregar = ref(false) // nada para mostrar ainda
  const aActualizar = ref(false) // já há dados no ecrã, a pedir versão mais recente
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
    const actual = () => controladorActual === controlador && !controlador.signal.aborted

    // 1) Mostrar já alguma coisa: cache antiga ou cópia local do dataset
    let temDados = false
    const antiga = lerCache(chave)
    if (antiga) {
      aplicar(antiga.valor, 'cache-antiga', antiga.guardadoEm)
      temDados = true
    } else {
      // Não mostrar dados de outra cidade enquanto a cópia local carrega
      unidades.value = []
      origem.value = null
      aCarregar.value = true
      try {
        const copia = await carregarCopiaLocal(id, { signal: controlador.signal })
        if (!actual()) return
        const lista = normalizarLista(copia.elements ?? [], id)
        // Guardar também à parte, para a página de detalhe encontrar a unidade sem pedir à API
        guardarCache(`copia:${id}`, lista)
        aplicar(lista, 'copia-local', copia.recolhidoEm ?? copia.osm3s?.timestamp_osm_base)
        temDados = true
      } catch {
        // sem cópia local: continuamos com a API
      }
    }

    // 2) Actualizar a partir da API (em segundo plano se já houver dados no ecrã)
    if (temDados) {
      aCarregar.value = false
      aActualizar.value = true
    }
    else aCarregar.value = true
    erro.value = null

    try {
      const elementos = await pedirOverpass(consultaCidade(cidade), { signal: controlador.signal })
      if (!actual()) return
      const lista = normalizarLista(elementos, id)
      const entrada = guardarCache(chave, lista)
      aplicar(lista, 'api', entrada.guardadoEm)
    } catch (falha) {
      if (!actual()) return
      console.warn('Overpass indisponível:', falha?.message ?? falha)
      if (!temDados) {
        unidades.value = []
        erro.value = 'Não foi possível obter os dados. Verifique a sua ligação à Internet e tente novamente.'
      }
    } finally {
      if (controladorActual === controlador) {
        aCarregar.value = false
        aActualizar.value = false
      }
    }
  }

  watch(() => toValue(cidadeId), () => carregar(), { immediate: true })
  onScopeDispose(() => controladorActual?.abort())

  return { unidades, aCarregar, aActualizar, erro, origem, actualizadoEm, carregar }
}
