<script setup>
// Logo do Saúde Perto: cruz médica luminosa (desenho original em SVG).
defineProps({
  tamanho: { type: [Number, String], default: 36 },
})
</script>

<template>
  <svg :width="tamanho" :height="tamanho" viewBox="0 0 64 64" aria-hidden="true" class="logo">
    <defs>
      <linearGradient id="logo-fundo" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#0b3d91" />
        <stop offset="1" stop-color="#041a4a" />
      </linearGradient>
      <linearGradient id="logo-cruz" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#a5f3fc" />
        <stop offset="1" stop-color="#22d3ee" />
      </linearGradient>
      <filter id="logo-brilho" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2.4" result="desfoque" />
        <feMerge>
          <feMergeNode in="desfoque" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <rect width="64" height="64" rx="16" fill="url(#logo-fundo)" />
    <circle cx="32" cy="32" r="22" fill="#22d3ee" opacity="0.12" />
    <path
      d="M26 13h12v13h13v12H38v13H26V38H13V26h13z"
      fill="none"
      stroke="url(#logo-cruz)"
      stroke-width="3.2"
      stroke-linejoin="round"
      filter="url(#logo-brilho)"
    />
    <path d="M28.5 15.5h7v13h13v7h-13v13h-7v-13h-13v-7h13z" fill="#22d3ee" opacity="0.18" />
  </svg>
</template>
