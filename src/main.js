import {
  createApp
} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 图片懒加载
import lazyPlugin from 'vue3-lazy'

// 自定义指令
import initDirectives from '@/directives'

// 引入全局样式文件
import '@/assets/scss/index.scss'

const app = createApp(App)

initDirectives(app)

app.use(store).use(router).use(lazyPlugin, {
  loading: require('@/assets/images/default.png')
}).mount('#app')
