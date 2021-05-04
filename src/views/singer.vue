<template>
  <div class="singer" v-loading="!singers.length">
    <SingerList :data="singers" />
  </div>
</template>

<script>
import { getSingerList } from '@/service/singer'
import SingerList from '@/components/singer-list'

export default {
  name: 'singer',
  components: {
    SingerList
  },
  data() {
    return {
      singers: []
    }
  },
  async created() {
    const result = await getSingerList()
    this.singers = result.singers
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
