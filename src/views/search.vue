<template>
  <div class="search">
    <div class="search-input-wrapper">
      <SearchInput v-model="query" />
    </div>
    <Scroll ref="scrollRef" class="search-content" v-show="!query">
      <div>
        <HotKeys :hotKeys="hotKeys" @tap-hot-key="tapHotKey" />
        <div class="history-content">
          <SearchHistory
            :searches="searchHistory"
            @select="tapHotKey"
            @delete="deleteSearch"
          />
        </div>
      </div>
    </Scroll>
    <div class="search-result" v-show="query">
      <Suggest
        :query="query"
        @select-song="selectSong"
        @select-singer="selectSinger"
      />
    </div>
    <RouterView v-slot="{ Component }">
      <Transition appear name="slide">
        <component :is="Component" :data="selectedSinger" />
      </Transition>
    </RouterView>
  </div>
</template>

<script>
import SearchInput from '@/components/search/search-input'
import HotKeys from '@/components/search/hot-keys'
import Suggest from '@/components/search/suggest'
import SearchHistory from '@/components/search/search-history'
import Scroll from '@/components/wrap-scroll'
import { getHotKeys } from '@/service/search'
import { computed, nextTick, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'
import useSearchHistory from '@/components/search/use-search-history'

export default {
  name: 'search',
  components: {
    SearchInput,
    HotKeys,
    Suggest,
    SearchHistory,
    Scroll
  },
  setup() {
    const query = ref('')
    const hotKeys = ref([])
    const selectedSinger = ref(null)
    const scrollRef = ref(null)

    const store = useStore()
    const searchHistory = computed(() => store.state.searchHistory)

    const router = useRouter()

    const { saveSearch, deleteSearch } = useSearchHistory()

    getHotKeys().then(res => (hotKeys.value = res.hotKeys))

    watch(query, async newQuery => {
      if (!newQuery) {
        await nextTick()
        refreshScroll()
      }
    })

    function refreshScroll() {
      scrollRef.value.scroll.refresh()
    }

    function tapHotKey(key) {
      query.value = key.trim()
    }

    function selectSong(song) {
      saveSearch(query.value)
      store.dispatch('addSong', song)
    }

    function selectSinger(singer) {
      saveSearch(query.value)
      selectedSinger.value = singer
      cacheSinger(singer)
      router.push({
        path: `/search/${singer.mid}`
      })
    }

    function cacheSinger(singer) {
      storage.session.set(SINGER_KEY, singer)
    }

    return {
      query,
      hotKeys,
      tapHotKey,
      selectSong,
      selectSinger,
      selectedSinger,
      searchHistory,
      scrollRef,
      // useSearchHistory
      deleteSearch
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  display: flex;
  flex-direction: column;

  .search-input-wrapper {
    margin: 20px;
  }

  .search-content {
    flex: 1;
    overflow: hidden;

    .history-content {
      margin: 0 20px;
    }
  }

  .search-result {
    flex: 1;
    overflow: hidden;
  }
}
</style>
