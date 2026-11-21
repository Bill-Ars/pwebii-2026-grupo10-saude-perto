import { ref, watch } from 'vue'

// Tema da interface ('escuro' ou 'claro'), partilhado por toda a aplicação.
// A escolha fica guardada no browser (quando o localStorage está disponível).
const CHAVE = 'saude-perto:tema'

function temaInicial() {
  try {
    const guardado = localStorage.getItem(CHAVE)
    if (guardado === 'escuro' || guardado === 'claro') return guardado
  } catch {
    // sem acesso ao localStorage: usa o tema escuro por defeito
  }
  return 'escuro'
}

const tema = ref(temaInicial())

function aplicar(valor) {
  document.documentElement.dataset.tema = valor
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', valor === 'escuro' ? '#04122e' : '#e8f3ff')
}

aplicar(tema.value)

watch(tema, (valor) => {
  aplicar(valor)
  try {
    localStorage.setItem(CHAVE, valor)
  } catch {
    // ignora: a escolha vale só para esta visita
  }
})

export function useTema() {
  const alternar = () => (tema.value = tema.value === 'escuro' ? 'claro' : 'escuro')
  return { tema, alternar }
}
