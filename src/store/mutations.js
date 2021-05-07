const mutations = {
  setPlayingState(state, playing) {
    state.playing = playing
  },
  setSquenceList(state, list) {
    state.sequenceList = list
  },
  setPlayList(state, list) {
    state.playList = list
  },
  setPlayMode(state, mode) {
    state.playMode = mode
  },
  setCurrentIndex(state, index) {
    state.currentIndex = index
  },
  setFullScreen(state, fullScreen) {
    state.fullScreen = fullScreen
  },
  setFavouriteList(state, list) {
    state.favouriteList = list
  }
}

export default mutations
