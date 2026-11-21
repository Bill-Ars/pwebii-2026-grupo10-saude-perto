<script setup>
import IconeSvg from './IconeSvg.vue'
import LogoSaudePerto from './LogoSaudePerto.vue'
import AlternarTema from './AlternarTema.vue'
</script>

<template>
  <header class="cabecalho">
    <div class="contentor cabecalho__linha">
      <RouterLink to="/" class="marca" aria-label="Saúde Perto, página inicial">
        <LogoSaudePerto :tamanho="38" />
        <span class="marca__nome">Saúde <strong>Perto</strong></span>
      </RouterLink>
      <div class="cabecalho__accoes">
        <nav class="navegacao" aria-label="Navegação principal">
          <RouterLink to="/" class="nav-pilula">
            <span class="nav-pilula__anel"><IconeSvg nome="casa" :tamanho="16" /></span>
            <span class="nav-pilula__texto">Início</span>
          </RouterLink>
          <RouterLink to="/sobre" class="nav-pilula">
            <span class="nav-pilula__anel"><IconeSvg nome="info" :tamanho="16" /></span>
            <span class="nav-pilula__texto">Sobre</span>
          </RouterLink>
        </nav>
        <AlternarTema />
      </div>
    </div>
  </header>
</template>
