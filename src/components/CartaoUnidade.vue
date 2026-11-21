<script setup>
import BadgeTipo from './BadgeTipo.vue'
import IconeSvg from './IconeSvg.vue'
import { formatarDistancia } from '../utils/distancia.js'

defineProps({
  unidade: { type: Object, required: true },
  distancia: { type: Number, default: null },
})

const emit = defineEmits(['ver'])
</script>

<template>
  <article class="cartao-unidade">
    <div class="cartao-unidade__topo">
      <BadgeTipo :tipo="unidade.tipo" />
      <span v-if="unidade.urgencia" class="badge badge--urgencia">Urgência</span>
      <span v-if="distancia !== null" class="cartao-unidade__distancia">
        <IconeSvg nome="local" :tamanho="14" /> {{ formatarDistancia(distancia) }}
      </span>
    </div>

    <h3 class="cartao-unidade__nome" :class="{ 'sem-nome': !unidade.temNome }">{{ unidade.nome }}</h3>

    <p v-if="unidade.endereco" class="cartao-unidade__linha">{{ unidade.endereco }}</p>
    <p v-if="unidade.horario" class="cartao-unidade__linha">
      <IconeSvg nome="relogio" :tamanho="14" /> {{ unidade.horario }}
    </p>

    <div class="cartao-unidade__accoes">
      <button type="button" class="botao botao--primario" @click="emit('ver', unidade)">Ver detalhes</button>
      <a v-if="unidade.telefones.length" class="botao botao--secundario" :href="`tel:${unidade.telefones[0]}`">
        <IconeSvg nome="telefone" :tamanho="16" /> Ligar
      </a>
    </div>
  </article>
</template>
