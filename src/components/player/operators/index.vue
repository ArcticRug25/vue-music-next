<template>
  <div class="operators">
    <div class="icon i-left">
      <i :class="modeIcon" @click="changeMode"></i>
    </div>
    <div class="icon i-left" :class="disableCls">
      <i class="icon-prev" @click="prev"></i>
    </div>
    <div class="icon i-center" :class="disableCls">
      <i :class="playIcon" @click="togglePlay"></i>
    </div>
    <div class="icon i-right" :class="disableCls">
      <i class="icon-next" @click="next"></i>
    </div>
    <div class="icon i-right">
      <i
        :class="getFavouriteIcon(currentSong)"
        @click="toggleFavourite(currentSong)"
      ></i>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
import useMode from './use-mode'
import useFavourite from './use-favourite'

export default {
  name: 'operators',
  props: {
    songReady: Boolean
  },
  emits: ['loop'],
  setup(props, { emit }) {
    const store = useStore()
    const state = store.state

    const { modeIcon, changeMode } = useMode()
    const { getFavouriteIcon, toggleFavourite } = useFavourite()

    const playing = computed(() => state.playing)
    const playIcon = computed(() =>
      playing.value ? 'icon-pause' : 'icon-play'
    )
    const currentIndex = computed(() => state.currentIndex)
    const currentSong = computed(() => store.getters.currentSong)
    const playList = computed(() => state.playList)
    const disableCls = computed(() => (props.songReady ? '' : 'disable'))

    const togglePlay = () => {
      if (!props.songReady) return
      store.commit('setPlayingState', !playing.value)
    }

    const prev = () => {
      const list = playList.value
      const listLen = list.length
      if (!props.songReady || listLen === 0) return
      if (listLen === 1) {
        emit('loop')
      }

      let index = currentIndex.value - 1
      if (index === -1) {
        index = listLen - 1
      }

      store.commit('setCurrentIndex', index)
    }

    const next = () => {
      const list = playList.value
      const listLen = list.length
      if (!props.songReady || listLen === 0) return
      if (listLen === 1) {
        emit('loop')
      }

      let index = currentIndex.value + 1
      if (index === listLen) {
        index = 0
      }

      store.commit('setCurrentIndex', index)
    }

    return {
      playIcon,
      togglePlay,
      prev,
      next,
      disableCls,
      currentSong,
      // mode
      modeIcon,
      changeMode,
      // favourite
      getFavouriteIcon,
      toggleFavourite
    }
  }
}
</script>

<style lang="scss" scoped>
.operators {
  display: flex;
  align-items: center;

  .icon {
    flex: 1;
    color: $color-theme;

    &.disable {
      color: $color-theme-d;
    }

    i {
      font-size: 30px;
    }
  }

  .i-left {
    text-align: right;
  }

  .i-center {
    padding: 0 20px;
    text-align: center;

    i {
      font-size: 40px;
    }
  }

  .i-right {
    text-align: left;
  }

  .icon-favorite {
    color: $color-sub-theme;
  }
}
</style>
