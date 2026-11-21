<script setup>
// Mostra os estados de um pedido de dados: a carregar, erro ou lista vazia.
defineProps({
  tipo: { type: String, required: true, validator: (v) => ['carregar', 'erro', 'vazio'].includes(v) },
  titulo: { type: String, default: '' },
  mensagem: { type: String, default: '' },
})

const emit = defineEmits(['tentar-novamente'])
</script>

<template>
  <div v-if="tipo === 'carregar'" class="estado" role="status" aria-live="polite">
    <span class="visualmente-oculto">{{ titulo || 'A carregar…' }}</span>
    <div v-for="n in 3" :key="n" class="esqueleto" aria-hidden="true">
      <span class="esqueleto__linha esqueleto__linha--curta"></span>
      <span class="esqueleto__linha"></span>
      <span class="esqueleto__linha esqueleto__linha--media"></span>
    </div>
    <p class="estado__texto">{{ mensagem || 'A procurar unidades de saúde… Pode demorar alguns segundos.' }}</p>
  </div>

  <div v-else class="estado estado--caixa" :class="`estado--${tipo}`" :role="tipo === 'erro' ? 'alert' : 'status'">
    <h3>{{ titulo || (tipo === 'erro' ? 'Algo correu mal' : 'Nada encontrado') }}</h3>
    <p v-if="mensagem">{{ mensagem }}</p>
    <button v-if="tipo === 'erro'" type="button" class="botao botao--primario" @click="emit('tentar-novamente')">
      Tentar novamente
    </button>
    <slot />
  </div>
</template>
