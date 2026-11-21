<script setup>
import IconeSvg from './IconeSvg.vue'
</script>

<template>
  <header class="cabecalho">
    <div class="contentor cabecalho__linha">
      <RouterLink to="/" class="marca" aria-label="Saúde Perto, página inicial">
        <span class="marca__logo"><IconeSvg nome="cruz" :tamanho="18" /></span>
        Saúde Perto
      </RouterLink>
      <nav class="navegacao" aria-label="Navegação principal">
        <RouterLink to="/">Início</RouterLink>
        <RouterLink to="/sobre">Sobre</RouterLink>
      </nav>
    </div>
  </header>
</template>
