<script setup>
defineProps({
  cidades: { type: Array, required: true },
  seleccionada: { type: String, default: null },
})

const emit = defineEmits(['escolher'])
</script>

<template>
  <ul class="grelha-cidades">
    <li v-for="cidade in cidades" :key="cidade.id">
      <button
        type="button"
        class="cartao-cidade"
        :class="{ 'cartao-cidade--activa': cidade.id === seleccionada }"
        @click="emit('escolher', cidade.id)"
      >
        <strong>{{ cidade.nome }}</strong>
        <span>{{ cidade.provincia }}</span>
      </button>
    </li>
  </ul>
</template>
