import { ref, watch, toValue, onScopeDispose } from 'vue'
import { consultaElemento, pedirOverpass, normalizarElemento } from '../services/overpass.js'
import { lerCache, guardarCache, procurarNasCaches } from '../services/cache.js'

/**
 * Uma única unidade de saúde. Primeiro procura nas listas já guardadas (sem gastar dados);
 * só faz um pedido à Overpass API se a pessoa abrir o link directamente.
 */
export function useUnidade(osmType, osmId) {
  const unidade = ref(null)
  const aCarregar = ref(false)
  const erro = ref(null)
  let controladorActual = null

  async function carregar() {
    const tipo = toValue(osmType)
    const id = String(toValue(osmId))
    const chaveId = `${tipo}-${id}`
    erro.value = null

    const guardada =
      procurarNasCaches('unidades:', (lista) => lista.find((u) => u.id === chaveId)) ??
      lerCache(`unidade:${chaveId}`)?.valor
    if (guardada) {
      unidade.value = guardada
      return
    }

    controladorActual?.abort()
    const controlador = new AbortController()
    controladorActual = controlador
    aCarregar.value = true
    unidade.value = null

    try {
      const elementos = await pedirOverpass(consultaElemento(tipo, id), { signal: controlador.signal })
      const elemento = elementos.find((e) => e.tags)
      if (!elemento) {
        erro.value = 'Esta unidade de saúde não foi encontrada.'
        return
      }
      const normalizada = normalizarElemento(elemento)
      guardarCache(`unidade:${chaveId}`, normalizada)
      unidade.value = normalizada
    } catch (falha) {
      if (controlador.signal.aborted) return
      console.warn('Falha ao obter a unidade:', falha)
      erro.value = 'Não foi possível obter os dados desta unidade. Verifique a sua ligação e tente novamente.'
    } finally {
      if (controladorActual === controlador) aCarregar.value = false
    }
  }

  watch(() => [toValue(osmType), toValue(osmId)], carregar, { immediate: true })
  onScopeDispose(() => controladorActual?.abort())

  return { unidade, aCarregar, erro, carregar }
}
