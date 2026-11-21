// Distância em linha recta entre dois pontos (fórmula de Haversine), em quilómetros.
export function calcularDistancia(origem, destino) {
  const R = 6371
  const rad = (graus) => (graus * Math.PI) / 180
  const dLat = rad(destino.lat - origem.lat)
  const dLon = rad(destino.lon - origem.lon)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(origem.lat)) * Math.cos(rad(destino.lat)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

export function formatarDistancia(km) {
  if (km == null || Number.isNaN(km)) return ''
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toLocaleString('pt-PT', { maximumFractionDigits: 1 })} km`
}
