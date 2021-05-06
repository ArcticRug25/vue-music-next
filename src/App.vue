<template>
  <MHeader />
  <Tab />
  <RouterView />
  <Player />
</template>
<script>
import Header from '@/components/header'
import Tab from '@/components/tab'
import Player from '@/components/player'

export default {
  components: {
    MHeader: Header,
    Tab,
    Player
  }
}
</script>

<style lang="scss"></style>
