// Cache em memória + localStorage, para evitar pedidos repetidos (os dados móveis são caros).
// O localStorage pode não estar disponível (modo privado, armazenamento cheio), por isso
// todas as operações estão protegidas com try/catch e a memória funciona sempre.

const PREFIXO = 'saude-perto:v1:'
const memoria = new Map()

function lerEntrada(chave) {
  if (memoria.has(chave)) return memoria.get(chave)
  try {
    const texto = localStorage.getItem(PREFIXO + chave)
    if (!texto) return null
    const entrada = JSON.parse(texto)
    memoria.set(chave, entrada)
    return entrada
  } catch {
    return null
  }
}

/** Devolve { valor, guardadoEm } se existir e ainda for válido; caso contrário, null. */
export function lerCache(chave, validadeMs = Infinity) {
  const entrada = lerEntrada(chave)
  if (!entrada) return null
  if (Date.now() - entrada.guardadoEm > validadeMs) return null
  return entrada
}

export function guardarCache(chave, valor) {
  const entrada = { valor, guardadoEm: Date.now() }
  memoria.set(chave, entrada)
  try {
    localStorage.setItem(PREFIXO + chave, JSON.stringify(entrada))
  } catch {
    // Sem espaço ou sem permissão: fica só em memória
  }
  return entrada
}

/** Procura um valor em todas as entradas cujo nome começa por "prefixoChave". */
export function procurarNasCaches(prefixoChave, encontrar) {
  const chaves = new Set([...memoria.keys()].filter((k) => k.startsWith(prefixoChave)))
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const chaveCompleta = localStorage.key(i)
      if (chaveCompleta?.startsWith(PREFIXO + prefixoChave)) chaves.add(chaveCompleta.slice(PREFIXO.length))
    }
  } catch {
    // ignora: usamos só a memória
  }
  for (const chave of chaves) {
    const entrada = lerEntrada(chave)
    const resultado = entrada && encontrar(entrada.valor)
    if (resultado) return resultado
  }
  return null
}
