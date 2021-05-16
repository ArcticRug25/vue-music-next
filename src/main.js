import {
  createApp
} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 初始化个人储存的音乐地址数据
import {
  load,
  saveAll
} from '@/assets/js/array-store'
import {
  FAVOURITE_KEY,
  PLAY_KEY
} from '@/assets/js/constant'
import {
  processSongs
} from '@/service/song'

// 图片懒加载
import lazyPlugin from 'vue3-lazy'

// 自定义指令
import initDirectives from '@/directives'

// 引入全局样式文件
import '@/assets/scss/index.scss'

const app = createApp(App)

const favouriteSongs = load(FAVOURITE_KEY)
if (favouriteSongs.length > 0) {
  processSongs(favouriteSongs).then(songs => {
    store.commit('setFavouriteList', songs)
    saveAll(songs, FAVOURITE_KEY)
  })
}

const historySongs = load(PLAY_KEY)
if (historySongs.length > 0) {
  processSongs(historySongs).then(songs => {
    store.commit('setPlayHistory', songs)
    saveAll(songs, PLAY_KEY)
  })
}

initDirectives(app)

app.use(store).use(router).use(lazyPlugin, {
  loading: require('@/assets/images/default.png')
}).mount('#app')
