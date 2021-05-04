<template>
  <div
    class="shortcut"
    @touchstart.stop.prevent="onShortcutTouchStart"
    @touchmove.stop.prevent="onShortcutTouchMove"
    @touchend.stop.prevent="onShortcutTouchEnd"
  >
    <ul class="shortcut-list">
      <li
        :class="['item', { current: currentIndex === index }]"
        v-for="(item, index) in shortcutList"
        :key="item"
        :data-index="index"
      >
        {{ item }}
      </li>
      <BubbleTip :bubbleInfo="bubbleInfo" />
    </ul>
  </div>
</template>

<script>
import BubbleTip from './bubble-tip'
import useShortcut from './use-shortcut'

export default {
  name: 'shortcut-list',
  components: {
    BubbleTip
  },
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    currentIndex: {
      type: Number,
      default: 0
    },
    groupRef: {
      type: Object
    }
  },
  emits: ['scrollTo'],
  setup(props, { emit }) {
    const {
      shortcutList,
      onShortcutTouchStart,
      onShortcutTouchMove,
      onShortcutTouchEnd,
      bubbleInfo
    } = useShortcut(props, emit)

    return {
      shortcutList,
      onShortcutTouchStart,
      onShortcutTouchMove,
      onShortcutTouchEnd,
      bubbleInfo
    }
  }
}
</script>

<style lang="scss" scoped>
.shortcut {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  padding: 20px 0;
  border-radius: 10px;
  text-align: center;
  background: $color-background-d;
  font-family: Helvetica;
  box-shadow: 4px 4px 6px rgba($color: #000000, $alpha: 0.2);

  .shortcut-list {
    position: relative;

    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;

      &.current {
        color: $color-theme;
      }
    }
  }
}
</style>
