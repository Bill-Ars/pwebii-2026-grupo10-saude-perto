import { reactive, computed } from 'vue'

/**
 * Gestão simples de formulários com validação.
 * @param {object} valoresIniciais  ex.: { email: '' }
 * @param {object} regrasPorCampo   ex.: { email: regras(obrigatorio(), email()) }
 */
export function useFormulario(valoresIniciais, regrasPorCampo) {
  const valores = reactive({ ...valoresIniciais })
  const erros = reactive({})
  const campos = Object.keys(regrasPorCampo)

  function validarCampo(campo) {
    const regra = regrasPorCampo[campo]
    erros[campo] = regra ? regra(valores[campo], valores) : null
    return !erros[campo]
  }

  function validar() {
    // map (e não every) para mostrar os erros de todos os campos de uma vez
    return campos.map(validarCampo).every(Boolean)
  }

  function repor() {
    Object.assign(valores, valoresIniciais)
    campos.forEach((campo) => (erros[campo] = null))
  }

  const valido = computed(() => campos.every((campo) => !regrasPorCampo[campo](valores[campo], valores)))

  return { valores, erros, valido, validar, validarCampo, repor }
}
