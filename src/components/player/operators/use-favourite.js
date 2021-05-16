import {
  useStore
} from 'vuex'
import {
  computed
} from 'vue'
import {
  save,
  remove
} from '@/assets/js/array-store'
import {
  FAVOURITE_KEY
} from '@/assets/js/constant'

export default function useFavourite() {
  const store = useStore()
  const state = store.state
  const maxLen = 100

  const favouriteList = computed(() => state.favouriteList)

  function toggleFavourite(song) {
    let list
    if (isFavourite(song)) {
      // remove
      list = remove(FAVOURITE_KEY, _compare)
    } else {
      // add
      list = save(song, FAVOURITE_KEY, _compare, maxLen)
    }
    store.commit('setFavouriteList', list)

    function _compare(item) {
      return item.id === song.id
    }
  }

  function cancelFavourite(song) {
    const list = remove(FAVOURITE_KEY, (item) => item.id === song.id)
    store.commit('setFavouriteList', list)
    return list
  }

  function getFavouriteIcon(song) {
    return isFavourite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }

  function isFavourite(song) {
    return favouriteList.value.findIndex((item) => item.id === song.id) > -1
  }

  return {
    getFavouriteIcon,
    toggleFavourite,
    cancelFavourite
  }
}
