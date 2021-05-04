<template>
  <Scroll class="index-list" :probe-type="3" @scroll="onScroll" ref="scrollRef">
    <ul ref="groupRef">
      <li class="group" v-for="group in data" :key="group.title">
        <h2 class="title">{{ group.title }}</h2>
        <ul>
          <li class="item" v-for="item in group.list" :key="item.id">
            <img class="avatar" v-lazy="item.pic" />
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="fixed" v-show="fixedTitle" :style="fixedStyle">
      <div class="fixed-title">
        {{ fixedTitle }}
      </div>
    </div>
    <ShortcutList
      v-if="data.length"
      :data="data"
      :currentIndex="currentIndex"
      @scrollTo="scrollTo"
    />
  </Scroll>
</template>

<script>
import Scroll from '@/components/base/scroll'
import useFixed from './use-fixed'
import ShortcutList from './shortcut-list'

export default {
  name: 'index-list',
  components: {
    Scroll,
    ShortcutList
  },
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  emits: ['a'],
  setup(props) {
    const {
      groupRef,
      onScroll,
      fixedTitle,
      fixedStyle,
      currentIndex,
      scrollTo,
      scrollRef
    } = useFixed(props)

    return {
      groupRef,
      onScroll,
      fixedTitle,
      fixedStyle,
      currentIndex,
      scrollTo,
      scrollRef
    }
  }
}
</script>

<style lang="scss" scoped>
.index-list {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: $color-background;

  .group {
    padding-bottom: 30px;

    .title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }

    .item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 25px;

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        box-shadow: 0 0 8px rgba($color: #000000, $alpha: 0.5);
      }

      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }

  .fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }
}
</style>
