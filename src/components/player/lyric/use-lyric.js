import {
  useStore
} from 'vuex'
import {
  ref,
  computed,
  watch
} from 'vue'
import {
  getLyric
} from '@/service/song'
import Lyric from 'lyric-parser'

export default function useLyric(props) {
  const currentLyric = ref(null)
  const currentLineNum = ref(0)
  const lyricScrollRef = ref(null)
  const lyricListRef = ref(null)

  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)

  getLyricData(currentSong.value)

  watch(currentSong, (newSong) => {
    getLyricData(newSong)
  })

  watch(() => props.songReady, (newSongReady) => {
    if (newSongReady) {
      playLyric()
    }
  })

  async function getLyricData(song) {
    if (!song.url || !song.id) return
    stopLyric()
    currentLyric.value = null
    currentLineNum.value = 0
    const lyric = await getLyric(song)

    store.commit('addSongLyric', {
      song,
      lyric
    })
    // 在获取歌词的时候 如果切换歌曲 可能会发生问题
    if (currentSong.value.lyric !== lyric) {
      return
    }

    currentLyric.value = new Lyric(lyric, handleLyric)
    if (props.songReady) {
      playLyric()
    }
  }

  function playLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.seek(props.currentTime * 1000)
    }
  }

  // 点击进度条跳转歌词位置
  function clickLyric(time) {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.seek(time * 1000)
    }
  }

  function stopLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.stop()
    }
  }

  function handleLyric({
    lineNum
  }) {
    currentLineNum.value = lineNum
    const scrollComp = lyricScrollRef.value
    const listEl = lyricListRef.value
    if (!listEl) return
    if (lineNum > 5) {
      const lineEl = listEl.children[lineNum - 5]
      scrollComp.scroll.scrollToElement(lineEl, 1000)
    } else {
      scrollComp.scroll.scrollTo(0, 0, 1000)
    }
  }

  return {
    currentLyric,
    currentLineNum,
    lyricScrollRef,
    lyricListRef,
    stopLyric,
    playLyric,
    clickLyric
  }
}
