<template>
  <Scroll class="index-list" :probe-type="3" @scroll="onScroll" ref="scrollRef">
    <ul ref="groupRef">
      <li class="group" v-for="(group, index) in data" :key="group.title">
        <h2 class="title">{{ group.title }}</h2>
        <ul @click="onItemClick">
          <li
            class="item"
            v-for="item in group.list"
            :data-info="`${item.id},${index}`"
            :key="item.id"
          >
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
import Scroll from '@/components/wrap-scroll'
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
  emits: ['select'],
  setup(props, { emit }) {
    const {
      groupRef,
      onScroll,
      fixedTitle,
      fixedStyle,
      currentIndex,
      scrollTo,
      scrollRef
    } = useFixed(props)

    function onItemClick(e) {
      let target = e.target
      if (target.parentNode.nodeName.toLowerCase() === 'li') {
        target = e.target.parentNode
      }
      const info = target.dataset.info.split(',')
      const targetList = props.data[info[1]].list
      // eslint-disable-next-line eqeqeq
      const targetItem = targetList.find(item => item.id == info[0])
      emit('select', targetItem)
    }

    return {
      groupRef,
      onScroll,
      fixedTitle,
      fixedStyle,
      currentIndex,
      scrollTo,
      scrollRef,
      onItemClick
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
