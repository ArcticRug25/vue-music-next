<template>
  <div class="player">
    <div class="normal-player" v-show="fullScreen">
      <!-- 如果currentSong 为undefined 则不渲染 防止下面报错不执行 -->
      <template v-if="currentSong">
        <div class="background">
          <img :src="currentSong.pic" />
        </div>
        <div class="top">
          <div class="back" @click="goBack">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{ currentSong.name }}</h1>
          <h2 class="subtitle">{{ currentSong.singer }}</h2>
        </div>
        <div class="bottom">
          <Operators @loop="loop" :songReady="songReady" />
        </div>
      </template>
    </div>
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
    ></audio>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import Operators from './operators'

export default {
  name: 'player',
  components: {
    Operators
  },
  setup() {
    const audioRef = ref(null)
    const songReady = ref(false)
    const store = useStore()

    const fullScreen = computed(() => store.state.fullScreen)
    const currentSong = computed(() => store.getters.currentSong)
    const playing = computed(() => store.state.playing)

    watch(currentSong, newSong => {
      if (!newSong.id || !newSong.url) return
      songReady.value = false
      const audioEl = audioRef.value
      audioEl.src = newSong.url
      audioEl.play()
    })

    watch(playing, newPlaying => {
      if (!songReady.value) return
      const audioEl = audioRef.value
      newPlaying ? audioEl.play() : audioEl.pause()
    })

    const goBack = () => {
      store.commit('setFullScreen', false)
    }

    const pause = () => {
      store.commit('setPlayingState', false)
    }

    const loop = () => {
      const audioEl = audioRef.value
      audioEl.currentTime = 0
      audioEl.play()
    }

    const ready = () => {
      if (songReady.value) return
      songReady.value = true
    }

    const error = () => {
      songReady.value = true
    }

    return {
      fullScreen,
      currentSong,
      audioRef,
      goBack,
      pause,
      loop,
      ready,
      error,
      songReady
    }
  }
}
</script>

<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background-color: $color-background;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);

      img {
        width: 100%;
        height: 100%;
      }
    }

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }

      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }

      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }

      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
    }
  }
}
</style>
