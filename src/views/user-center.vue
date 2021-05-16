<template>
  <div class="user-center" v-no-result:[noResultText]="noResult">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <div class="switches-wrapper">
      <Switches :items="['我喜欢的', '最近播放']" v-model="currentIndex" />
    </div>
    <div class="play-btn" v-if="currentList.length" @click="playAll">
      <i class="icon-play"></i>
      <span class="text">播放全部</span>
    </div>
    <div class="list-wrapper">
      <Scroll class="list-scroll" v-if="currentIndex === 0">
        <div class="list-inner">
          <SongList
            :songs="favouriteList"
            showDelete
            @select="selectSong"
            @delete="cancelFavourite"
          />
        </div>
      </Scroll>
      <Scroll class="list-scroll" v-if="currentIndex === 1">
        <div class="list-inner">
          <SongList
            :songs="playHistory"
            showDelete
            @select="selectSong"
            @delete="deletePlay"
          />
        </div>
      </Scroll>
    </div>
  </div>
</template>

<script>
import Switches from '@/components/base/switches'
import Scroll from '@/components/base/scroll'
import SongList from '@/components/base/song-list'
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import usePlayHistory from '@/components/player/use-play-history'
import useFavourite from '@/components/player/operators/use-favourite'

export default {
  name: 'user-center',
  components: {
    Switches,
    Scroll,
    SongList
  },
  setup() {
    const currentIndex = ref(0)
    const store = useStore()
    const state = store.state
    const router = useRouter()

    const { deletePlay } = usePlayHistory()

    const { cancelFavourite } = useFavourite()

    const favouriteList = computed(() => state.favouriteList)
    const playHistory = computed(() => state.playHistory)

    const noResult = computed(() => {
      return currentIndex.value === 0
        ? !favouriteList.value.length
        : !playHistory.value.length
    })

    const noResultText = computed(() => {
      return currentIndex.value === 0 ? '暂无收藏歌曲' : '暂无搜索记录'
    })

    const currentList = computed(() => {
      return currentIndex.value === 0 ? favouriteList.value : playHistory.value
    })

    function back() {
      router.back()
    }

    function selectSong({ song }) {
      console.log(song)
      store.dispatch('addSong', song)
    }

    function playAll() {
      store.dispatch('selectPlay', { list: currentList.value, index: 0 })
    }

    return {
      currentIndex,
      favouriteList,
      playHistory,
      noResult,
      noResultText,
      currentList,
      back,
      selectSong,
      playAll,
      // usePlayHistory
      deletePlay,
      // useFavourite
      cancelFavourite
    }
  }
}
</script>

<style lang="scss" scoped>
.user-center {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  background: $color-background;

  .back {
    position: absolute;
    top: 5px;
    left: 6px;
    z-index: 50;

    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }

  .switches-wrapper {
    margin: 10px 0 30px 0;
  }

  .play-btn {
    box-sizing: border-box;
    width: 135px;
    padding: 7px 0;
    margin: 0 auto;
    text-align: center;
    border: 1px solid $color-text-l;
    color: $color-text-l;
    border-radius: 100px;
    font-size: 0;

    .icon-play {
      display: inline-block;
      vertical-align: middle;
      margin-right: 6px;
      font-size: $font-size-medium-x;
    }

    .text {
      display: inline-block;
      vertical-align: middle;
      font-size: $font-size-small;
    }
  }

  .list-wrapper {
    position: absolute;
    top: 110px;
    bottom: 0;
    width: 100%;

    .list-scroll {
      height: 100%;
      overflow: hidden;

      .list-inner {
        padding: 20px 30px;
      }
    }
  }
}
</style>
