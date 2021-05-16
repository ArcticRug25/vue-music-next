<template>
  <MHeader />
  <Tab />
  <RouterView :style="viewStyle" v-slot="{ Component }">
    <Transition appear :name="sliderName">
      <KeepAlive>
        <Component :is="Component" />
      </KeepAlive>
    </Transition>
  </RouterView>
  <RouterView :style="viewStyle" name="user" v-slot="{ Component }">
    <Transition appear name="slide">
      <KeepAlive>
        <Component :is="Component" />
      </KeepAlive>
    </Transition>
  </RouterView>
  <Player />
</template>
<script>
import Header from '@/components/header'
import Tab from '@/components/tab'
import Player from '@/components/player'
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

export default {
  components: {
    MHeader: Header,
    Tab,
    Player
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const sliderName = ref('slide-left')

    const playList = computed(() => store.state.playList)

    const viewStyle = computed(() => {
      const bottom = playList.value.length ? '60px' : '0'
      return {
        bottom
      }
    })

    watch(
      () => route.meta.index,
      (newIndex, oldIndex) => {
        sliderName.value = newIndex > oldIndex ? 'slide-left' : 'slide-right'
      }
    )

    return {
      viewStyle,
      sliderName
    }
  }
}
</script>

<style lang="scss">
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s;
}

.slide-left-enter-from,
.slide-right-leave-to {
  transform: translate3d(100%, 0, 0);
}

.slide-right-enter-from,
.slide-left-leave-to {
  transform: translate3d(-100%, 0, 0);
}
</style>
