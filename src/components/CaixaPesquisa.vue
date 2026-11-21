<script setup>
import IconeSvg from './IconeSvg.vue'

defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Pesquisar…' },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <label class="pesquisa">
    <span class="visualmente-oculto">Pesquisar</span>
    <IconeSvg nome="lupa" :tamanho="18" />
    <input
      type="search"
      :value="modelValue"
      :placeholder="placeholder"
      enterkeyhint="search"
      @input="emit('update:modelValue', $event.target.value)"
    />
    <button v-if="modelValue" type="button" class="pesquisa__limpar" aria-label="Limpar pesquisa" @click="emit('update:modelValue', '')">
      ×
    </button>
  </label>
</template>
