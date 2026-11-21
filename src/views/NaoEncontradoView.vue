<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <section class="estado estado--caixa nao-encontrado">
    <p class="nao-encontrado__codigo">404</p>
    <h1>Página não encontrada</h1>
    <p>O endereço <code>{{ route.fullPath }}</code> não existe nesta aplicação.</p>
    <RouterLink to="/" class="botao botao--primario">Voltar ao início</RouterLink>
  </section>
</template>
