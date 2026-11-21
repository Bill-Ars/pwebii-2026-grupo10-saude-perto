// Cidades disponíveis na aplicação.
// "bbox" é a área de pesquisa no mapa: [sul, oeste, norte, este] (latitude/longitude).
// Isto é configuração da aplicação; os dados das unidades de saúde vêm do OpenStreetMap.
export const CIDADES = [
  { id: 'maputo', nome: 'Maputo', provincia: 'Maputo Cidade', centro: [-25.9692, 32.5732], bbox: [-26.08, 32.45, -25.8, 32.7] },
  { id: 'matola', nome: 'Matola', provincia: 'Maputo Província', centro: [-25.9622, 32.4589], bbox: [-26.05, 32.33, -25.85, 32.5] },
  { id: 'xai-xai', nome: 'Xai-Xai', provincia: 'Gaza', centro: [-25.0519, 33.6442], bbox: [-25.1, 33.58, -25.0, 33.72] },
  { id: 'inhambane', nome: 'Inhambane e Maxixe', provincia: 'Inhambane', centro: [-23.865, 35.3833], bbox: [-23.92, 35.3, -23.8, 35.45] },
  { id: 'beira', nome: 'Beira', provincia: 'Sofala', centro: [-19.8436, 34.8389], bbox: [-19.92, 34.78, -19.7, 34.95] },
  { id: 'chimoio', nome: 'Chimoio', provincia: 'Manica', centro: [-19.1164, 33.4833], bbox: [-19.18, 33.42, -19.06, 33.54] },
  { id: 'tete', nome: 'Tete', provincia: 'Tete', centro: [-16.1564, 33.5867], bbox: [-16.22, 33.52, -16.1, 33.66] },
  { id: 'quelimane', nome: 'Quelimane', provincia: 'Zambézia', centro: [-17.8786, 36.8883], bbox: [-17.94, 36.82, -17.82, 36.95] },
  { id: 'nampula', nome: 'Nampula', provincia: 'Nampula', centro: [-15.1165, 39.2666], bbox: [-15.2, 39.18, -15.04, 39.35] },
  { id: 'pemba', nome: 'Pemba', provincia: 'Cabo Delgado', centro: [-12.974, 40.5178], bbox: [-13.05, 40.45, -12.93, 40.57] },
  { id: 'lichinga', nome: 'Lichinga', provincia: 'Niassa', centro: [-13.3128, 35.2406], bbox: [-13.37, 35.18, -13.25, 35.3] },
]

export function obterCidade(id) {
  return CIDADES.find((cidade) => cidade.id === id) ?? null
}

/** Cidade cujo centro está mais perto das coordenadas indicadas. */
export function cidadeMaisProxima({ lat, lon }) {
  let melhor = null
  let menorDistancia = Infinity
  for (const cidade of CIDADES) {
    const [cLat, cLon] = cidade.centro
    const d = (cLat - lat) ** 2 + (cLon - lon) ** 2
    if (d < menorDistancia) {
      menorDistancia = d
      melhor = cidade
    }
  }
  return melhor
}
