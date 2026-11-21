<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FiltroTipos from '../components/FiltroTipos.vue'
import CaixaPesquisa from '../components/CaixaPesquisa.vue'
import CartaoUnidade from '../components/CartaoUnidade.vue'
import EstadoPedido from '../components/EstadoPedido.vue'
import IconeSvg from '../components/IconeSvg.vue'
import { CIDADES, obterCidade } from '../data/cidades.js'
import { TIPOS } from '../data/tipos.js'
import { useUnidades } from '../composables/useUnidades.js'
import { useLocalizacao } from '../composables/useLocalizacao.js'
import { calcularDistancia } from '../utils/distancia.js'
import { normalizarTexto, formatarData } from '../utils/texto.js'

const props = defineProps({
  cidadeId: { type: String, required: true },
})

const route = useRoute()
const router = useRouter()
const cidade = computed(() => obterCidade(props.cidadeId))

const { unidades, aCarregar, aActualizar, erro, origem, actualizadoEm, carregar } = useUnidades(() => props.cidadeId)
const { coordenadas, estado: estadoLocalizacao, erro: erroLocalizacao, pedir } = useLocalizacao()

const tipoInicial = TIPOS[route.query.tipo] ? [route.query.tipo] : []
const tiposSeleccionados = ref(tipoInicial)
const pesquisa = ref('')

// Mostrar poucos cartões de cada vez: a página fica leve em telemóveis simples
const POR_PAGINA = 20
const quantidadeVisivel = ref(POR_PAGINA)

const contagens = computed(() =>
  unidades.value.reduce((total, u) => ({ ...total, [u.tipo]: (total[u.tipo] ?? 0) + 1 }), {}),
)

const filtradas = computed(() => {
  const termo = normalizarTexto(pesquisa.value)
  const lista = unidades.value.filter((u) => {
    const tipoOk = tiposSeleccionados.value.length === 0 || tiposSeleccionados.value.includes(u.tipo)
    const textoOk = !termo || normalizarTexto(`${u.nome} ${u.endereco ?? ''} ${u.operador ?? ''}`).includes(termo)
    return tipoOk && textoOk
  })
  if (!coordenadas.value) return lista.map((u) => ({ unidade: u, distancia: null }))
  return lista
    .map((u) => ({ unidade: u, distancia: calcularDistancia(coordenadas.value, u) }))
    .sort((a, b) => a.distancia - b.distancia)
})

const visiveis = computed(() => filtradas.value.slice(0, quantidadeVisivel.value))

watch([tiposSeleccionados, pesquisa, () => props.cidadeId], () => (quantidadeVisivel.value = POR_PAGINA))

const textoOrigem = computed(() => {
  const data = formatarData(actualizadoEm.value)
  return {
    api: `Dados actualizados agora (${data}).`,
    cache: `Dados guardados no telemóvel em ${data}.`,
    'cache-antiga': `Sem ligação ao servidor: a mostrar dados guardados em ${data}.`,
    'copia-local': `Dados do OpenStreetMap${data ? ` de ${data}` : ''} (cópia incluída na aplicação).`,
  }[origem.value]
})

function mudarCidade(evento) {
  router.push({ name: 'cidade', params: { cidadeId: evento.target.value } })
}

function verUnidade(unidade) {
  router.push({ name: 'unidade', params: { osmType: unidade.osmType, osmId: unidade.osmId } })
}

function limparFiltros() {
  tiposSeleccionados.value = []
  pesquisa.value = ''
}
</script>

<template>
  <div v-if="cidade">
    <RouterLink to="/" class="voltar"><IconeSvg nome="seta" :tamanho="16" /> Início</RouterLink>

    <header class="cabecalho-pagina">
      <div>
        <h1>Saúde em {{ cidade.nome }}</h1>
        <p class="subtitulo">{{ cidade.provincia }}</p>
      </div>
      <label class="seletor-compacto">
        <span class="visualmente-oculto">Mudar de cidade</span>
        <select :value="cidade.id" @change="mudarCidade">
          <option v-for="c in CIDADES" :key="c.id" :value="c.id">{{ c.nome }}</option>
        </select>
      </label>
    </header>

    <div class="barra-ferramentas">
      <CaixaPesquisa v-model="pesquisa" placeholder="Nome, bairro ou entidade…" />
      <button
        type="button"
        class="botao botao--secundario"
        :disabled="estadoLocalizacao === 'a-pedir'"
        @click="pedir"
      >
        <IconeSvg nome="alvo" :tamanho="16" />
        {{ coordenadas ? 'Actualizar posição' : estadoLocalizacao === 'a-pedir' ? 'A localizar…' : 'Mais perto de mim' }}
      </button>
    </div>
    <p v-if="erroLocalizacao" class="mensagem mensagem--erro">{{ erroLocalizacao }}</p>

    <FiltroTipos v-model="tiposSeleccionados" :contagens="contagens" />

    <EstadoPedido v-if="aCarregar" tipo="carregar" />

    <EstadoPedido
      v-else-if="erro"
      tipo="erro"
      titulo="Não foi possível carregar as unidades"
      :mensagem="erro"
      @tentar-novamente="carregar({ forcar: true })"
    />

    <EstadoPedido
      v-else-if="unidades.length === 0"
      tipo="vazio"
      titulo="Ainda não há unidades registadas nesta cidade"
      mensagem="O OpenStreetMap ainda não tem unidades de saúde registadas nesta área. Experimente outra cidade."
    />

    <EstadoPedido
      v-else-if="filtradas.length === 0"
      tipo="vazio"
      titulo="Nenhuma unidade corresponde à pesquisa"
      mensagem="Experimente outro nome ou retire alguns filtros."
    >
      <button type="button" class="botao botao--secundario" @click="limparFiltros">Limpar filtros</button>
    </EstadoPedido>

    <template v-else>
      <div class="resumo-lista">
        <p>
          <strong>{{ filtradas.length }}</strong> {{ filtradas.length === 1 ? 'unidade' : 'unidades' }}
          {{ coordenadas ? '· ordenadas pela distância' : '' }}
        </p>
        <p class="resumo-lista__origem">
          {{ textoOrigem }}
          <span v-if="aActualizar" class="a-actualizar" role="status">A procurar dados mais recentes…</span>
          <button v-else type="button" class="botao-texto" :disabled="aCarregar" @click="carregar({ forcar: true })">
            <IconeSvg nome="actualizar" :tamanho="14" /> Actualizar
          </button>
        </p>
      </div>

      <ul class="lista-unidades">
        <li v-for="item in visiveis" :key="item.unidade.id">
          <CartaoUnidade :unidade="item.unidade" :distancia="item.distancia" @ver="verUnidade" />
        </li>
      </ul>

      <button
        v-if="quantidadeVisivel < filtradas.length"
        type="button"
        class="botao botao--secundario botao--largo"
        @click="quantidadeVisivel += POR_PAGINA"
      >
        Mostrar mais ({{ filtradas.length - quantidadeVisivel }} restantes)
      </button>
    </template>
  </div>
</template>
