<script setup>
import { LISTA_TIPOS } from '../data/tipos.js'

// v-model: lista de tipos seleccionados (vazia = todos)
const props = defineProps({
  modelValue: { type: Array, required: true },
  contagens: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['update:modelValue'])

function alternar(id) {
  const seleccionados = props.modelValue.includes(id)
    ? props.modelValue.filter((t) => t !== id)
    : [...props.modelValue, id]
  emit('update:modelValue', seleccionados)
}
</script>

<template>
  <div class="filtros" role="group" aria-label="Filtrar por tipo de unidade">
    <button
      type="button"
      class="chip"
      :class="{ 'chip--activo': modelValue.length === 0 }"
      :aria-pressed="modelValue.length === 0"
      @click="emit('update:modelValue', [])"
    >
      Todos
    </button>
    <button
      v-for="tipo in LISTA_TIPOS"
      :key="tipo.id"
      type="button"
      class="chip"
      :class="{ 'chip--activo': modelValue.includes(tipo.id) }"
      :aria-pressed="modelValue.includes(tipo.id)"
      :style="{ '--cor': tipo.cor }"
      @click="alternar(tipo.id)"
    >
      {{ tipo.plural }}
      <span class="chip__contagem">{{ contagens[tipo.id] ?? 0 }}</span>
    </button>
  </div>
</template>
