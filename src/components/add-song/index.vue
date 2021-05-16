<template>
  <Teleport to="body">
    <Transition name="slide">
      <div class="add-song" v-show="visible">
        <div class="header">
          <h1 class="title">添加歌曲到列表</h1>
          <div class="close" @click="hide">
            <i class="icon-close"></i>
          </div>
        </div>
        <div class="search-input-wrapper">
          <SearchInput v-model="query" placeholder="搜索歌曲" />
        </div>
        <div v-show="!query">
          <Switches :items="['最近播放', '搜索历史']" v-model="currentIndex" />
          <div class="list-wrapper">
            <Scroll
              ref="scrollRef"
              v-if="currentIndex === 0"
              class="list-scroll"
            >
              <div class="list-inner">
                <SongList
                  :songs="playHistory"
                  @select="selectSongBySongList"
                  @delete="deletePlay"
                  showDelete
                />
              </div>
            </Scroll>
            <Scroll
              ref="scrollRef"
              v-if="currentIndex === 1"
              class="list-scroll"
              v-no-result:[noHistoryText]="!searchHistory.length"
            >
              <div class="list-inner">
                <SearchList
                  :searches="searchHistory"
                  :show-delete="true"
                  @select="addQuery"
                  @delete="deleteSearch"
                />
              </div>
            </Scroll>
          </div>
        </div>
        <div class="search-result" v-show="query">
          <Suggest
            :query="query"
            :show-singer="false"
            @select-song="selectSongBySuggest"
          />
        </div>
        <Message ref="messageRef">
          <div class="message-title">
            <i class="icon-ok"></i>
            <span class="text">1首歌曲已经添加到播放列表</span>
          </div>
        </Message>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import SearchInput from '@/components/search/search-input'
import Suggest from '@/components/search/suggest'
import Switches from '@/components/base/switches'
import Scroll from '@/components/base/scroll'
import Message from '@/components/base/message'
import SongList from '@/components/base/song-list'
import SearchList from '@/components/search/search-history'
import { computed, nextTick, ref, watch } from 'vue'
import { useStore } from 'vuex'
import useSearchHistory from '@/components/search/use-search-history'
import usePlayHistory from '@/components/player/use-play-history'

export default {
  name: 'add-song',
  components: {
    SearchInput,
    Suggest,
    Switches,
    Scroll,
    SongList,
    SearchList,
    Message
  },
  setup() {
    const visible = ref(false)
    const query = ref('')
    const currentIndex = ref(0)
    const scrollRef = ref(null)
    const messageRef = ref(null)
    const noHistoryText = '暂无搜索记录'

    const store = useStore()
    const state = store.state
    const searchHistory = computed(() => state.searchHistory)
    const playHistory = computed(() => state.playHistory)

    const { deleteSearch, saveSearch } = useSearchHistory()

    const { deletePlay } = usePlayHistory()

    watch(query, async () => {
      await nextTick()
      refreshScroll()
    })

    function addQuery(s) {
      query.value = s
    }

    async function show() {
      visible.value = true
      await nextTick()
      refreshScroll()
    }

    function hide() {
      visible.value = false
    }

    function selectSongBySongList({ song }) {
      addSong(song)
    }

    function selectSongBySuggest(song) {
      addSong(song)
      saveSearch(query.value)
    }

    function addSong(song) {
      store.dispatch('addSong', song)
      showMessage()
    }

    function showMessage() {
      messageRef.value.show()
    }

    function refreshScroll() {
      scrollRef.value.scroll.refresh()
    }

    return {
      visible,
      query,
      show,
      hide,
      currentIndex,
      searchHistory,
      playHistory,
      addQuery,
      selectSongBySongList,
      selectSongBySuggest,
      scrollRef,
      messageRef,
      noHistoryText,
      // useSearchHistory
      deleteSearch,
      // usePlayHistory
      deletePlay
    }
  }
}
</script>

<style lang="scss" scoped>
.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 300;
  background: $color-background;

  .header {
    position: relative;
    height: 44px;
    text-align: center;

    .title {
      line-height: 44px;
      font-size: $font-size-large;
      color: $color-text;
    }

    .close {
      position: absolute;
      top: 0;
      right: 8px;

      .icon-close {
        display: block;
        padding: 12px;
        font-size: 20px;
        color: $color-theme;
      }
    }
  }

  .search-input-wrapper {
    margin: 20px;
  }

  .list-wrapper {
    position: absolute;
    top: 165px;
    bottom: 0;
    width: 100%;

    .list-scroll {
      height: 100%;
      overflow: hidden;

      .list-inner {
        padding: 0px 20px 20px 20px;
      }
    }
  }

  .search-result {
    position: fixed;
    top: 124px;
    bottom: 0;
    width: 100%;
  }
}

.message-title {
  text-align: center;
  padding: 18px 0;
  font-size: 0;

  .icon-ok {
    font-size: $font-size-medium;
    color: $color-theme;
    margin-right: 4px;
  }

  .text {
    font-size: $font-size-medium;
    color: $color-text;
  }
}
</style>
