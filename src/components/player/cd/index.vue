<template>
  <div>
    <div class="cd-wrapper">
      <div class="cd" ref="cdRef">
        <img
          :src="currentSong.pic"
          :class="['image', cdCls]"
          ref="cdImageRef"
        />
      </div>
    </div>
    <div class="playing-lyric-wrapper">
      <div class="playing-lyric">{{ playingLyric }}</div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
import useCd from './use-cd'

export default {
  name: 'CD',
  setup() {
    const store = useStore()

    const { cdCls, cdRef, cdImageRef } = useCd()

    const currentSong = computed(() => store.getters.currentSong)
    const playingLyric = computed(() => store.state.playingLyric)

    return {
      currentSong,
      cdCls,
      cdRef,
      cdImageRef,
      playingLyric
    }
  }
}
</script>

<style lang="scss" scoped>
.cd-wrapper {
  position: absolute;
  left: 10%;
  top: 0;
  width: 80%;
  box-sizing: border-box;
  height: 100%;

  .cd {
    width: 100%;
    height: 100%;
    border-radius: 50%;

    img {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid rgba(255, 255, 255, 0.1);
    }

    .playing {
      animation: rotate 20s linear infinite;
    }
  }
}

.playing-lyric-wrapper {
  width: 80%;
  margin: 30px auto 0 auto;
  overflow: hidden;
  text-align: center;

  .playing-lyric {
    height: 20px;
    line-height: 20px;
    font-size: $font-size-medium;
    color: $color-text-l;
  }
}
</style>
