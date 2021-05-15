<template>
  <div class="search">
    <div class="search-input-wrapper">
      <SearchInput v-model="query" />
    </div>
    <div class="search-content" v-show="!query">
      <HotKeys :hotKeys="hotKeys" @tap-hot-key="tapHotKey" />
    </div>
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
import { getHotKeys } from '@/service/search'
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'

export default {
  name: 'search',
  components: {
    SearchInput,
    HotKeys,
    Suggest
  },
  setup() {
    const query = ref('')
    const hotKeys = ref([])
    const selectedSinger = ref(null)

    const store = useStore()

    const router = useRouter()

    getHotKeys().then(res => (hotKeys.value = res.hotKeys))

    function tapHotKey(key) {
      query.value = key.trim()
    }

    function selectSong(song) {
      store.dispatch('addSong', song)
    }

    function selectSinger(singer) {
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
      selectedSinger
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
  }

  .search-result {
    flex: 1;
    overflow: hidden;
  }
}
</style>
