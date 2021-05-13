import MusicList from '@/components/music-list'
import storage from 'good-storage'
import {
  processSongs
} from '@/service/song'

export default function createDetailComponent(name, key, fetch) {
  return {
    name,
    components: {
      MusicList
    },
    props: {
      data: Object
    },
    data() {
      return {
        songs: [],
        loading: true
      }
    },
    computed: {
      computedData() {
        let ret = null
        const data = this.data
        if (data) {
          ret = data
        } else {
          const cached = storage.session.get(key)
          if (cached && cached.mid === this.$route.params.id) {
            ret = cached
          }
        }
        return ret
      },
      pic() {
        const data = this.computedData
        return data && data.pic
      },
      title() {
        const data = this.computedData
        return data && data.name
      }
    },
    async created() {
      if (!this.computedData) {
        // 匹配一级路由路径
        const path = this.$route.matched[0].path
        this.$router.push(path)
        return
      }
      const result = await fetch(this.computedData)
      this.songs = await processSongs(result.songs)
      this.loading = false
    }
  }
}
