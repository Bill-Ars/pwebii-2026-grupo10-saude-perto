<script setup>
import { useRouter } from 'vue-router'
import SeletorCidade from '../components/SeletorCidade.vue'
import IconeSvg from '../components/IconeSvg.vue'
import LogoSaudePerto from '../components/LogoSaudePerto.vue'
import { CIDADES, cidadeMaisProxima } from '../data/cidades.js'
import { LISTA_TIPOS } from '../data/tipos.js'
import { useLocalizacao } from '../composables/useLocalizacao.js'

const router = useRouter()
const { estado, erro, pedir } = useLocalizacao()

function abrirCidade(id) {
  router.push({ name: 'cidade', params: { cidadeId: id } })
}

async function usarLocalizacao() {
  const coordenadas = await pedir()
  if (coordenadas) abrirCidade(cidadeMaisProxima(coordenadas).id)
}
</script>

<template>
  <section class="heroi">
    <svg class="heroi__batimento" viewBox="0 0 600 120" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 70h170l18-38 26 76 22-56 14 18h350" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />
    </svg>
    <div class="heroi__cruz" aria-hidden="true"><LogoSaudePerto :tamanho="120" /></div>
    <p class="heroi__etiqueta"><IconeSvg nome="batimento" :tamanho="16" /> Saúde em Moçambique</p>
    <h1>Encontre cuidados de saúde perto de si</h1>
    <p>
      Hospitais, centros de saúde, consultórios e farmácias em {{ CIDADES.length }} cidades de Moçambique, com
      contactos, horários e o caminho para lá chegar.
    </p>
    <button type="button" class="botao botao--primario botao--grande" :disabled="estado === 'a-pedir'" @click="usarLocalizacao">
      <IconeSvg nome="alvo" />
      {{ estado === 'a-pedir' ? 'A obter a sua localização…' : 'Usar a minha localização' }}
    </button>
    <p v-if="erro" class="mensagem mensagem--erro" role="alert">{{ erro }}</p>
  </section>

  <section aria-labelledby="titulo-cidades">
    <h2 id="titulo-cidades" class="titulo-seccao">Ou escolha a sua cidade</h2>
    <SeletorCidade :cidades="CIDADES" @escolher="abrirCidade" />
  </section>

  <section class="painel" aria-labelledby="titulo-como">
    <h2 id="titulo-como" class="painel__titulo">Como funciona</h2>
    <ol class="passos">
      <li><strong>Escolha a cidade</strong> ou use a localização para ver primeiro as unidades mais próximas.</li>
      <li><strong>Filtre por tipo</strong> ({{ LISTA_TIPOS.map((t) => t.nome.toLowerCase()).join(', ') }}) ou pesquise pelo nome ou bairro.</li>
      <li><strong>Ligue, veja o caminho</strong> ou envie os dados por e-mail a um familiar.</li>
    </ol>
    <p class="painel__nota">
      Os dados ficam guardados no telemóvel durante 24 horas para poupar dados móveis.
    </p>
  </section>
</template>
