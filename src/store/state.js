import {
  PLAY_MODE
} from '@/assets/js/constant'

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
  fullScreen: false
}

export default state
