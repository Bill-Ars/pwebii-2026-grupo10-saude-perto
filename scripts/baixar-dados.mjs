// Cria uma cópia local do dataset (public/dados/<cidade>.json) a partir da Overpass API.
// A aplicação usa esta cópia apenas se a API estiver indisponível.
// Uso: npm run dados
import { writeFile, mkdir } from "node:fs/promises";
import { CIDADES } from "../src/data/cidades.js";
import { consultaCidade } from "../src/services/overpass.js";

const SERVIDORES = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];
// A Overpass API recusa (HTTP 406) pedidos sem identificação da aplicação
const CABECALHOS = {
  "Content-Type": "application/x-www-form-urlencoded",
  Accept: "application/json",
  "User-Agent":
    "SaudePerto/1.0 (projecto academico ISUTC; https://github.com/Bill-Ars/pwebii-2026-grupo10-saude-perto)",
};

const pasta = new URL("../public/dados/", import.meta.url);
await mkdir(pasta, { recursive: true });

async function pedir(consulta) {
  let ultimoErro;
  for (const url of SERVIDORES) {
    try {
      const resposta = await fetch(url, {
        method: "POST",
        headers: CABECALHOS,
        body: "data=" + encodeURIComponent(consulta),
      });
      if (!resposta.ok)
        throw new Error(`HTTP ${resposta.status} em ${new URL(url).host}`);
      return await resposta.json();
    } catch (erro) {
      ultimoErro = erro;
    }
  }
  throw ultimoErro;
}

for (const cidade of CIDADES) {
  process.stdout.write(`A obter ${cidade.nome}… `);
  try {
    const json = await pedir(consultaCidade(cidade));
    const conteudo = {
      fonte: "OpenStreetMap (Overpass API)",
      licenca: "ODbL 1.0, © contribuidores do OpenStreetMap",
      recolhidoEm: new Date().toISOString(),
      cidade: cidade.id,
      elements: json.elements,
    };
    await writeFile(
      new URL(`${cidade.id}.json`, pasta),
      JSON.stringify(conteudo),
    );
    console.log(`${json.elements.length} elementos`);
  } catch (erro) {
    console.log(`falhou (${erro.message})`);
  }
  // Pausa entre pedidos, para respeitar os limites de utilização da Overpass API
  await new Promise((r) => setTimeout(r, 3000));
}
