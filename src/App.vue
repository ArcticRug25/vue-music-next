<template>
  <MHeader />
  <Tab />
  <RouterView :style="viewStyle" />
  <Player />
</template>
<script>
import Header from '@/components/header'
import Tab from '@/components/tab'
import Player from '@/components/player'
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  components: {
    MHeader: Header,
    Tab,
    Player
  },
  setup() {
    const store = useStore()
    const playList = computed(() => store.state.playList)
    const viewStyle = computed(() => {
      const bottom = playList.value.length ? '60px' : '0'
      return {
        bottom
      }
    })

    return {
      viewStyle
    }
  }
}
</script>

<style lang="scss"></style>
