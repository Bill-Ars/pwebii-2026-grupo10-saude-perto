<script setup>
// Ícones simples desenhados em SVG (não carregam ficheiros extra → poupam dados).
defineProps({
  nome: { type: String, required: true },
  tamanho: { type: [Number, String], default: 20 },
})

const CAMINHOS = {
  cruz: 'M9 3h6v6h6v6h-6v6H9v-6H3V9h6z',
  pilula: 'M10.5 3.5a5 5 0 0 1 7 7l-7 7a5 5 0 0 1-7-7zM7 10l7 7',
  local: 'M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12zm0-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  alvo: 'M12 2v3M12 19v3M2 12h3M19 12h3M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm0-3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  telefone: 'M5 3h3l2 5-2.5 1.5a11 11 0 0 0 7 7L16 14l5 2v3a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z',
  relogio: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  lupa: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5',
  email: 'M3 5h18v14H3zM3 6l9 7 9-7',
  seta: 'M15 18l-6-6 6-6',
  direccao: 'M3 11l18-8-8 18-2-8z',
  actualizar: 'M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5',
  medico: 'M6 3v6a4 4 0 0 0 8 0V3M10 13v3a5 5 0 0 0 10 0v-2M20 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
}
</script>

<template>
  <svg
    :width="tamanho"
    :height="tamanho"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="CAMINHOS[nome]" />
  </svg>
</template>
