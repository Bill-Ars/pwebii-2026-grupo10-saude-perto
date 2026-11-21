<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import BadgeTipo from '../components/BadgeTipo.vue'
import EstadoPedido from '../components/EstadoPedido.vue'
import FormularioEnvio from '../components/FormularioEnvio.vue'
import IconeSvg from '../components/IconeSvg.vue'
import { obterCidade } from '../data/cidades.js'
import { TIPOS } from '../data/tipos.js'
import { useUnidade } from '../composables/useUnidade.js'
import { useLocalizacao } from '../composables/useLocalizacao.js'
import { useEmail } from '../composables/useEmail.js'
import { calcularDistancia, formatarDistancia } from '../utils/distancia.js'

const props = defineProps({
  osmType: { type: String, required: true },
  osmId: { type: String, required: true },
})

const router = useRouter()
const { unidade, aCarregar, erro, carregar } = useUnidade(() => props.osmType, () => props.osmId)
const { coordenadas } = useLocalizacao()
const { aEnviar, enviado, erro: erroEmail, enviar, repor: reporEmail } = useEmail()

const cidade = computed(() => (unidade.value?.cidadeId ? obterCidade(unidade.value.cidadeId) : null))

const distancia = computed(() =>
  unidade.value && coordenadas.value ? calcularDistancia(coordenadas.value, unidade.value) : null,
)

const linkDireccoes = computed(() =>
  unidade.value ? `https://www.google.com/maps/dir/?api=1&destination=${unidade.value.lat},${unidade.value.lon}` : '#',
)
const linkOsm = computed(() =>
  unidade.value ? `https://www.openstreetmap.org/${unidade.value.osmType}/${unidade.value.osmId}` : '#',
)

function voltar() {
  if (window.history.state?.back) router.back()
  else router.push(cidade.value ? { name: 'cidade', params: { cidadeId: cidade.value.id } } : { name: 'inicio' })
}

async function enviarEmail(dados) {
  const u = unidade.value
  await enviar({
    to_email: dados.emailDestino,
    to_name: dados.nomeDestino || 'Olá',
    from_name: dados.nomeRemetente,
    mensagem: dados.mensagem || '(sem mensagem)',
    unidade_nome: u.nome,
    unidade_tipo: TIPOS[u.tipo]?.nome ?? 'Unidade de saúde',
    unidade_endereco: u.endereco ?? 'Endereço não registado',
    unidade_telefone: u.telefones.join(' / ') || 'Telefone não registado',
    unidade_horario: u.horario ?? 'Horário não registado',
    unidade_urgencia: u.urgencia ? 'Sim' : 'Não indicado',
    link_mapa: linkDireccoes.value,
    link_app: window.location.href,
  })
}
</script>

<template>
  <button type="button" class="voltar" @click="voltar"><IconeSvg nome="seta" :tamanho="16" /> Voltar</button>

  <EstadoPedido v-if="aCarregar" tipo="carregar" mensagem="A carregar os dados da unidade…" />

  <EstadoPedido v-else-if="erro" tipo="erro" titulo="Unidade indisponível" :mensagem="erro" @tentar-novamente="carregar" />

  <article v-else-if="unidade" class="detalhe">
    <header class="detalhe__cabecalho">
      <div class="detalhe__badges">
        <BadgeTipo :tipo="unidade.tipo" />
        <span v-if="unidade.urgencia" class="badge badge--urgencia">Tem urgência</span>
      </div>
      <h1>{{ unidade.nome }}</h1>
      <p v-if="cidade" class="subtitulo">{{ cidade.nome }}, {{ cidade.provincia }}</p>
    </header>

    <div class="detalhe__accoes">
      <a v-if="unidade.telefones.length" class="botao botao--primario" :href="`tel:${unidade.telefones[0]}`">
        <IconeSvg nome="telefone" :tamanho="18" /> Ligar
      </a>
      <a class="botao botao--secundario" :href="linkDireccoes" target="_blank" rel="noopener">
        <IconeSvg nome="direccao" :tamanho="18" /> Como chegar
      </a>
    </div>

    <dl class="ficha">
      <div>
        <dt><IconeSvg nome="local" :tamanho="16" /> Endereço</dt>
        <dd>{{ unidade.endereco ?? 'Não registado' }}</dd>
      </div>
      <div v-if="distancia !== null">
        <dt><IconeSvg nome="alvo" :tamanho="16" /> Distância</dt>
        <dd>{{ formatarDistancia(distancia) }} em linha recta</dd>
      </div>
      <div>
        <dt><IconeSvg nome="telefone" :tamanho="16" /> Telefone</dt>
        <dd v-if="unidade.telefones.length">
          <a v-for="numero in unidade.telefones" :key="numero" :href="`tel:${numero}`" class="ficha__telefone">{{ numero }}</a>
        </dd>
        <dd v-else>Não registado</dd>
      </div>
      <div>
        <dt><IconeSvg nome="relogio" :tamanho="16" /> Horário</dt>
        <dd>{{ unidade.horario ?? 'Não registado' }}</dd>
      </div>
      <div v-if="unidade.operador">
        <dt><IconeSvg nome="medico" :tamanho="16" /> Entidade</dt>
        <dd>{{ unidade.operador }}</dd>
      </div>
      <div v-if="unidade.website">
        <dt>Website</dt>
        <dd><a :href="unidade.website" target="_blank" rel="noopener">{{ unidade.website }}</a></dd>
      </div>
    </dl>

    <p class="painel__nota">
      Informação do OpenStreetMap.
      <a :href="linkOsm" target="_blank" rel="noopener">Ver ou corrigir no mapa</a>.
    </p>

    <FormularioEnvio
      :unidade="unidade"
      :a-enviar="aEnviar"
      :enviado="enviado"
      :erro-envio="erroEmail"
      @submeter="enviarEmail"
      @novo-envio="reporEmail"
    />
  </article>
</template>
