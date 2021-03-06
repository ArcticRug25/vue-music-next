import {
  PLAY_MODE,
  SEARCH_KEY
} from '@/assets/js/constant'
import {
  load
} from '@/assets/js/array-store'

const state = {
  // 歌曲列表
  sequenceList: [],
  // 正在播放的歌曲列表
  playList: [],
  // 播放状态
  playing: false,
  // 播放模式
  playMode: PLAY_MODE.sequence,
  // 播放索引
  currentIndex: 0,
  // 播放是否全屏
  fullScreen: false,
  // 歌曲收藏列表
  favouriteList: [],
  // 当前歌词
  playingLyric: '',
  // 搜索历史
  searchHistory: load(SEARCH_KEY),
  // 播放历史
  playHistory: []
}

export default state
