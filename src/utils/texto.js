// Minúsculas e sem acentos, para a pesquisa encontrar "farmacia" e "Farmácia".
export function normalizarTexto(texto = '') {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
}

export function formatarData(data) {
  if (!data) return ''
  return new Date(data).toLocaleString('pt-PT', { dateStyle: 'short', timeStyle: 'short' })
}
