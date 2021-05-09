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
  },
  addSongLyric(state, {
    song,
    lyric
  }) {
    state.sequenceList.map((item) => {
      if (item.mid === song.mid) {
        item.lyric = lyric
      }
      return item
    })
  },
  setPlayingLyric(state, lyric) {
    state.playingLyric = lyric
  }
}

export default mutations
