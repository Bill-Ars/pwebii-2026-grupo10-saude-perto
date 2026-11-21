<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import BadgeTipo from '../components/BadgeTipo.vue'
import EstadoPedido from '../components/EstadoPedido.vue'
import FormularioEnvio from '../components/FormularioEnvio.vue'
import IconeSvg from '../components/IconeSvg.vue'
import { useEmail } from '../composables/useEmail.js'
import { useUnidade } from '../composables/useUnidade.js'

const props = defineProps({
  osmType: { type: String, required: true },
  osmId: { type: String, required: true },
})

const router = useRouter()
const { unidade, aCarregar, erro, carregar } = useUnidade(() => props.osmType.toLowerCase(), () => props.osmId)
const { aEnviar, enviado, erro: erroEnvio, enviar, repor } = useEmail()

const SEM_DADOS = 'Não registado no OpenStreetMap'
const unidadeDoEnvio = ref(null)
const estadoDoEnvioActual = computed(() => unidadeDoEnvio.value === unidade.value?.id)

watch(() => unidade.value?.id, () => {
  unidadeDoEnvio.value = null
  repor()
})

const linkMapa = computed(() => {
  const lat = unidade.value?.lat
  const lon = unidade.value?.lon
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null

  const url = new URL('https://www.google.com/maps/dir/')
  url.search = new URLSearchParams({ api: '1', destination: `${lat},${lon}` })
  return url.href
})

function enviarDados({ nomeRemetente, emailDestino, nomeDestino, mensagem }) {
  const dados = unidade.value
  if (!dados || aEnviar.value) return

  const rota = router.resolve({ name: 'unidade', params: { osmType: dados.osmType, osmId: dados.osmId } })
  const linkDetalhe = new URL(rota.href, window.location.href).href
  const linhas = [
    mensagem,
    dados.nome,
    `Telefone: ${dados.telefones.join(', ') || SEM_DADOS}`,
    `Horário: ${dados.horario || SEM_DADOS}`,
    `Endereço: ${dados.endereco || SEM_DADOS}`,
    linkMapa.value && `Como chegar: ${linkMapa.value}`,
    `Detalhes no Saúde Perto: ${linkDetalhe}`,
  ]

  unidadeDoEnvio.value = dados.id
  return enviar({
    from_name: nomeRemetente,
    to_email: emailDestino,
    to_name: nomeDestino || emailDestino,
    message: linhas.filter(Boolean).join('\n'),
  })
}
</script>

<template>
  <div class="detalhe">
    <RouterLink
      v-if="unidade?.cidadeId"
      :to="{ name: 'cidade', params: { cidadeId: unidade.cidadeId } }"
      class="voltar"
    >
      <IconeSvg nome="seta" :tamanho="16" /> Unidades da cidade
    </RouterLink>
    <RouterLink v-else :to="{ name: 'inicio' }" class="voltar">
      <IconeSvg nome="seta" :tamanho="16" /> Início
    </RouterLink>

    <section v-if="aCarregar || erro" class="detalhe__estado" aria-labelledby="titulo-detalhe">
      <h1 id="titulo-detalhe">Detalhe da unidade</h1>
      <EstadoPedido v-if="aCarregar" tipo="carregar" mensagem="A procurar os dados desta unidade de saúde…" />
      <EstadoPedido v-else tipo="erro" titulo="Dados indisponíveis" :mensagem="erro" @tentar-novamente="carregar" />
    </section>

    <template v-else-if="unidade">
      <header class="detalhe__cabecalho">
        <div>
          <div class="detalhe__badges">
            <BadgeTipo :tipo="unidade.tipo" />
            <span v-if="unidade.urgencia" class="badge badge--urgencia">Urgência</span>
          </div>
          <h1>{{ unidade.nome }}</h1>
          <div v-if="linkMapa || unidade.telefones.length" class="detalhe__botoes">
            <a v-if="linkMapa" :href="linkMapa" class="botao detalhe__direccoes" target="_blank" rel="noopener noreferrer">
              <IconeSvg nome="direccao" :tamanho="17" /> Como chegar
            </a>
            <a
              v-if="unidade.telefones.length"
              :href="`tel:${unidade.telefones[0].replace(/\s/g, '')}`"
              class="botao detalhe__ligar"
            >
              <IconeSvg nome="telefone" :tamanho="17" /> Ligar
            </a>
          </div>
        </div>
        <span v-if="linkMapa" class="detalhe__marcador" aria-hidden="true">
          <IconeSvg nome="local" :tamanho="33" />
        </span>
      </header>

      <div class="detalhe__grelha">
        <section class="painel detalhe__contactos" aria-labelledby="titulo-contactos">
          <h2 id="titulo-contactos">Contactos e horário</h2>
          <dl class="detalhe__ficha">
            <div>
              <dt><IconeSvg nome="telefone" :tamanho="18" /> Telefone</dt>
              <dd v-if="unidade.telefones.length">
                <a
                  v-for="(telefone, indice) in unidade.telefones"
                  :key="indice"
                  :href="`tel:${telefone.replace(/\s/g, '')}`"
                >
                  {{ telefone }}
                </a>
              </dd>
              <dd v-else class="detalhe__sem-dados">{{ SEM_DADOS }}</dd>
            </div>
            <div>
              <dt><IconeSvg nome="relogio" :tamanho="18" /> Horário</dt>
              <dd :class="{ 'detalhe__sem-dados': !unidade.horario }">{{ unidade.horario || SEM_DADOS }}</dd>
            </div>
            <div>
              <dt><IconeSvg nome="local" :tamanho="18" /> Endereço</dt>
              <dd :class="{ 'detalhe__sem-dados': !unidade.endereco }">{{ unidade.endereco || SEM_DADOS }}</dd>
            </div>
            <div v-if="unidade.operador">
              <dt><IconeSvg nome="cruz" :tamanho="18" /> Entidade responsável</dt>
              <dd>{{ unidade.operador }}</dd>
            </div>
          </dl>
          <p v-if="!linkMapa" class="painel__nota">As coordenadas desta unidade não estão registadas no OpenStreetMap.</p>
        </section>

        <FormularioEnvio
          :key="unidade.id"
          :unidade="unidade"
          :a-enviar="aEnviar"
          :enviado="estadoDoEnvioActual && enviado"
          :erro-envio="estadoDoEnvioActual ? erroEnvio : null"
          @submeter="enviarDados"
          @novo-envio="repor"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.detalhe {
  --tinta: #233f36;
  --verde-profundo: #245a49;
  --linha: #dbe6df;
  --serif: Georgia, 'Times New Roman', serif;
}

.detalhe .voltar {
  gap: 0.55rem;
  margin: 0.25rem 0 1.05rem;
  color: var(--verde-profundo);
  font-size: 0.9rem;
}

.detalhe .voltar svg {
  width: 1.75rem;
  height: 1.75rem;
  padding: 0.35rem;
  border: 1px solid var(--linha);
  border-radius: 50%;
  background: #fff;
}

.detalhe__cabecalho,
.detalhe__estado {
  padding: clamp(1.4rem, 4.6vw, 2.8rem);
  border: 1px solid var(--linha);
  border-radius: 22px;
}

.detalhe__cabecalho {
  display: grid;
  align-items: center;
  gap: 1rem;
  overflow: hidden;
  background: linear-gradient(110deg, #fcfaf4 20%, #f2f6ec 100%);
}

.detalhe__estado {
  background: #fcfaf4;
}

.detalhe__cabecalho h1,
.detalhe__estado h1 {
  margin: 0;
  color: var(--tinta);
  font: 400 clamp(2.1rem, 5.4vw, 3.75rem) / 1.02 var(--serif);
  letter-spacing: -0.045em;
  overflow-wrap: anywhere;
}

.detalhe__estado :deep(.estado) {
  margin: 1.25rem 0 0;
}

.detalhe__estado :deep(.estado__texto) {
  margin-bottom: 0;
}

.detalhe__marcador {
  display: none;
}

.detalhe__badges {
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.detalhe__badges :deep(.badge) {
  padding: 0.26rem 0.72rem;
  border: 1px solid #d5e6db;
  background: #eaf2e9;
  color: #285749;
  font-weight: 650;
}

.detalhe__badges :deep(.badge--urgencia) {
  border-color: #f0d8cf;
  background: #fbefe9;
  color: #8a3b2c;
}

.detalhe__botoes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-top: 1.4rem;
}

.detalhe__botoes .botao {
  gap: 0.55rem;
  border-radius: 8px;
  font-size: 0.9rem;
}

.detalhe__direccoes {
  background: var(--verde-profundo);
  color: #fff;
}

.detalhe__direccoes:hover {
  background: #193f34;
}

.detalhe__ligar {
  border-color: #c7d8cc;
  background: #ffffffb3;
  color: var(--verde-profundo);
}

.detalhe__ligar:hover {
  background: #e5eee4;
}

.detalhe__grelha {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: start;
  gap: 1.15rem;
  margin-top: 1.15rem;
}

.detalhe__grelha > :deep(.painel) {
  margin: 0;
  padding: clamp(1rem, 3vw, 1.7rem);
  border: 1px solid var(--linha);
  border-radius: 18px;
  box-shadow: 0 3px 10px #233f3605;
}

.detalhe__grelha > :deep(.painel[aria-labelledby='titulo-envio']) {
  background: #f0f5ef;
}

.detalhe__contactos h2,
.detalhe__grelha :deep(.painel__titulo) {
  margin-bottom: 0.9rem;
  color: var(--tinta);
  font: 400 clamp(1.35rem, 2.75vw, 1.65rem) / 1.2 var(--serif);
  letter-spacing: -0.025em;
}

.detalhe__grelha :deep(.painel__titulo svg) {
  color: var(--verde-profundo);
}

.detalhe__grelha :deep(.campo label) {
  color: var(--tinta);
  font-size: 0.92rem;
}

.detalhe__grelha :deep(.campo input:is([type='text'], [type='email'])),
.detalhe__grelha :deep(.campo textarea) {
  border-radius: 8px;
}

.detalhe__grelha :deep(.painel__ajuda) {
  font-size: 0.92rem;
}

.detalhe__ficha {
  margin: 0;
}

.detalhe__ficha > div {
  position: relative;
  display: grid;
  align-content: center;
  min-height: 4.4rem;
  padding: 0.85rem 0 0.85rem 2.9rem;
  border-top: 1px solid var(--linha);
}

.detalhe__ficha > div:last-child {
  padding-bottom: 0.35rem;
}

.detalhe__ficha dt {
  color: var(--texto-suave);
  font-size: 0.82rem;
  font-weight: 600;
}

.detalhe__ficha dt svg {
  position: absolute;
  top: 0.9rem;
  left: 0;
  width: 2.15rem;
  height: 2.15rem;
  padding: 0.5rem;
  border: 1px solid #dce8de;
  border-radius: 50%;
  background: #f2f6ef;
  color: var(--verde-profundo);
}

.detalhe__ficha dd {
  margin: 0.15rem 0 0;
  color: var(--tinta);
  font-weight: 630;
  overflow-wrap: anywhere;
}

.detalhe__ficha dd a {
  display: block;
  width: fit-content;
  color: var(--verde-profundo);
  text-decoration-color: #8dafa2;
  text-underline-offset: 0.15em;
}

.detalhe__ficha .detalhe__sem-dados {
  color: var(--texto-suave);
  font-size: 0.9rem;
  font-weight: 400;
}

@media (min-width: 720px) {
  .detalhe__cabecalho:has(.detalhe__marcador) {
    grid-template-columns: minmax(0, 1fr) 12rem;
  }

  .detalhe__marcador {
    display: grid;
    place-items: center;
    width: 11.5rem;
    aspect-ratio: 1;
    justify-self: end;
    border: 1px solid #d7e5d7;
    border-radius: 50%;
    background: repeating-radial-gradient(circle, transparent 0 20px, #d8e6d8 21px 22px);
    color: var(--verde-profundo);
  }

  .detalhe__marcador svg {
    width: 4.35rem;
    height: 4.35rem;
    padding: 1.15rem;
    border: 1px solid #c5dccc;
    border-radius: 50%;
    background: #faf9f2;
    box-shadow: 0 5px 15px #245a4915;
  }

  .detalhe__grelha {
    grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
    gap: 1.4rem;
    margin-top: 1.4rem;
  }
}
</style>
