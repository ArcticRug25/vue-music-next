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
          <div class="progress-wrapper">
            <span class="time time-l">{{ formatTime(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <ProgressBar
                :progress="progress"
                @progress-changing="onProgressChanging"
                @progress-changed="onProgressChanged"
                @progress-click="onProgressClick"
              />
            </div>
            <span class="time time-r">{{
              formatTime(currentSong.duration)
            }}</span>
          </div>
          <Operators @loop="loop" :songReady="songReady" />
        </div>
      </template>
    </div>
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import { formatTime } from '@/assets/js/util'
import Operators from './operators'
import ProgressBar from './progress-bar'
import { PLAY_MODE } from '@/assets/js/constant'

export default {
  name: 'player',
  components: {
    Operators,
    ProgressBar
  },
  setup() {
    const audioRef = ref(null)
    const songReady = ref(false)
    const store = useStore()
    const state = store.state
    const currentTime = ref(0)
    let progressChanging = false

    const fullScreen = computed(() => state.fullScreen)
    const currentSong = computed(() => store.getters.currentSong)
    const playing = computed(() => state.playing)
    const playMode = computed(() => state.playMode)
    const progress = computed(
      () => currentTime.value / currentSong.value.duration
    )

    watch(currentSong, newSong => {
      if (!newSong.id || !newSong.url) return
      currentTime.value = 0
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
      store.commit('setPlayingState', true)
    }

    const ready = () => {
      if (songReady.value) return
      songReady.value = true
    }

    const error = () => {
      songReady.value = true
    }

    const updateTime = e => {
      // 在拖动时 歌曲自身播放时间禁止改变
      if (progressChanging) return
      currentTime.value = e.target.currentTime
    }

    function onProgressChanging(progress) {
      progressChanging = true
      currentTime.value = currentSong.value.duration * progress
    }

    function onProgressChanged(progress) {
      progressChanging = false
      audioRef.value.currentTime = currentTime.value =
        currentSong.value.duration * progress
      if (!playing.value) {
        store.commit('setPlayingState', true)
      }
    }

    function onProgressClick(progress) {
      audioRef.value.currentTime = currentTime.value =
        currentSong.value.duration * progress
      if (!playing.value) {
        store.commit('setPlayingState', true)
      }
    }

    function end() {
      currentTime.value = 0
      if (playMode.value === PLAY_MODE.loop) {
        loop()
      }
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
      songReady,
      updateTime,
      end,
      currentTime,
      progress,
      formatTime,
      onProgressChanging,
      onProgressChanged,
      onProgressClick
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

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 85%;
        margin: 0px auto;
        padding: 10px 0;

        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 45px;
          line-height: 30px;
          width: 40px;

          &.time-l {
            text-align: left;
          }

          &.time-r {
            text-align: right;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
        }
      }
    }
  }
}
</style>
