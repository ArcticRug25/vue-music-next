import {
  createRouter,
  createWebHashHistory
} from 'vue-router'

const routes = [{
  path: '/',
  redirect: '/recommend'
}, {
  path: '/recommend',
  component: () => import(/* webpackChunkName: 'recommend' */ '@/views/recommend.vue'),
  children: [{
    path: ':id',
    component: () => import(/* webpackChunkName: 'Album' */ '@/views/album.vue')
  }]
}, {
  path: '/singer',
  component: () => import(/* webpackChunkName: 'singer' */ '@/views/singer'),
  children: [{
    path: ':id',
    component: () => import(/* webpackChunkName: 'SingerDetail' */ '@/views/singer-detail')
  }]
}, {
  path: '/top-list',
  component: () => import(/* webpackChunkName: 'top-list' */ '@/views/top-list'),
  children: [
    {
      path: ':id',
      component: () => import(/* webpackChunkName: 'top-detail */ '@/views/top-detail')
    }
  ]
}, {
  path: '/search',
  component: () => import(/* webpackChunkName: 'search' */ '@/views/search')
}]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
