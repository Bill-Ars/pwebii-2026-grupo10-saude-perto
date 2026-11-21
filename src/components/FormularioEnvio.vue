<script setup>
import { useFormulario } from '../composables/useFormulario.js'
import { regras, obrigatorio, comprimentoMinimo, comprimentoMaximo, email, marcado } from '../utils/validacao.js'
import IconeSvg from './IconeSvg.vue'

const props = defineProps({
  unidade: { type: Object, required: true },
  aEnviar: { type: Boolean, default: false },
  enviado: { type: Boolean, default: false },
  erroEnvio: { type: String, default: null },
})

const emit = defineEmits(['submeter', 'novo-envio'])

const MAX_MENSAGEM = 300

const { valores, erros, validar, validarCampo, repor } = useFormulario(
  { nomeRemetente: '', emailDestino: '', nomeDestino: '', mensagem: '', consentimento: false },
  {
    nomeRemetente: regras(obrigatorio('Indique o seu nome.'), comprimentoMinimo(2), comprimentoMaximo(60)),
    emailDestino: regras(obrigatorio('Indique o e-mail de destino.'), email()),
    nomeDestino: comprimentoMaximo(60),
    mensagem: comprimentoMaximo(MAX_MENSAGEM),
    consentimento: marcado('Confirme que o destinatário aceita receber este e-mail.'),
  },
)

function submeter() {
  if (!validar() || props.aEnviar) return
  emit('submeter', {
    nomeRemetente: valores.nomeRemetente.trim(),
    emailDestino: valores.emailDestino.trim(),
    nomeDestino: valores.nomeDestino.trim(),
    mensagem: valores.mensagem.trim(),
  })
}

function novoEnvio() {
  repor()
  emit('novo-envio')
}
</script>

<template>
  <section class="painel" aria-labelledby="titulo-envio">
    <h2 id="titulo-envio" class="painel__titulo"><IconeSvg nome="email" /> Enviar por e-mail</h2>

    <div v-if="enviado" class="mensagem mensagem--sucesso" role="status">
      <p><strong>E-mail enviado!</strong> Os dados de «{{ unidade.nome }}» foram enviados para {{ valores.emailDestino }}.</p>
      <button type="button" class="botao botao--secundario" @click="novoEnvio">Enviar a outra pessoa</button>
    </div>

    <form v-else novalidate @submit.prevent="submeter">
      <p class="painel__ajuda">
        Envie o nome, contacto, horário e o caminho para esta unidade a um familiar, ou para si próprio, para consultar mais tarde.
      </p>

      <div class="campo" :class="{ 'campo--erro': erros.nomeRemetente }">
        <label for="nomeRemetente">O seu nome *</label>
        <input id="nomeRemetente" v-model="valores.nomeRemetente" type="text" autocomplete="name" maxlength="60"
          :aria-invalid="Boolean(erros.nomeRemetente)" aria-describedby="erro-nomeRemetente" @blur="validarCampo('nomeRemetente')" />
        <p v-if="erros.nomeRemetente" id="erro-nomeRemetente" class="campo__erro">{{ erros.nomeRemetente }}</p>
      </div>

      <div class="campo" :class="{ 'campo--erro': erros.emailDestino }">
        <label for="emailDestino">E-mail de destino *</label>
        <input id="emailDestino" v-model="valores.emailDestino" type="email" inputmode="email" autocomplete="email"
          placeholder="nome@exemplo.com" :aria-invalid="Boolean(erros.emailDestino)" aria-describedby="erro-emailDestino"
          @blur="validarCampo('emailDestino')" />
        <p v-if="erros.emailDestino" id="erro-emailDestino" class="campo__erro">{{ erros.emailDestino }}</p>
      </div>

      <div class="campo" :class="{ 'campo--erro': erros.nomeDestino }">
        <label for="nomeDestino">Nome do destinatário (opcional)</label>
        <input id="nomeDestino" v-model="valores.nomeDestino" type="text" maxlength="60" @blur="validarCampo('nomeDestino')" />
        <p v-if="erros.nomeDestino" class="campo__erro">{{ erros.nomeDestino }}</p>
      </div>

      <div class="campo" :class="{ 'campo--erro': erros.mensagem }">
        <label for="mensagem">Mensagem (opcional)</label>
        <textarea id="mensagem" v-model="valores.mensagem" rows="3" :maxlength="MAX_MENSAGEM"
          placeholder="Ex.: A consulta é amanhã às 8h." @blur="validarCampo('mensagem')"></textarea>
        <p class="campo__contador">{{ valores.mensagem.length }}/{{ MAX_MENSAGEM }}</p>
        <p v-if="erros.mensagem" class="campo__erro">{{ erros.mensagem }}</p>
      </div>

      <div class="campo campo--caixa" :class="{ 'campo--erro': erros.consentimento }">
        <label>
          <input v-model="valores.consentimento" type="checkbox" @change="validarCampo('consentimento')" />
          Confirmo que o destinatário aceita receber este e-mail.
        </label>
        <p v-if="erros.consentimento" class="campo__erro">{{ erros.consentimento }}</p>
      </div>

      <p v-if="erroEnvio" class="mensagem mensagem--erro" role="alert">{{ erroEnvio }}</p>

      <button type="submit" class="botao botao--primario botao--largo" :disabled="aEnviar">
        {{ aEnviar ? 'A enviar…' : 'Enviar e-mail' }}
      </button>
      <p class="painel__nota">Os dados do formulário são usados apenas para enviar este e-mail e não ficam guardados.</p>
    </form>
  </section>
</template>
