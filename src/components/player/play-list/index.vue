<template>
  <Teleport to="body">
    <Transition name="list-fade">
      <div class="playlist" v-show="visible && playList.length" @click="hide">
        <div class="list-wrapper" @click.stop>
          <div class="list-header">
            <h1 class="title">
              <i class="icon" :class="modeIcon" @click.stop="changeMode"></i>
              <span class="text">{{ modeText }}</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
          </div>
          <SongList ref="songListRef" @hide-list="hide" />
          <div class="list-add">
            <div class="add" @click="showAddSong">
              <i class="icon-add"></i>
              <span class="text">添加歌曲到队列</span>
            </div>
          </div>
          <div class="list-footer" @click.stop="hide">
            <span>关闭</span>
          </div>
        </div>
        <Confirm
          ref="confirmRef"
          @confirm="confirmClear"
          text="是否清空播放列表"
          confirm-btn-text="清空"
        />
        <AddSong ref="addSongRef" />
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import SongList from './song-list'
import Confirm from '@/components/base/confirm'
import AddSong from '@/components/add-song'
import { ref, computed, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import useMode from '../operators/use-mode'

export default {
  name: 'play-list',
  components: {
    SongList,
    Confirm,
    AddSong
  },
  setup() {
    const visible = ref(false)
    const songListRef = ref(null)
    const confirmRef = ref(null)
    const addSongRef = ref(null)

    const store = useStore()
    const state = store.state

    const playList = computed(() => state.playList)
    const currentSong = computed(() => store.getters.currentSong)

    const { modeIcon, changeMode, modeText } = useMode()

    watch(currentSong, async newSong => {
      if (!visible.value || !newSong.id) return
      await nextTick()
      songListRef.value.scrollToCurrentSong()
    })

    function hide() {
      visible.value = false
    }

    async function show() {
      visible.value = true
      await nextTick()
      songListRef.value.refreshScroll()
      songListRef.value.scrollToCurrentSong()
    }

    function showConfirm() {
      confirmRef.value.show()
    }

    function confirmClear() {
      store.dispatch('clearSongList')
      hide()
    }

    function showAddSong() {
      addSongRef.value.show()
    }

    return {
      visible,
      playList,
      hide,
      show,
      songListRef,
      confirmRef,
      addSongRef,
      showConfirm,
      confirmClear,
      showAddSong,
      // useMode
      modeIcon,
      changeMode,
      modeText
    }
  }
}
</script>

<style lang="scss" scoped>
.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;

  &.list-fade-enter-active,
  &.list-fade-leave-active {
    transition: opacity 0.3s;

    .list-wrapper {
      transition: all 0.3s;
    }
  }

  &.list-fade-enter-from,
  &.list-fade-leave-to {
    opacity: 0;

    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }

  .list-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 210;
    width: 100%;
    background-color: $color-highlight-background;

    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;

      .title {
        display: flex;
        align-items: center;

        .icon {
          margin-right: 10px;
          font-size: 24px;
          color: $color-theme-d;
        }

        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
        }

        .clear {
          @include extend-click();

          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }

    .list-add {
      width: 140px;
      margin: 20px auto 30px auto;

      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;

        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }

        .text {
          font-size: $font-size-small;
        }
      }
    }

    .list-footer {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>
