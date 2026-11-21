<script setup>
import AppCabecalho from './components/AppCabecalho.vue'
import AppRodape from './components/AppRodape.vue'
import { useLigacao } from './composables/useLigacao.js'

const { online } = useLigacao()
</script>

<template>
  <AppCabecalho />
  <p v-if="!online" class="aviso-offline" role="status">
    Está sem ligação à Internet. São mostrados os dados guardados neste telemóvel.
  </p>
  <main class="contentor">
    <RouterView />
  </main>
  <AppRodape />
</template>
