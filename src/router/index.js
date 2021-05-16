import {
  createRouter,
  createWebHashHistory
} from 'vue-router'

const Recommend = () => import(/* webpackChunkName: 'recommend' */ '@/views/recommend.vue')
const Album = () => import(/* webpackChunkName: 'Album' */ '@/views/album.vue')
const Singer = () => import(/* webpackChunkName: 'singer' */ '@/views/singer')
const SingerDetail = () => import(/* webpackChunkName: 'SingerDetail' */ '@/views/singer-detail')
const TopList = () => import(/* webpackChunkName: 'top-list' */ '@/views/top-list')
const TopDetail = () => import(/* webpackChunkName: 'top-detail' */ '@/views/top-detail')
const Search = () => import(/* webpackChunkName: 'search' */ '@/views/search')
const User = () => import(/* webpackChunkName: 'user' */ '@/views/user-center')

const routes = [{
  path: '/',
  redirect: '/recommend'
}, {
  path: '/recommend',
  component: Recommend,
  meta: {
    index: 0
  },
  children: [{
    path: ':id',
    component: Album
  }]
}, {
  path: '/singer',
  component: Singer,
  meta: {
    index: 1
  },
  children: [{
    path: ':id',
    component: SingerDetail
  }]
}, {
  path: '/top-list',
  component: TopList,
  meta: {
    index: 2
  },
  children: [{
    path: ':id',
    component: TopDetail
  }]
}, {
  path: '/search',
  meta: {
    index: 3
  },
  component: Search,
  children: [{
    path: ':id',
    component: SingerDetail
  }]
}, {
  path: '/user',
  components: {
    // user 对应 命名视图的 name 字段 <router-view name="user" />
    user: User
  }
}]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
