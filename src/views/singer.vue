<template>
  <div class="singer" v-loading="!singers.length">
    <SingerList :data="singers" @select="selectSinger" />
    <RouterView v-slot="{ Component }">
      <Transition appear name="slide">
        <Component :is="Component" :singer="selectedSinger" />
      </Transition>
    </RouterView>
  </div>
</template>

<script>
import { getSingerList } from '@/service/singer'
import SingerList from '@/components/singer-list'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'

export default {
  name: 'singer',
  components: {
    SingerList
  },
  data() {
    return {
      singers: [],
      selectedSinger: null
    }
  },
  async created() {
    const result = await getSingerList()
    this.singers = result.singers
  },
  methods: {
    selectSinger(singer) {
      this.selectedSinger = singer
      this.cacheSinger(singer)
      this.$router.push({
        path: `/singer/${singer.mid}`
      })
    },
    cacheSinger(singer) {
      storage.session.set(SINGER_KEY, singer)
    }
  }
}
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>
