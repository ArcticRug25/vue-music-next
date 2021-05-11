<template>
  <transition name="mini">
    <div class="mini-player" v-show="!fullScreen" @click="showNormalPlayer">
      <div class="cd-wrapper">
        <div ref="cdRef" class="cd">
          <img
            ref="cdImageRef"
            width="45"
            height="45"
            :src="currentSong.pic"
            :class="cdCls"
          />
        </div>
      </div>
      <div ref="sliderWrapperRef" class="slider-wrapper">
        <div class="slider-group">
          <div class="slider-page" v-for="song in playList" :key="song.id">
            <h2 class="name">{{ song.name }}</h2>
            <p class="desc">{{ song.singer }}</p>
          </div>
        </div>
      </div>
      <div class="control">
        <ProgressCircle :radius="32" :progress="progress">
          <i
            class="icon-mini"
            :class="miniPlayIcon"
            @click.stop="togglePlay"
          ></i>
        </ProgressCircle>
      </div>
      <div class="control" @click.stop="showPlayList">
        <i class="icon-playlist"></i>
      </div>
      <PlayList ref="playListRef" />
    </div>
  </transition>
</template>

<script>
import { useStore } from 'vuex'
import { ref, computed } from 'vue'
import useCd from '../cd/use-cd'
import ProgressCircle from './progress-circle'
import useMiniSlider from './use-mini-slider'
import PlayList from '../play-list'

export default {
  name: 'mini-player',
  components: {
    ProgressCircle,
    PlayList
  },
  props: {
    progress: {
      type: Number,
      default: 0
    },
    songReady: Boolean
  },
  setup(props) {
    const playListRef = ref(null)
    const store = useStore()
    const state = store.state
    const fullScreen = computed(() => state.fullScreen)
    const currentSong = computed(() => store.getters.currentSong)
    const playing = computed(() => state.playing)
    const playList = computed(() => state.playList)

    const { sliderWrapperRef } = useMiniSlider()

    const { cdCls, cdRef, cdImageRef } = useCd()

    const miniPlayIcon = computed(() =>
      playing.value ? 'icon-pause-mini' : 'icon-play-mini'
    )

    function togglePlay() {
      if (!props.songReady) return
      store.commit('setPlayingState', !playing.value)
    }

    function showNormalPlayer() {
      store.commit('setFullScreen', true)
    }

    function showPlayList() {
      playListRef.value.show()
    }

    return {
      fullScreen,
      currentSong,
      showNormalPlayer,
      miniPlayIcon,
      togglePlay,
      playList,
      showPlayList,
      playListRef,
      // useCd
      cdCls,
      cdRef,
      cdImageRef,
      // useMiniSlider
      sliderWrapperRef
    }
  }
}
</script>

<style lang="scss" scoped>
.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 180;
  width: 100%;
  height: 60px;
  background-color: $color-highlight-background;

  .cd-wrapper {
    flex: 0 0 45px;
    width: 45px;
    height: 45px;
    padding: 0 15px 0 15px;

    .cd {
      height: 100%;
      width: 100%;

      img {
        border-radius: 50%;
        box-shadow: 0 0 8px rgba($color: #000000, $alpha: 0.4);

        &.playing {
          animation: rotate 10s linear infinite;
        }

        &.pause {
          animation-play-state: paused;
        }
      }
    }
  }

  .slider-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;

    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;

      .slider-page {
        display: inline-block;
        width: 100%;
        transform: translate3d(0, 0, 0);
        /* 背向用户时 是否可见 */
        backface-visibility: hidden;

        .name {
          margin-bottom: 2px;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text;
        }

        .desc {
          @include no-wrap();
          font-size: $font-size-small;
          color: $color-text-d;
        }
      }
    }
  }

  .control {
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;

    .icon-playlist {
      position: relative;
      top: -2px;
      font-size: 28px;
      color: $color-theme-d;
    }

    .icon-mini {
      position: absolute;
      left: 0;
      top: 0;
      color: $color-theme-d;
      font-size: 32px;
    }
  }

  &.mini-enter-active,
  &.mini-leave-active {
    transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
  }

  &.mini-enter-from,
  &.mini-leave-to {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
}
</style>
