<template>
  <div :class="['bubble-tip', { hide: !showBubble }]">
    <div class="circle" ref="circleRef" :style="bubbleTop">
      <span class="bubble-text">{{ bubbleInfo.text }}</span>
      <div class="square"></div>
    </div>
  </div>
</template>

<script>
import useBubble from './use-bubble'

export default {
  name: 'bubble-tip',
  props: {
    bubbleInfo: {
      type: Object,
      default() {
        return {
          index: 0,
          text: '热'
        }
      }
    }
  },
  setup(props) {
    const { circleRef, bubbleTop, showBubble } = useBubble(props)

    return {
      circleRef,
      bubbleTop,
      showBubble
    }
  }
}
</script>

<style lang="scss" scoped>
.bubble-tip {
  display: block;
  position: absolute;
  left: -70px;
  top: 0;
  opacity: 1;

  &.hide {
    opacity: 0;
    transition: .3s;
  }

  .circle {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 45px;
    width: 45px;
    border-radius: 50%;
    background-color: $color-highlight-background;
    box-shadow: 0 0 8px rgba($color: #000000, $alpha: 0.4);
    z-index: -1;

    .bubble-text {
      font-size: $font-size-large-x;
      font-weight: bold;
      color: $color-theme;
    }

    .square {
      position: absolute;
      height: 22.5px;
      width: 22.5px;
      top: 50%;
      right: 0;
      transform: translate(18%, -50%) rotate(45deg);
      background-color: $color-highlight-background;
      box-shadow: 2px -2px 2px rgba($color: #000000, $alpha: 0.2);
      z-index: -2;
    }
  }
}
</style>
