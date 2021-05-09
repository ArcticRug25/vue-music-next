<template>
  <Scroll :probeType="3" ref="lyricScrollRef">
    <div class="lyric-wrapper">
      <div v-if="currentLyric" ref="lyricListRef">
        <p
          class="text"
          :class="{ current: currentLineNum === index }"
          v-for="(line, index) in currentLyric.lines"
          :key="line.num"
          @click="onClickLine(line.time)"
        >
          {{ line.txt }}
        </p>
      </div>
      <div class="pure-music" v-show="pureMusicLyric">
        <p>{{ pureMusicLyric }}</p>
      </div>
    </div>
  </Scroll>
</template>

<script>
import useLyric from './use-lyric'
import Scroll from '@/components/base/scroll'

export default {
  name: 'lyric',
  components: {
    Scroll
  },
  props: {
    songReady: Boolean,
    currentTime: Number
  },
  emits: ['click-lyric'],
  setup(props, { emit }) {
    const {
      currentLyric,
      currentLineNum,
      lyricScrollRef,
      lyricListRef,
      stopLyric,
      playLyric,
      clickLyric,
      pureMusicLyric
    } = useLyric(props)

    // 点击歌词跳转进度
    function onClickLine(time) {
      emit('click-lyric', time)
    }

    return {
      currentLyric,
      currentLineNum,
      lyricScrollRef,
      lyricListRef,
      stopLyric,
      playLyric,
      clickLyric,
      onClickLine,
      pureMusicLyric
    }
  }
}
</script>

<style lang="scss" scoped>
.middle-r {
  display: inline-block;
  vertical-align: top;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .lyric-wrapper {
    width: 80%;
    margin: 0 auto;
    overflow: hidden;
    text-align: center;
    padding-top: 50%;
    padding-bottom: 50%;

    .text {
      line-height: 32px;
      color: $color-text-l;
      font-size: $font-size-medium;
      transition: 0.4s;

      &.current {
        color: $color-text;
        font-size: $font-size-large;
      }
    }

    .pure-music {
      padding-top: 50%;
      line-height: 32px;
      color: $color-text-l;
      font-size: $font-size-medium;
    }
  }
}
</style>
