// Regras de validação reutilizáveis. Cada regra devolve uma mensagem de erro ou null.
export const obrigatorio = (mensagem = 'Este campo é obrigatório.') => (valor) =>
  String(valor ?? '').trim() ? null : mensagem

export const comprimentoMinimo = (min, mensagem) => (valor) =>
  !valor || String(valor).trim().length >= min ? null : (mensagem ?? `Escreva pelo menos ${min} caracteres.`)

export const comprimentoMaximo = (max, mensagem) => (valor) =>
  !valor || String(valor).length <= max ? null : (mensagem ?? `Use no máximo ${max} caracteres.`)

const PADRAO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
export const email = (mensagem = 'Indique um endereço de e-mail válido (ex.: nome@gmail.com).') => (valor) =>
  !valor || PADRAO_EMAIL.test(String(valor).trim()) ? null : mensagem

export const marcado = (mensagem = 'Confirme esta opção para continuar.') => (valor) => (valor === true ? null : mensagem)

/** Junta várias regras: devolve o primeiro erro encontrado. */
export const regras = (...lista) => (valor, todos) => {
  for (const regra of lista) {
    const erro = regra(valor, todos)
    if (erro) return erro
  }
  return null
}
