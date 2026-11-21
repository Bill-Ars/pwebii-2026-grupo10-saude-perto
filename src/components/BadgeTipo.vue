<script setup>
import { computed } from 'vue'
import { TIPOS } from '../data/tipos.js'

const props = defineProps({
  tipo: { type: String, required: true },
})

const info = computed(() => TIPOS[props.tipo] ?? TIPOS.centro)
</script>

<template>
  <span class="badge" :style="{ '--cor': info.cor }">{{ info.nome }}</span>
</template>
