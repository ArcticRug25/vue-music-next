<template>
  <Scroll ref="scrollRef" class="list-content">
    <TransitionGroup name="list" ref="listRef" tag="ul">
      <li
        class="item"
        v-for="song in sequenceList"
        :key="song.id"
        @click="selectItem(song)"
      >
        <i class="current" :class="getCurrentIcon(song)"></i>
        <span class="text">{{ song.name }}</span>
        <span class="favourite" @click.stop="toggleFavourite(song)">
          <i :class="getFavouriteIcon(song)"></i>
        </span>
        <span
          class="delete"
          :class="{ disable: removing }"
          @click.stop="removeSong(song)"
        >
          <i class="icon-delete"></i>
        </span>
      </li>
    </TransitionGroup>
  </Scroll>
</template>

<script>
import Scroll from '@/components/base/scroll'
import useFavourite from '../../operators/use-favourite'
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'song-list',
  components: {
    Scroll
  },
  emits: ['hide-list'],
  setup(_, { emit }) {
    const scrollRef = ref(null)
    const listRef = ref(null)
    const removing = ref(false)
    const store = useStore()
    const currentSong = computed(() => store.getters.currentSong)
    const sequenceList = computed(() => store.state.sequenceList)
    const playList = computed(() => store.state.playList)
    const { getFavouriteIcon, toggleFavourite } = useFavourite()

    function getCurrentIcon(song) {
      if (song.id === currentSong.value.id) {
        return 'icon-play'
      }
    }

    function refreshScroll() {
      scrollRef.value.scroll.refresh()
    }

    function scrollToCurrentSong() {
      const index = sequenceList.value.findIndex(
        song => currentSong.value.id === song.id
      )
      if (index === -1) return
      const target = listRef.value.$el.children[index]
      scrollRef.value.scroll.scrollToElement(target, 300)
    }

    function selectItem(song) {
      const index = playList.value.findIndex(item => item.id === song.id)
      store.commit('setCurrentIndex', index)
      store.commit('setPlayingState', true)
    }

    function removeSong(song) {
      if (removing.value) return
      removing.value = true
      store.dispatch('removeSong', song)
      if (!playList.value.length) {
        emit('hide-list')
      }
      setTimeout(() => {
        removing.value = false
      }, 300)
    }

    return {
      getFavouriteIcon,
      toggleFavourite,
      getCurrentIcon,
      removing,
      sequenceList,
      scrollRef,
      listRef,
      refreshScroll,
      scrollToCurrentSong,
      selectItem,
      removeSong
    }
  }
}
</script>

<style lang="scss" scoped>
.list-content {
  max-height: 240px;
  overflow: hidden;

  .item {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 30px 0 20px;
    overflow: hidden;

    .current {
      flex: 0 0 20px;
      width: 20px;
      font-size: $font-size-small;
      color: $color-theme-d;
    }

    .text {
      flex: 1;
      @include no-wrap();
      font-size: $font-size-medium;
      color: $color-text-d;
    }

    .favourite {
      @include extend-click();
      margin-right: 15px;
      font-size: $font-size-small;
      color: $color-theme;

      .icon-favorite {
        color: $color-sub-theme;
      }
    }

    .delete {
      @include extend-click();
      font-size: $font-size-small;
      color: $color-theme;

      &.disable {
        color: $color-theme-d;
      }
    }
  }
}
</style>
