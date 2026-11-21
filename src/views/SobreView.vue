<script setup>
import { EQUIPA } from '../data/equipa.js'
</script>

<template>
  <article class="texto-longo">
    <h1>Sobre o Saúde Perto</h1>

    <h2>Que problema resolve?</h2>
    <p>
      Em Moçambique, muitas pessoas não sabem qual é a unidade de saúde ou farmácia mais próxima, qual o seu contacto ou
      horário, sobretudo quando estão numa cidade que não conhecem ou numa situação urgente. Esta informação está
      espalhada e raramente está disponível de forma simples no telemóvel.
    </p>
    <p>
      O Saúde Perto reúne hospitais, centros de saúde, consultórios e farmácias de várias cidades, ordena-os pela
      distância e permite ligar, ver o caminho ou enviar os dados por e-mail a um familiar.
    </p>

    <h2>De onde vêm os dados?</h2>
    <p>
      Do <a href="https://www.openstreetmap.org" target="_blank" rel="noopener">OpenStreetMap</a>, um mapa aberto e
      colaborativo, através da <a href="https://wiki.openstreetmap.org/wiki/Overpass_API" target="_blank" rel="noopener">Overpass API</a>.
      Os dados estão disponíveis sob a licença
      <a href="https://opendatacommons.org/licenses/odbl/" target="_blank" rel="noopener">ODbL</a>.
      Como são mantidos por voluntários, podem estar incompletos ou desactualizados: confirme sempre por telefone.
    </p>

    <h2>Pensado para o telemóvel</h2>
    <ul>
      <li>Os dados de cada cidade ficam guardados no telemóvel durante 24 horas, para não gastar dados móveis.</li>
      <li>Sem mapas pesados nem tipos de letra externos: a página carrega depressa mesmo com rede fraca.</li>
      <li>Se o servidor falhar, a aplicação mostra os últimos dados guardados.</li>
    </ul>

    <h2>Privacidade</h2>
    <p>
      A sua localização é usada apenas no seu telemóvel, para calcular distâncias, e nunca é enviada. Os dados do
      formulário de e-mail servem apenas para enviar a mensagem e não ficam guardados.
    </p>

    <h2>Equipa: Grupo 10</h2>
    <div class="tabela-rolavel">
      <table>
        <thead>
          <tr><th>Nome</th><th>N.º de estudante</th><th>GitHub</th></tr>
        </thead>
        <tbody>
          <tr v-for="membro in EQUIPA" :key="membro.nome">
            <td>{{ membro.nome }}</td>
            <td>{{ membro.numero }}</td>
            <td>{{ membro.github }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="painel__nota">Projecto Final de Programação Web II · LECC31 · ISUTC · 2026 · Docente: Ivan Ruby.</p>
  </article>
</template>
