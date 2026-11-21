import { createRouter, createWebHashHistory } from 'vue-router'
import InicioView from '../views/InicioView.vue'
import { obterCidade } from '../data/cidades.js'

const routes = [
  { path: '/', name: 'inicio', component: InicioView, meta: { titulo: 'Início' } },
  {
    path: '/cidade/:cidadeId',
    name: 'cidade',
    component: () => import('../views/CidadeView.vue'),
    props: true,
    meta: { titulo: 'Unidades de saúde' },
    // Cidade inexistente → página 404 (sem mudar o endereço)
    beforeEnter: (to) =>
      obterCidade(to.params.cidadeId)
        ? true
        : { name: 'nao-encontrado', params: { caminho: to.path.slice(1).split('/') }, query: to.query },
  },
  {
    path: '/unidade/:osmType(node|way|relation)/:osmId(\\d+)',
    name: 'unidade',
    component: () => import('../views/UnidadeView.vue'),
    props: true,
    meta: { titulo: 'Detalhe da unidade' },
  },
  { path: '/sobre', name: 'sobre', component: () => import('../views/SobreView.vue'), meta: { titulo: 'Sobre' } },
  {
    path: '/:caminho(.*)*',
    name: 'nao-encontrado',
    component: () => import('../views/NaoEncontradoView.vue'),
    meta: { titulo: 'Página não encontrada' },
  },
]

const router = createRouter({
  // Hash history: as rotas funcionam no GitHub Pages mesmo ao actualizar a página
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach((to) => {
  document.title = to.meta.titulo ? `${to.meta.titulo} · Saúde Perto` : 'Saúde Perto'
})

export default router
