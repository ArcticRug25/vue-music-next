<template>
  <div class="progress-bar" ref="progressBarRef" @click="onClick">
    <div class="bar-inner">
      <div class="progress" :style="progressStyle" ref="progressRef"></div>
      <div class="progress-btn-wrapper">
        <div
          class="progress-btn"
          :style="btnStyle"
          @touchstart.prevent="onTouchStart"
          @touchmove.prevent="onTouchMove"
          @touchend.prevent="onTouchEnd"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import useProgress from './use-progress'

export default {
  name: 'progress-bar',
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  emits: ['progress-changing', 'progress-changed', 'progress-click'],
  setup(props, { emit }) {
    const {
      progressStyle,
      btnStyle,
      progressBarRef,
      progressRef,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onClick
    } = useProgress(props, emit)

    return {
      progressRef,
      progressBarRef,
      progressStyle,
      btnStyle,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onClick
    }
  }
}
</script>

<style lang="scss" scoped>
.progress-bar {
  height: 30px;

  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background-color: rgba($color: #000000, $alpha: 0.3);

    .progress {
      position: absolute;
      height: 100%;
      background-color: $color-theme;
    }

    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;

      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background-color: $color-theme;
      }
    }
  }
}
</style>
