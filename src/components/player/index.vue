<template>
  <div class="player" v-show="playList.length">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <!-- 如果currentSong 为undefined 则不渲染 防止下面报错不执行 -->
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
        <div
          class="middle"
          @touchstart.prevent="onMiddleTouchStart"
          @touchmove.prevent="onMiddleTouchMove"
          @touchend.prevent="onMiddleTouchEnd"
        >
          <CD ref="CDRef" class="middle-l" :style="middleLStyle" />
          <Lyric
            class="middle-r"
            :songReady="songReady"
            :currentTime="currentTime"
            @click-lyric="onClickLyric"
            @scroll-time="onChangeScrollLyric"
            @is-scrolling="onIsScrollingChange"
            ref="lyricRef"
            :style="middleRStyle"
          />
          <div
            class="lyric-time"
            :class="{ active: currentShow === 'lyric' && !isScrolling }"
          >
            {{ formatTime(scrollLyricTime) }}
          </div>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{ active: currentShow === 'cd' }"></span>
            <span
              class="dot"
              :class="{ active: currentShow === 'lyric' }"
            ></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{ formatTime(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <ProgressBar
                :ref="barRef"
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
          <Operators @loop="loop" :songReady="songReady" ref="operatorsRef" />
        </div>
      </div>
    </transition>
    <MiniPlayer :progress="progress" :songReady="songReady" />
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
      @play="play"
    ></audio>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed, watch, ref, nextTick } from 'vue'
import { formatTime } from '@/assets/js/util'
import Operators from './operators'
import ProgressBar from './progress-bar'
import CD from './cd'
import Lyric from './lyric'
import MiniPlayer from './mini-player'
import { PLAY_MODE } from '@/assets/js/constant'
import useMiddleInteractive from './use-middle-interactive'
import useAnimation from './use-animation'

export default {
  name: 'player',
  components: {
    Operators,
    ProgressBar,
    CD,
    Lyric,
    MiniPlayer
  },
  setup() {
    const audioRef = ref(null)
    const barRef = ref(null)
    const operatorsRef = ref(null)
    const songReady = ref(false)
    const store = useStore()
    const state = store.state
    const currentTime = ref(0)
    const lyricRef = ref(null)
    const scrollLyricTime = ref(0)
    const isScrolling = ref(true)
    let progressChanging = false

    // hooks
    const {
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd,
      currentShow,
      middleLStyle,
      middleRStyle
    } = useMiddleInteractive()

    const { CDRef, enter, afterEnter, leave, afterLeave } = useAnimation()

    const fullScreen = computed(() => state.fullScreen)
    const currentSong = computed(() => store.getters.currentSong)
    const playing = computed(() => state.playing)
    const playMode = computed(() => state.playMode)
    const playList = computed(() => state.playList)
    const progress = computed(
      () => currentTime.value / currentSong.value.duration
    )

    watch(currentSong, newSong => {
      store.commit('setPlayingLyric', '加载歌曲中...')
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
      const lyricRefVal = lyricRef.value
      if (newPlaying) {
        audioEl.play()
        lyricRefVal.playLyric()
      } else {
        lyricRefVal.stopLyric()
        audioEl.pause()
      }
    })

    // 解决全屏后 进度条进度丢失问题（因为display为none）
    watch(fullScreen, async newFullScreen => {
      if (newFullScreen) {
        if (!barRef.value) return
        await nextTick()
        barRef.value.setOffset(progress.value)
      }
    })

    const goBack = () => {
      store.commit('setFullScreen', false)
    }

    const pause = () => {
      store.commit('setPlayingState', false)
    }

    const play = () => {
      store.commit('setPlayingState', true)
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
      const lyricRefVal = lyricRef.value
      progressChanging = true
      currentTime.value = currentSong.value.duration * progress
      lyricRefVal.playLyric()
      lyricRefVal.stopLyric()
    }

    function onProgressChanged(progress) {
      progressChanging = false
      audioRef.value.currentTime = currentTime.value =
        currentSong.value.duration * progress
      if (!playing.value) {
        store.commit('setPlayingState', true)
      }
      lyricRef.value.playLyric()
    }

    function onProgressClick(progress) {
      lyricRef.value.stopLyric()
      audioRef.value.currentTime = currentTime.value =
        currentSong.value.duration * progress
      if (!playing.value) {
        store.commit('setPlayingState', true)
      }
      lyricRef.value.playLyric()
      // lyricRef.value.clickLyric(currentTime.value)
    }

    function onClickLyric(time) {
      lyricRef.value.stopLyric()
      if (!playing.value) {
        store.commit('setPlayingState', true)
      }
      console.log(time)
      audioRef.value.currentTime = currentTime.value = time / 1000
      lyricRef.value.playLyric()
    }

    function end() {
      currentTime.value = 0
      if (playMode.value === PLAY_MODE.loop) {
        loop()
      } else {
        operatorsRef.value.next()
      }
    }

    function onChangeScrollLyric(time) {
      scrollLyricTime.value = time / 1000
    }

    function onIsScrollingChange(flag) {
      isScrolling.value = flag
    }

    return {
      fullScreen,
      currentSong,
      audioRef,
      goBack,
      play,
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
      onProgressClick,
      onClickLyric,
      lyricRef,
      barRef,
      CDRef,
      operatorsRef,
      scrollLyricTime,
      onChangeScrollLyric,
      onIsScrollingChange,
      isScrolling,
      playList,
      // useMiddleInteractive
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd,
      currentShow,
      middleLStyle,
      middleRStyle,
      // useAnimation
      enter,
      afterEnter,
      leave,
      afterLeave
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

    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
      }

      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .lyric-time {
        position: absolute;
        top: 50%;
        right: 1%;
        font-size: 12px;
        color: #fff;
        transform: translateY(-50%) scale(0.83, 0.83);
        height: 20px;
        width: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: $color-text-l;
        background-color: rgba($color: $color-text-l, $alpha: 0.1);
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
        opacity: 0;

        &::before {
          position: absolute;
          content: '';
          left: -7px;
          border: 7px solid rgba($color: $color-text-l, $alpha: 0.1);
          border-right: 7px solid transparent;
          border-top: 7px solid transparent;
          border-bottom-left-radius: 4px;
          content: '';
          transform: rotateZ(45deg);
        }

        &.active {
          opacity: 1;
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .dot-wrapper {
        text-align: center;
        font-size: 0;

        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;

          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }

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

    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.6s;

      .top,
      .bottom {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }

    &.normal-enter-from,
    &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
}
</style>
