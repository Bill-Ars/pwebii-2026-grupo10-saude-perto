// Tipos de unidade de saúde mostrados na aplicação.
export const TIPOS = {
  hospital: { id: 'hospital', nome: 'Hospital', plural: 'Hospitais', cor: '#b91c1c' },
  centro: { id: 'centro', nome: 'Centro de saúde', plural: 'Centros de saúde', cor: '#0f766e' },
  consultorio: { id: 'consultorio', nome: 'Consultório', plural: 'Consultórios', cor: '#7c3aed' },
  farmacia: { id: 'farmacia', nome: 'Farmácia', plural: 'Farmácias', cor: '#c2410c' },
}

export const LISTA_TIPOS = Object.values(TIPOS)
