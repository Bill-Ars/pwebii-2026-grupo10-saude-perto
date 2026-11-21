// Módulo de acesso aos dados do OpenStreetMap (OSM) através da Overpass API.
// Todos os pedidos à fonte de dados passam por aqui; os componentes nunca chamam fetch directamente.

const SERVIDORES = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
]

const TEMPO_MAXIMO_MS = 25000

// Correspondência entre as etiquetas do OSM e os tipos da aplicação (ver data/tipos.js)
const MAPA_TIPOS = {
  hospital: 'hospital',
  clinic: 'centro',
  centre: 'centro',
  doctors: 'consultorio',
  doctor: 'consultorio',
  pharmacy: 'farmacia',
}

const NOMES_TIPOS = {
  hospital: 'Hospital',
  centro: 'Centro de saúde',
  consultorio: 'Consultório',
  farmacia: 'Farmácia',
}

/**
 * Consulta Overpass QL com as unidades de saúde dentro da área da cidade.
 * Procura apenas a etiqueta "amenity" (a mais usada no OpenStreetMap): a consulta fica
 * muito mais rápida do que procurar também "healthcare=*".
 */
export function consultaCidade(cidade) {
  const caixa = cidade.bbox.join(',')
  return `[out:json][timeout:25];
nwr["amenity"~"^(hospital|clinic|doctors|pharmacy)$"](${caixa});
out center tags;`
}

/** Consulta Overpass QL para um único elemento (node, way ou relation). */
export function consultaElemento(osmType, osmId) {
  return `[out:json][timeout:15];${osmType}(${osmId});out center tags;`
}

/** Um pedido a um servidor. Rejeita se falhar, se demorar demasiado ou se for cancelado. */
async function pedirAUmServidor(url, consulta, signal) {
  const resposta = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'data=' + encodeURIComponent(consulta),
    signal,
  })
  if (!resposta.ok) throw new Error(`O servidor ${new URL(url).host} respondeu com o código ${resposta.status}`)
  const json = await resposta.json()
  return json.elements ?? []
}

/**
 * Envia a consulta aos servidores da Overpass API AO MESMO TEMPO e usa a primeira resposta
 * válida (Promise.any); os restantes pedidos são cancelados. Se todos falharem, tenta mais uma vez.
 * Usa POST com "application/x-www-form-urlencoded" (pedido simples, sem preflight CORS).
 */
export async function pedirOverpass(consulta, { signal } = {}) {
  let ultimoErro = new Error('Sem servidores disponíveis')

  for (let ronda = 1; ronda <= 2; ronda++) {
    if (ronda > 1) await esperar(2000, signal)

    const controlador = new AbortController()
    const cancelar = () => controlador.abort()
    signal?.addEventListener('abort', cancelar)
    const temporizador = setTimeout(cancelar, TEMPO_MAXIMO_MS)

    try {
      const pedidos = SERVIDORES.map((url) =>
        pedirAUmServidor(url, consulta, controlador.signal).catch((erro) => {
          if (!controlador.signal.aborted) console.warn('Overpass: tentativa falhou —', erro.message)
          throw erro
        }),
      )
      return await Promise.any(pedidos)
    } catch (erro) {
      if (signal?.aborted) throw new DOMException('Pedido cancelado', 'AbortError')
      ultimoErro = erro.errors?.at(-1) ?? erro
    } finally {
      controlador.abort() // cancela os pedidos que ainda estão em curso
      clearTimeout(temporizador)
      signal?.removeEventListener('abort', cancelar)
    }
  }

  throw ultimoErro
}

function esperar(ms, signal) {
  return new Promise((resolver, rejeitar) => {
    const t = setTimeout(resolver, ms)
    signal?.addEventListener('abort', () => {
      clearTimeout(t)
      rejeitar(new DOMException('Pedido cancelado', 'AbortError'))
    }, { once: true })
  })
}

/**
 * Cópia local do dataset (public/dados/<cidade>.json), criada com "npm run dados".
 * Serve de alternativa quando a Overpass API está lenta ou fora do ar.
 */
export async function carregarCopiaLocal(cidadeId, { signal } = {}) {
  const resposta = await fetch(`${import.meta.env.BASE_URL}dados/${cidadeId}.json`, { signal })
  if (!resposta.ok) throw new Error('Cópia local não disponível')
  return resposta.json()
}

/** Converte um elemento do OSM num objecto simples e consistente para a interface. */
export function normalizarElemento(elemento, cidadeId = null) {
  const t = elemento.tags ?? {}
  const tipo = MAPA_TIPOS[t.amenity] ?? MAPA_TIPOS[t.healthcare] ?? 'centro'
  const nome = t.name || t['name:pt'] || t.official_name || null

  const rua = [t['addr:street'], t['addr:housenumber']].filter(Boolean).join(', ')
  const endereco = [rua, t['addr:suburb'], t['addr:city']].filter(Boolean).join(' · ')

  const telefoneBruto = t.phone || t['contact:phone'] || t['contact:mobile'] || ''
  const telefones = telefoneBruto
    .split(/[;,/]/)
    .map((n) => n.trim())
    .filter(Boolean)

  return {
    id: `${elemento.type}-${elemento.id}`,
    osmType: elemento.type,
    osmId: String(elemento.id),
    cidadeId,
    nome: nome ?? `${NOMES_TIPOS[tipo]} sem nome registado`,
    temNome: Boolean(nome),
    tipo,
    lat: elemento.lat ?? elemento.center?.lat ?? null,
    lon: elemento.lon ?? elemento.center?.lon ?? null,
    telefones,
    horario: t.opening_hours || null,
    endereco: endereco || null,
    operador: t.operator || null,
    urgencia: t.emergency === 'yes',
    website: t.website || t['contact:website'] || null,
  }
}

/** Normaliza, remove duplicados e elementos sem coordenadas, e ordena (com nome primeiro). */
export function normalizarLista(elementos, cidadeId) {
  const vistos = new Set()
  return elementos
    .map((elemento) => normalizarElemento(elemento, cidadeId))
    .filter((u) => u.lat !== null && u.lon !== null)
    .filter((u) => {
      if (vistos.has(u.id)) return false
      vistos.add(u.id)
      return true
    })
    .sort((a, b) => Number(b.temNome) - Number(a.temNome) || a.nome.localeCompare(b.nome, 'pt'))
}
