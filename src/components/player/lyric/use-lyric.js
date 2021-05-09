import {
  useStore
} from 'vuex'
import {
  ref,
  computed,
  watch,
  nextTick,
  onMounted
} from 'vue'
import {
  getLyric
} from '@/service/song'
import Lyric from 'lyric-parser'

export default function useLyric(props) {
  let touching = false
  let lyricAreaMap = []
  const currentLyric = ref(null)
  const currentLineNum = ref(0)
  const lyricScrollRef = ref(null)
  const lyricListRef = ref(null)
  const pureMusicLyric = ref('')

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
    const hasLyric = currentLyric.value.lines.length
    initLyricTop()
    if (hasLyric) {
      if (props.songReady) {
        playLyric()
      }
    } else {
      const playingLyric = lyric.replace(/^\[.*\]/, '') // /\[(\d{2}):(\d{2}):(\d{2})\]/
      store.commit('setPlayingLyric', playingLyric)
      pureMusicLyric.value = playingLyric
    }
  }

  async function playLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      // 这里需要等currentTime更新为点击进度条的时间再执行 否则currentTime为更改前的时间
      await nextTick()
      currentLyricVal.seek(props.currentTime * 1000)
    }
  }

  onMounted(() => {
    const bs = lyricScrollRef.value.scroll
    console.log(lyricAreaMap)
    const scrollEnd = 3000
    const actionsHandlerHooks = bs.scroller.actionsHandler.hooks
    const scrollHooks = bs.scroller.hooks
    scrollHooks.on('scroll', ({
      y
    }) => {
      const {
        top,
        bottom
      } = lyricAreaMap[6]
      const index = lyricAreaMap.findIndex(item => item.top - y >= top && item.bottom - y <= bottom)
      console.log(index)
    })
    actionsHandlerHooks.on('move', () => {
      bs.stop()
      touching = true
    })
    actionsHandlerHooks.on('end', () => {
      setTimeout(() => {
        touching = false
      }, scrollEnd)
    })
    bs.on('enable', () => {
      initLyricTop()
    })
  })

  async function initLyricTop() {
    await nextTick()
    const lyricListEl = [].slice.call(lyricListRef.value.children)
    lyricAreaMap = lyricListEl.map(item => ({
      top: item.offsetTop,
      bottom: item.offsetTop + 32
    }))
    console.log(lyricAreaMap)
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

  // lineNum 歌词条数 txt 当前播放歌词
  function handleLyric({
    lineNum,
    txt
  }) {
    currentLineNum.value = lineNum
    store.commit('setPlayingLyric', txt)
    const scrollComp = lyricScrollRef.value
    const listEl = lyricListRef.value
    if (!listEl) return
    // 判断用户是否在滚动
    if (touching) return
    console.log(lineNum)
    if (lineNum > 6) {
      const lineEl = listEl.children[lineNum - 6]
      scrollComp.scroll.scrollToElement(lineEl, 1000)
    } else {
      scrollComp.scroll.scrollTo(0, 0, 1000)
    }
  }

  return {
    currentLyric,
    pureMusicLyric,
    currentLineNum,
    lyricScrollRef,
    lyricListRef,
    stopLyric,
    playLyric,
    clickLyric
  }
}
