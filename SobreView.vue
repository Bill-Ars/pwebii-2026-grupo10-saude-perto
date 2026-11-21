<script setup>
import IconeSvg from '../components/IconeSvg.vue'
import { EQUIPA } from '../data/equipa.js'
</script>

<template>
  <article class="sobre">
    <header class="sobre__cabecalho">
      <div>
        <h1>Sobre o Saúde Perto</h1>
        <p>
          Quando os contactos e horários estão dispersos, é difícil saber onde ir.
          O Saúde Perto reúne os dados de hospitais, centros de saúde, consultórios e farmácias
          em cidades de Moçambique para facilitar a consulta pelo telemóvel.
        </p>
      </div>
      <div class="sobre__marca" aria-hidden="true">
        <IconeSvg nome="cruz" :tamanho="38" />
      </div>
    </header>

    <div class="sobre__informacoes">
      <section class="painel sobre__painel" aria-labelledby="titulo-dados">
        <h2 id="titulo-dados"><IconeSvg nome="local" /> Fonte dos dados</h2>
        <p>
          Consultamos os dados do OpenStreetMap através da Overpass API. Dados ©
          <a href="https://www.openstreetmap.org/copyright">contribuidores do OpenStreetMap</a>,
          disponíveis sob a
          <a href="https://opendatacommons.org/licenses/odbl/1-0/">Open Database License (ODbL) 1.0</a>.
        </p>
        <p>
          Os dados são mantidos por voluntários. Confirme o horário e o contacto com a unidade
          antes de se deslocar.
        </p>
      </section>

      <section class="painel sobre__painel" aria-labelledby="titulo-privacidade">
        <h2 id="titulo-privacidade"><IconeSvg nome="alvo" /> Privacidade</h2>
        <p>
          Quando autoriza a localização, o navegador usa-a para identificar a cidade mais próxima
          e calcular as distâncias. Os dados públicos das unidades ficam guardados no navegador
          para poupar dados móveis.
        </p>
        <p>
          O EmailJS recebe os dados necessários para enviar a mensagem. A aplicação não guarda o
          formulário. Ao escolher «Como chegar», o Google Maps recebe as coordenadas da unidade.
        </p>
      </section>
    </div>

    <section class="sobre__equipa" aria-labelledby="titulo-equipa">
      <header class="sobre__equipa-cabecalho">
        <h2 id="titulo-equipa">Equipa</h2>
        <p>Grupo 10 · Programação Web II · LECC31 · ISUTC · 2026</p>
      </header>
      <ul class="sobre__membros">
        <li v-for="{ nome, numero, github } in EQUIPA" :key="numero">
          <a :href="`https://github.com/${github}`" class="sobre__membro">
            <div>
              <h3>{{ nome }}</h3>
              <span class="sobre__numero">Estudante {{ numero }}</span>
            </div>
            <span class="sobre__github">@{{ github }} <span aria-hidden="true">↗</span></span>
          </a>
        </li>
      </ul>
    </section>
  </article>
</template>

<style scoped>
.sobre {
  --tinta: #233f36;
  --verde-profundo: #245a49;
  --linha: #dbe6df;
  --serif: Georgia, 'Times New Roman', serif;
  padding-top: 0.35rem;
}

.sobre__cabecalho {
  display: grid;
  align-items: center;
  gap: 1.5rem;
  padding: clamp(1.55rem, 5vw, 3.3rem);
  border: 1px solid var(--linha);
  border-radius: 22px;
  background: linear-gradient(112deg, #fcfaf4 18%, #f1f5eb 100%);
}

.sobre__cabecalho h1 {
  margin: 0;
  color: var(--tinta);
  font: 400 clamp(2.2rem, 5.8vw, 4.1rem) / 1.02 var(--serif);
  letter-spacing: -0.052em;
  text-wrap: balance;
}

.sobre__cabecalho p {
  max-width: 54ch;
  margin: 1rem 0 0;
  color: #4d6056;
  font-size: clamp(0.98rem, 2vw, 1.06rem);
  line-height: 1.68;
}

.sobre__marca {
  display: none;
}

.sobre__informacoes,
.sobre__membros {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  overflow: hidden;
  border: 1px solid var(--linha);
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 3px 10px #233f3605;
}

.sobre__informacoes {
  margin-top: 1.2rem;
}

.sobre__painel {
  margin: 0;
  padding: clamp(1.15rem, 3.2vw, 1.8rem);
  border: 0;
  border-radius: 0;
  box-shadow: none;
}

.sobre__painel + .sobre__painel {
  border-top: 1px solid var(--linha);
}

.sobre__painel h2 {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.sobre__painel h2 svg {
  width: 2.15rem;
  height: 2.15rem;
  padding: 0.48rem;
  border: 1px solid #dce8de;
  border-radius: 50%;
  background: #f2f6ef;
  color: var(--verde-profundo);
}

.sobre__painel h2,
.sobre__equipa h2 {
  color: var(--tinta);
  font: 400 clamp(1.35rem, 2.75vw, 1.65rem) / 1.2 var(--serif);
  letter-spacing: -0.025em;
}

.sobre__painel p {
  margin: 0.75rem 0 0;
  color: var(--texto-suave);
  font-size: 0.94rem;
  line-height: 1.65;
}

.sobre__painel a {
  color: var(--verde-profundo);
  text-decoration-color: #8dafa2;
  text-underline-offset: 0.15em;
}

.sobre__equipa {
  margin: clamp(1.5rem, 4vw, 2.1rem) 0 0;
}

.sobre__equipa-cabecalho {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.3rem 1rem;
  margin-bottom: 0.85rem;
}

.sobre__equipa-cabecalho h2,
.sobre__equipa-cabecalho p {
  margin: 0;
}

.sobre__equipa-cabecalho p {
  color: var(--texto-suave);
  font-size: 0.85rem;
}

.sobre__membros {
  margin: 0;
  padding: 0;
  gap: 1px;
  list-style: none;
  background: var(--linha);
}

.sobre__membro {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.55rem 0.9rem;
  height: 100%;
  padding: 1.05rem clamp(1rem, 3vw, 1.35rem);
  background: #fff;
  color: var(--tinta);
  text-decoration: none;
}

.sobre__membro:hover {
  background: #f3f7f0;
}

.sobre__membro:focus-visible {
  outline-offset: -3px;
}

.sobre__membro h3 {
  margin-bottom: 0.2rem;
  font-size: 1rem;
  font-weight: 650;
}

.sobre__numero,
.sobre__github {
  font-size: 0.82rem;
}

.sobre__numero {
  color: var(--texto-suave);
}

.sobre__github {
  color: var(--verde-profundo);
  font-weight: 600;
  overflow-wrap: anywhere;
}

.sobre__github span {
  margin-left: 0.15rem;
}

.sobre__membro:hover .sobre__github {
  text-decoration: underline;
}

@media (min-width: 680px) {
  .sobre__cabecalho {
    grid-template-columns: minmax(0, 1fr) 11.5rem;
  }

  .sobre__marca {
    display: grid;
    place-items: center;
    justify-self: end;
    width: 9.2rem;
    aspect-ratio: 1;
    border: 1px solid #d5e3d6;
    border-radius: 50%;
    background: repeating-radial-gradient(circle, transparent 0 17px, #d8e6d8 18px 19px);
    color: var(--verde-profundo);
  }

  .sobre__marca svg {
    width: 3.9rem;
    height: 3.9rem;
    padding: 1rem;
    border: 1px solid #c5dccc;
    border-radius: 50%;
    background: #faf9f2;
    box-shadow: 0 5px 15px #245a4915;
  }

  .sobre__informacoes,
  .sobre__membros {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .sobre__painel + .sobre__painel {
    border-top: 0;
    border-left: 1px solid var(--linha);
  }
}
</style>
