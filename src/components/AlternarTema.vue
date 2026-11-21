<script setup>
import { computed } from 'vue'
import { useTema } from '../composables/useTema.js'
import IconeSvg from './IconeSvg.vue'

const { tema, alternar } = useTema()
const escuro = computed(() => tema.value === 'escuro')
</script>

<template>
  <button
    type="button"
    class="alternar-tema"
    :class="{ 'alternar-tema--escuro': escuro }"
    role="switch"
    :aria-checked="escuro"
    :aria-label="escuro ? 'Mudar para fundo claro' : 'Mudar para fundo escuro'"
    @click="alternar"
  >
    <span class="alternar-tema__icone alternar-tema__icone--sol"><IconeSvg nome="sol" :tamanho="16" /></span>
    <span class="alternar-tema__icone alternar-tema__icone--lua"><IconeSvg nome="lua" :tamanho="16" /></span>
    <span class="alternar-tema__botao" aria-hidden="true">
      <IconeSvg :nome="escuro ? 'lua' : 'sol'" :tamanho="16" />
    </span>
  </button>
</template>
