// Módulo de acesso aos dados do OpenStreetMap (OSM) através da Overpass API.
// Todos os pedidos à fonte de dados passam por aqui; os componentes nunca chamam fetch directamente.

const SERVIDORES = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
]

const TEMPO_MAXIMO_MS = 30000

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

/** Consulta Overpass QL com todas as unidades de saúde dentro da área da cidade. */
export function consultaCidade(cidade) {
  const caixa = cidade.bbox.join(',')
  return `[out:json][timeout:25];
(
  nwr["amenity"~"^(hospital|clinic|doctors|pharmacy)$"](${caixa});
  nwr["healthcare"~"^(hospital|clinic|centre|doctor|pharmacy)$"](${caixa});
);
out center tags;`
}

/** Consulta Overpass QL para um único elemento (node, way ou relation). */
export function consultaElemento(osmType, osmId) {
  return `[out:json][timeout:15];${osmType}(${osmId});out center tags;`
}

/**
 * Envia a consulta à Overpass API. Se um servidor falhar, tenta o seguinte.
 * Usa POST com "application/x-www-form-urlencoded" (pedido simples, sem preflight CORS).
 */
export async function pedirOverpass(consulta, { signal } = {}) {
  let ultimoErro = new Error('Sem servidores disponíveis')

  for (const url of SERVIDORES) {
    const controlador = new AbortController()
    const cancelar = () => controlador.abort()
    signal?.addEventListener('abort', cancelar)
    const temporizador = setTimeout(cancelar, TEMPO_MAXIMO_MS)

    try {
      const resposta = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'data=' + encodeURIComponent(consulta),
        signal: controlador.signal,
      })
      if (!resposta.ok) throw new Error(`O servidor respondeu com o código ${resposta.status}`)
      const json = await resposta.json()
      return json.elements ?? []
    } catch (erro) {
      // Se foi o utilizador (ou a mudança de página) a cancelar, não tentamos outro servidor
      if (signal?.aborted) throw new DOMException('Pedido cancelado', 'AbortError')
      ultimoErro = erro
    } finally {
      clearTimeout(temporizador)
      signal?.removeEventListener('abort', cancelar)
    }
  }

  throw ultimoErro
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
