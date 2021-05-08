<template>
  <Scroll ref="lyricScrollRef">
    <div class="lyric-wrapper">
      <div v-if="currentLyric" ref="lyricListRef">
        <p
          class="text"
          :class="{ current: currentLineNum === index }"
          v-for="(line, index) in currentLyric.lines"
          :key="line.num"
        >
          {{ line.txt }}
        </p>
      </div>
      <!-- <div class="pure-music" v-show="pureMusicLyric">
      <p>{{ pureMusicLyric }}</p>
    </div> -->
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
  setup(props) {
    const {
      currentLyric,
      currentLineNum,
      lyricScrollRef,
      lyricListRef,
      stopLyric,
      playLyric,
      clickLyric
    } = useLyric(props)

    return {
      currentLyric,
      currentLineNum,
      lyricScrollRef,
      lyricListRef,
      stopLyric,
      playLyric,
      clickLyric
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

    .text {
      line-height: 32px;
      color: $color-text-l;
      font-size: $font-size-medium;

      &.current {
        color: $color-text;
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
