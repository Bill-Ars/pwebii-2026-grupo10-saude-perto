// Cria a cópia local do dataset (public/dados/<cidade>.json) a partir da Overpass API.
// A aplicação mostra esta cópia de imediato e actualiza-a em segundo plano.
// Uso: npm run dados            (todas as cidades)
//      npm run dados -- beira   (só algumas cidades)
import { writeFile, mkdir } from 'node:fs/promises'
import { CIDADES } from '../src/data/cidades.js'
import { consultaCidade } from '../src/services/overpass.js'

const SERVIDORES = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
]
// A Overpass API recusa (HTTP 406) pedidos sem identificação da aplicação
const CABECALHOS = {
  'Content-Type': 'application/x-www-form-urlencoded',
  Accept: 'application/json',
  'User-Agent': 'SaudePerto/1.0 (projecto academico ISUTC; https://github.com/Bill-Ars/pwebii-2026-grupo10-saude-perto)',
}
const TEMPO_MAXIMO_MS = 90_000

const pasta = new URL('../public/dados/', import.meta.url)
await mkdir(pasta, { recursive: true })

/** Pede aos três servidores ao mesmo tempo e devolve a primeira resposta válida. */
async function pedir(consulta) {
  const controlador = new AbortController()
  const temporizador = setTimeout(() => controlador.abort(), TEMPO_MAXIMO_MS)
  const corpo = 'data=' + encodeURIComponent(consulta)
  try {
    return await Promise.any(
      SERVIDORES.map(async (url) => {
        const host = new URL(url).host
        const resposta = await fetch(url, { method: 'POST', headers: CABECALHOS, body: corpo, signal: controlador.signal })
        if (!resposta.ok) throw new Error(`${host}: HTTP ${resposta.status}`)
        const json = await resposta.json()
        return { json, host }
      }),
    )
  } catch (erro) {
    const motivos = erro.errors?.map((e) => (e.name === 'AbortError' ? 'tempo esgotado' : e.message)).join('; ')
    throw new Error(motivos || erro.message)
  } finally {
    controlador.abort() // cancela os pedidos que ainda estão em curso
    clearTimeout(temporizador)
  }
}

const pedidas = process.argv.slice(2)
const cidades = pedidas.length ? CIDADES.filter((c) => pedidas.includes(c.id)) : CIDADES
let sucesso = 0

for (const cidade of cidades) {
  process.stdout.write(`A obter ${cidade.nome}… `)
  for (let tentativa = 1; tentativa <= 2; tentativa++) {
    try {
      const { json, host } = await pedir(consultaCidade(cidade))
      const conteudo = {
        fonte: 'OpenStreetMap (Overpass API)',
        licenca: 'ODbL 1.0, © contribuidores do OpenStreetMap',
        recolhidoEm: new Date().toISOString(),
        cidade: cidade.id,
        osm3s: json.osm3s,
        elements: json.elements,
      }
      await writeFile(new URL(`${cidade.id}.json`, pasta), JSON.stringify(conteudo))
      console.log(`${json.elements.length} unidades (via ${host})`)
      sucesso++
      break
    } catch (erro) {
      if (tentativa === 2) console.log(`falhou (${erro.message})`)
      else await new Promise((r) => setTimeout(r, 5000))
    }
  }
  // Pausa entre cidades, para respeitar os limites de utilização da Overpass API
  await new Promise((r) => setTimeout(r, 2000))
}

console.log(`\n${sucesso} de ${cidades.length} cidades guardadas em public/dados/.`)
if (sucesso < cidades.length) console.log('Para repetir só as que falharam: npm run dados -- <id> (ex.: npm run dados -- beira tete)')
